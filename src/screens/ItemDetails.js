import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

export default function ItemDetails({ route }){
  const { item } = route.params || {};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imagePlaceholder}><Text style={{color:'#94a3b8'}}>Imagem</Text></View>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.price}>{item?.price}</Text>
        <Text style={styles.description}>Descrição simples do item para demonstração. Adicione detalhes, regras de uso e disponibilidade.</Text>
        <TouchableOpacity style={styles.rentButton}>
          <Text style={styles.rentText}>Alugar agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0b1220' },
  content:{ padding:20 },
  imagePlaceholder:{ height:200, borderRadius:12, backgroundColor:'#071327', justifyContent:'center', alignItems:'center', marginBottom:16 },
  title:{ color:'#fff', fontSize:22, fontWeight:'800' },
  price:{ color:'#06b6d4', fontWeight:'700', marginTop:6, marginBottom:10 },
  description:{ color:'#94a3b8', marginBottom:20 },
  rentButton:{ backgroundColor:'#06b6d4', padding:14, borderRadius:12, alignItems:'center' },
  rentText:{ color:'#021024', fontWeight:'800' }
});