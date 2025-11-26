// src/screens/HomeScreen.js
import React, { useContext } from "react";
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ItemsContext } from "../context/ItemsContext";
import ItemCard from "../components/ItemCard";

export default function HomeScreen({ navigation }){
  const { user, signOut } = useContext(AuthContext);
  const { items } = useContext(ItemsContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Olá, {user?.name ?? 'usuário'}</Text>
          <Text style={styles.place}>Encontre itens perto de você</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { item })} />
        )}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>Itens disponíveis</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateItem')}
            >
              <Text style={styles.addButtonText}>+ Adicionar Item</Text>
            </TouchableOpacity>
          </View>
        }
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
    backgroundColor: '#0b1220' 
  },
  header: { 
    padding: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  welcome: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '700' 
  },
  place: { 
    color: '#94a3b8',
    marginTop: 2,
  },
  logout: { 
    backgroundColor: '#111827', 
    padding: 8, 
    paddingHorizontal: 12,
    borderRadius: 8 
  },
  logoutText: { 
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    color: '#cbd5e1', 
    fontSize: 18, 
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#021024',
    fontSize: 14,
    fontWeight: '700',
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