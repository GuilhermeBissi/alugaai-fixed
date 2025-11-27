import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { RentalsContext } from "../context/RentalsContext";
import { showAlert } from "../utils/alert";

export default function ManageRequestsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { rentals, approveRental, rejectRental } = useContext(RentalsContext);

  // Filtra pedidos recebidos pelo usuário (como proprietário)
  const receivedRequests = rentals.filter(rental => rental.ownerId === user.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'active': return '#06b6d4';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleApprove = (rental) => {
    showAlert(
      "Aprovar Pedido",
      `Deseja aprovar o aluguel de "${rental.itemTitle}" para ${rental.userName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprovar",
          onPress: async () => {
            const result = await approveRental(rental.id);
            if (result.success) {
              showAlert("Aprovado! ✅", "O pedido foi aprovado com sucesso!");
            }
          }
        }
      ]
    );
  };

  const handleReject = (rental) => {
    showAlert(
      "Rejeitar Pedido",
      `Deseja rejeitar o aluguel de "${rental.itemTitle}" para ${rental.userName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rejeitar",
          style: "destructive",
          onPress: async () => {
            const result = await rejectRental(rental.id);
            if (result.success) {
              showAlert("Rejeitado", "O pedido foi rejeitado.");
            }
          }
        }
      ]
    );
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
  };

  const RequestCard = ({ rental }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestTitleContainer}>
          <Text style={styles.requestTitle}>{rental.itemTitle}</Text>
          <Text style={styles.requesterName}>Solicitante: {rental.userName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(rental.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(rental.status) }]}>
            {getStatusText(rental.status)}
          </Text>
        </View>
      </View>

      <View style={styles.requestInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Período:</Text>
          <Text style={styles.infoValue}>{rental.totalDays} dia(s)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data início:</Text>
          <Text style={styles.infoValue}>{formatDate(rental.startDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data fim:</Text>
          <Text style={styles.infoValue}>{formatDate(rental.endDate)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{rental.totalPrice}</Text>
        </View>
      </View>

      {rental.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(rental)}
          >
            <Text style={styles.approveButtonText}>✓ Aprovar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(rental)}
          >
            <Text style={styles.rejectButtonText}>✕ Rejeitar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Agrupa pedidos por status
  const pendingRequests = receivedRequests.filter(r => r.status === 'pending');
  const otherRequests = receivedRequests.filter(r => r.status !== 'pending');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedidos Recebidos</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={[...pendingRequests, ...otherRequests]}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        renderItem={({ item }) => <RequestCard rental={item} />}
        ListHeaderComponent={
          pendingRequests.length > 0 ? (
            <View style={styles.statsCard}>
              <Text style={styles.statsIcon}>⏳</Text>
              <Text style={styles.statsText}>
                {pendingRequests.length} pedido(s) aguardando resposta
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📬</Text>
            <Text style={styles.emptyTitle}>Nenhum pedido recebido</Text>
            <Text style={styles.emptyText}>
              Quando alguém solicitar alugar seus itens, os pedidos aparecerão aqui
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.emptyButtonText}>Voltar ao Início</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: '600',
    width: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsIcon: {
    fontSize: 24,
  },
  statsText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  requestCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  requesterName: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  requestInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#06b6d4',
    fontSize: 18,
    fontWeight: '800',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#021024',
    fontSize: 16,
    fontWeight: '700',
  },
});