import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ItemsContext } from "../context/ItemsContext";
import ItemCard from "../components/ItemCard";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);
  const { items } = useContext(ItemsContext);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtra itens baseado na busca
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Olá, {user?.name ?? 'usuário'}</Text>
          <Text style={styles.place}>Encontre itens perto de você</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyRentals')}
            style={styles.rentalsButton}
          >
            <Text style={styles.rentalsButtonText}>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.logout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar itens ou categorias..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Itens */}
      <FlatList
        data={filteredItems}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetails', { item })}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Resultados (${filteredItems.length})` : 'Itens disponíveis'}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateItem')}
            >
              <Text style={styles.addButtonText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {searchQuery ? '🔍' : '📦'}
            </Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum item cadastrado'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Tente buscar por outro termo'
                : 'Comece adicionando seu primeiro item para aluguel'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('CreateItem')}
              >
                <Text style={styles.emptyButtonText}>Criar primeiro item</Text>
              </TouchableOpacity>
            )}
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 14,
    paddingRight: 45,
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  clearButton: {
    position: 'absolute',
    right: 26,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
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

  headerButtons: {
  flexDirection: 'row',
  gap: 8,
},
rentalsButton: {
  backgroundColor: '#111827',
  padding: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
},
rentalsButtonText: {
  fontSize: 18,
},
});