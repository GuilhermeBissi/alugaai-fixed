import React, { useState, useContext } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { RentalsContext } from "../context/RentalsContext";

export default function ItemDetails({ route, navigation }){
  const { item } = route.params || {};
  const { user } = useContext(AuthContext);
  const { createRental } = useContext(RentalsContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState("1");

  // Extrai o valor numérico do preço (ex: "R$ 25/dia" -> 25)
  const pricePerDay = parseFloat(item?.price?.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

  const handleRent = () => {
    const numDays = parseInt(days) || 1;
    const totalPrice = pricePerDay * numDays;

    // Criar aluguel
    const rental = createRental({
      item,
      userId: user.id,
      userName: user.name,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + numDays * 24 * 60 * 60 * 1000).toISOString(),
      totalDays: numDays,
      totalPrice: `R$ ${totalPrice.toFixed(2).replace('.', ',')}`,
    });

    setModalVisible(false);
    Alert.alert(
      "Solicitação enviada! 🎉",
      `Seu pedido de aluguel foi criado.\n\nTotal: R$ ${totalPrice.toFixed(2).replace('.', ',')}\nPeríodo: ${numDays} dia(s)`,
      [
        {
          text: "Ver meus aluguéis",
          onPress: () => navigation.navigate('MyRentals')
        },
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const totalPrice = (parseFloat(days) || 1) * pricePerDay;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Botão Voltar */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          {/* Imagem */}
          <View style={styles.imagePlaceholder}>
            {item?.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderIcon}>📦</Text>
            )}
          </View>

          {/* Informações */}
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.price}>{item?.price}</Text>
          
          {item?.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>
            {item?.description || 'Descrição não disponível'}
          </Text>

          {/* Botão Alugar */}
          <TouchableOpacity 
            style={styles.rentButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.rentText}>Solicitar Aluguel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Aluguel */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Solicitar Aluguel</Text>
            <Text style={styles.modalSubtitle}>{item?.title}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantos dias?</Text>
              <TextInput
                style={styles.input}
                value={days}
                onChangeText={setDays}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Valor por dia:</Text>
              <Text style={styles.priceValue}>R$ {pricePerDay.toFixed(2).replace('.', ',')}</Text>
            </View>

            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRent}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0b1220' 
  },
  scrollView: {
    flex: 1,
  },
  content: { 
    padding: 20 
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePlaceholder: { 
    height: 250, 
    borderRadius: 12, 
    backgroundColor: '#1e293b', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderIcon: {
    fontSize: 64,
  },
  title: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '800',
    marginBottom: 8,
  },
  price: { 
    color: '#06b6d4', 
    fontWeight: '700', 
    fontSize: 22,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: { 
    color: '#94a3b8', 
    marginBottom: 32,
    lineHeight: 22,
    fontSize: 15,
  },
  rentButton: { 
    backgroundColor: '#06b6d4', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    marginBottom: 20,
  },
  rentText: { 
    color: '#021024', 
    fontWeight: '800',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0b1220',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  priceValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginBottom: 24,
  },
  totalLabel: {
    color: '#cbd5e1',
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    color: '#06b6d4',
    fontSize: 20,
    fontWeight: '800',
  },
  modalButtons: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#06b6d4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#021024',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 16,
  },
});