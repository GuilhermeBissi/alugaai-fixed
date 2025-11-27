// src/components/ItemCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function ItemCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
            onLoad={() => console.log('✅ Imagem carregou no card:', item.title)}
            onError={(e) => {
              console.log('❌ Erro ao carregar imagem no card:', item.title);
              console.log('URL:', item.imageUrl);
            }}
          />
        ) : (
          <Text style={styles.placeholderText}>📦</Text>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    // ⚠️ NÃO coloque resizeMode aqui (deprecado)
  },
  placeholderText: {
    fontSize: 48,
  },
  info: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  price: {
    color: '#06b6d4',
    fontSize: 18,
    fontWeight: '600',
  },
  categoryBadge: {
    marginTop: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});