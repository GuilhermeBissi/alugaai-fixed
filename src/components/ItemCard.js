import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ItemCard({ item, onPress }){
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.thumb}><Text style={{color:'#94a3b8'}}>img</Text></View>
      </View>
      <View style={styles.right}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{ flexDirection:'row', backgroundColor:'#071327', padding:12, borderRadius:12, marginBottom:12, alignItems:'center' },
  left:{ marginRight:12 },
  thumb:{ width:72, height:72, borderRadius:10, backgroundColor:'#0b2740', justifyContent:'center', alignItems:'center' },
  right:{ flex:1 },
  title:{ color:'#fff', fontWeight:'700', marginBottom:6 },
  price:{ color:'#06b6d4', fontWeight:'700' }
});