// screens/MyItemsScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ItemsContext } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard';

export default function MyItemsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { items, deleteItem } = useContext(ItemsContext);

  // Filtrar apenas os itens do usuário atual
  const myItems = items.filter(item => item.ownerId === user?.id);

  const handleDeleteItem = (itemId, itemTitle) => {
    Alert.alert(
      'Deletar Item',
      `Tem certeza que deseja deletar "${itemTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteItem(itemId);
            if (result.success) {
              Alert.alert('Sucesso', 'Item deletado com sucesso!');
            } else {
              Alert.alert('Erro', 'Não foi possível deletar o item');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meus Itens 📦</Text>
          <Text style={styles.subtitle}>
            {myItems.length} {myItems.length === 1 ? 'item' : 'itens'} cadastrado{myItems.length === 1 ? '' : 's'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateItem')}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Itens */}
      <FlatList
        data={myItems}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View>
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetails', { item })}
            />
            
            {/* Botões de ação */}
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditItem', { item })}
              >
                <Text style={styles.editButtonText}>✏️ Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id, item.title)}
              >
                <Text style={styles.deleteButtonText}>🗑️ Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Nenhum item cadastrado</Text>
            <Text style={styles.emptyText}>
              Comece adicionando seu primeiro item para aluguel
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('CreateItem')}
            >
              <Text style={styles.emptyButtonText}>Criar primeiro item</Text>
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
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#021024',
    fontSize: 14,
    fontWeight: '700',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
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