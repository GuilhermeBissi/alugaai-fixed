import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen(){
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("demo@exemplo.com");

  const handleLogin = () => {
    signIn({ email });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>aluga.ai</Text>
        <Text style={styles.subtitle}>Alugue e compartilhe itens com segurança</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" placeholder="Email" />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f172a' },
  card:{ width:'92%', maxWidth:420, backgroundColor:'#0b1220', padding:24, borderRadius:16, shadowColor:'#000', elevation:8 },
  title:{ color:'#fff', fontSize:32, fontWeight:'800', marginBottom:6 },
  subtitle:{ color:'#94a3b8', marginBottom:18 },
  input:{ backgroundColor:'#0f172a', padding:12, borderRadius:10, color:'#fff', marginBottom:12, borderWidth:1, borderColor:'#111827' },
  button:{ backgroundColor:'#06b6d4', padding:14, borderRadius:10, alignItems:'center' },
  buttonText:{ color:'#021024', fontWeight:'700' }
});