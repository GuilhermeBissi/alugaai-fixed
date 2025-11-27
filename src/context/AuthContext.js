import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = async ({ email, password }) => {
    // Validação de login
    if (email && password && password.length >= 6) {
      const userData = { id: "1", name: "Usuário Demo", email };
      setUser(userData);
      return true;
    }
    return false;
  };

  const signUp = async ({ name, email, password }) => {
    // Validação de cadastro
    if (name && email && password && password.length >= 6) {
      const userData = { id: Date.now().toString(), name, email };
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
}