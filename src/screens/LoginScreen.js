import React, { useState, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && password && password.length >= 6) {
      const userData = { id: "1", name: "Usuário Demo", email };
      setUser(userData);
      return true;
    }
    return false;
  };

  const signUp = async ({ name, email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (name && email && password && password.length >= 6) {
      const userData = { id: "1", name, email };
      setUser(userData);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const SAMPLE_ITEMS = [
  { id: '1', title: 'Bicicleta elétrica', price: 'R$ 25/dia', image: null },
  { id: '2', title: 'Projetor portátil', price: 'R$ 40/dia', image: null },
  { id: '3', title: 'Caixa de som JBL', price: 'R$ 15/dia', image: null },
  { id: '4', title: 'Ferramentas (kit)', price: 'R$ 30/dia', image: null }
];

function ItemCard({ item, onPress }) {
  return (
    <div onClick={onPress} style={styles.itemCard}>
      <div style={styles.imagePlaceholder}>
        <span style={styles.placeholderText}>📦</span>
      </div>
      <div style={styles.itemInfo}>
        <h3 style={styles.itemTitle}>{item.title}</h3>
        <p style={styles.itemPrice}>{item.price}</p>
      </div>
    </div>
  );
}

function HomeScreen({ onLogout }) {
  const { user } = useContext(AuthContext);
  
  return (
    <div style={styles.homeContainer}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.welcome}>Olá, {user?.name || 'usuário'}</h2>
          <p style={styles.place}>Encontre itens perto de você</p>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>
          Sair
        </button>
      </div>

      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Itens disponíveis</h3>
        <div style={styles.itemsGrid}>
          {SAMPLE_ITEMS.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onPress={() => alert(`Você clicou em: ${item.title}`)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const success = await signIn({ email, password });
      if (!success) {
        alert("Email ou senha incorretos");
      }
    } catch (error) {
      alert("Ocorreu um erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>aluga.ai</h1>
        <p style={styles.subtitle}>Alugue e compartilhe itens com segurança</p>
        
        <div style={styles.inputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: null }));
            }}
            style={{...styles.input, ...(errors.email && styles.inputError)}}
            placeholder="Email"
            autoComplete="email"
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: null }));
            }}
            style={{...styles.input, ...(errors.password && styles.inputError)}}
            placeholder="Senha"
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        <button 
          onClick={handleLogin}
          style={{...styles.button, ...(loading && styles.buttonDisabled)}} 
          disabled={loading}
          type="button"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={styles.footer}>
          <span style={styles.footerText}>Não tem uma conta? </span>
          <button onClick={() => onNavigate('register')} style={styles.link} type="button">
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onNavigate }) {
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

  const handleRegister = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const success = await signUp({ name, email, password });
      if (!success) {
        alert("Erro ao criar conta. Tente novamente.");
      }
    } catch (error) {
      alert("Ocorreu um erro ao criar a conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Criar Conta</h1>
        <p style={styles.subtitle}>Cadastre-se para começar a alugar</p>
        
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: null }));
            }}
            style={{...styles.input, ...(errors.name && styles.inputError)}}
            placeholder="Nome completo"
          />
          {errors.name && <span style={styles.errorText}>{errors.name}</span>}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: null }));
            }}
            style={{...styles.input, ...(errors.email && styles.inputError)}}
            placeholder="Email"
            autoComplete="email"
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: null }));
            }}
            style={{...styles.input, ...(errors.password && styles.inputError)}}
            placeholder="Senha"
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: null }));
            }}
            style={{...styles.input, ...(errors.confirmPassword && styles.inputError)}}
            placeholder="Confirmar senha"
          />
          {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

        <button 
          onClick={handleRegister}
          style={{...styles.button, ...(loading && styles.buttonDisabled)}} 
          disabled={loading}
          type="button"
        >
          {loading ? "Criando conta..." : "Cadastrar"}
        </button>

        <div style={styles.footer}>
          <span style={styles.footerText}>Já tem uma conta? </span>
          <button onClick={() => onNavigate('login')} style={styles.link} type="button">
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <AuthProvider>
      <AppContent currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </AuthProvider>
  );
}

function AppContent({ currentScreen, setCurrentScreen }) {
  const { user, signOut } = useContext(AuthContext);

  if (user) {
    return <HomeScreen onLogout={signOut} />;
  }

  return currentScreen === 'login' ? (
    <LoginScreen onNavigate={setCurrentScreen} />
  ) : (
    <RegisterScreen onNavigate={setCurrentScreen} />
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: '16px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#0b1220',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  title: {
    color: '#fff',
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '6px',
    marginTop: '0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '24px',
    marginTop: '0',
  },
  inputContainer: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    backgroundColor: '#0f172a',
    padding: '14px',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    border: '1px solid #1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    display: 'block',
    marginTop: '4px',
    marginLeft: '4px',
  },
  button: {
    width: '100%',
    backgroundColor: '#06b6d4',
    padding: '16px',
    borderRadius: '10px',
    border: 'none',
    color: '#021024',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s',
    fontFamily: 'inherit',
  },
  buttonDisabled: {
    backgroundColor: '#0891b2',
    opacity: '0.7',
    cursor: 'not-allowed',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  link: {
    color: '#06b6d4',
    fontSize: '14px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
    fontFamily: 'inherit',
  },
  homeContainer: {
    minHeight: '100vh',
    backgroundColor: '#0b1220',
  },
  header: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1e293b',
  },
  welcome: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  place: {
    color: '#94a3b8',
    margin: '0',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: '#111827',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  content: {
    padding: '16px',
  },
  sectionTitle: {
    color: '#cbd5e1',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
    marginTop: '0',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  itemCard: {
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #1e293b',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imagePlaceholder: {
    width: '100%',
    height: '160px',
    backgroundColor: '#1e293b',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: '48px',
  },
  itemInfo: {
    padding: '16px',
  },
  itemTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '6px',
    marginTop: '0',
  },
  itemPrice: {
    color: '#06b6d4',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
  },
};

export default App;