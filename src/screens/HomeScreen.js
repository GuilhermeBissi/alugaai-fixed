import React, { useContext } from "react";
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

const SAMPLE = [
  { id: '1', title: 'Bicicleta elétrica', price: 'R$ 25/dia', image: null },
  { id: '2', title: 'Projetor portátil', price: 'R$ 40/dia', image: null },
  { id: '3', title: 'Caixa de som JBL', price: 'R$ 15/dia', image: null },
  { id: '4', title: 'Ferramentas (kit)', price: 'R$ 30/dia', image: null }
];

export default function HomeScreen({ navigation }){
  const { user, signOut } = useContext(AuthContext);

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
        data={SAMPLE}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding:16 }}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { item })} />
        )}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Itens disponíveis</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0b1220' },
  header:{ padding:16, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  welcome:{ color:'#fff', fontSize:20, fontWeight:'700' },
  place:{ color:'#94a3b8' },
  logout:{ backgroundColor:'#111827', padding:8, borderRadius:8 },
  logoutText:{ color:'#fff' },
  sectionTitle:{ color:'#cbd5e1', fontSize:18, fontWeight:'700', marginBottom:12 }
});