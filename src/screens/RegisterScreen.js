import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter no mínimo 3 caracteres";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const success = await signUp({ name, email, password });
      if (!success) {
        Alert.alert("Erro", "Erro ao criar conta. Tente novamente.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao criar a conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para começar a alugar</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(prev => ({ ...prev, name: null }));
              }}
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Nome completo"
              placeholderTextColor="#64748b"
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: null }));
              }}
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: null }));
              }}
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Senha"
              placeholderTextColor="#64748b"
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors(prev => ({ ...prev, confirmPassword: null }));
              }}
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Confirmar senha"
              placeholderTextColor="#64748b"
              secureTextEntry
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity 
            onPress={handleRegister}
            style={[styles.button, loading && styles.buttonDisabled]} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#021024" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0b1220',
    padding: 32,
    borderRadius: 16,
    alignSelf: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#06b6d4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#0891b2',
    opacity: 0.7,
  },
  buttonText: {
    color: '#021024',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  link: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '600',
  },
});