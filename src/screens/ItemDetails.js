// src/screens/ItemDetails.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";

export default function ItemDetails({ route, navigation }){
  const { item } = route.params || {};
  
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
          <TouchableOpacity style={styles.rentButton}>
            <Text style={styles.rentText}>Alugar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  }
});