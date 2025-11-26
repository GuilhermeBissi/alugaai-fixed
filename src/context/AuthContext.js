import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = async ({ email, password }) => {
    // Validação completa
    if (email && password && password.length >= 6) {
      setUser({ id: "1", name: "Usuário Demo", email });
      return true;
    }
    return false;
  };

  const signUp = async ({ name, email, password }) => {
    // Validação para registro
    if (name && email && password && password.length >= 6) {
      setUser({ id: "1", name, email });
      return true;
    }
    return false;
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}