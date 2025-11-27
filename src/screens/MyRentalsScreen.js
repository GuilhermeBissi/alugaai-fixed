import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { RentalsContext } from "../context/RentalsContext";

export default function MyRentalsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { rentals, cancelRental } = useContext(RentalsContext);

  // Filtra aluguéis do usuário atual
  const userRentals = rentals.filter(rental => rental.userId === user.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'active': return '#10b981';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleCancelRental = (rental) => {
    Alert.alert(
      "Cancelar Aluguel",
      `Deseja realmente cancelar o aluguel de "${rental.itemTitle}"?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => {
            cancelRental(rental.id);
            Alert.alert("Cancelado", "Aluguel cancelado com sucesso!");
          }
        }
      ]
    );
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
  };

  const RentalCard = ({ rental }) => (
    <View style={styles.rentalCard}>
      <View style={styles.rentalHeader}>
        <Text style={styles.rentalTitle}>{rental.itemTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(rental.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(rental.status) }]}>
            {getStatusText(rental.status)}
          </Text>
        </View>
      </View>

      <View style={styles.rentalInfo}>
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
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelRental(rental)}
        >
          <Text style={styles.cancelButtonText}>Cancelar Aluguel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Aluguéis</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={userRentals}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        renderItem={({ item }) => <RentalCard rental={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Nenhum aluguel ainda</Text>
            <Text style={styles.emptyText}>
              Quando você alugar um item, ele aparecerá aqui
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.emptyButtonText}>Buscar Itens</Text>
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
  rentalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rentalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
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
  rentalInfo: {
    gap: 8,
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
  cancelButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  cancelButtonText: {
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