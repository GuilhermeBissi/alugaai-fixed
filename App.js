// App.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { ItemsProvider } from "./src/context/ItemsContext";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";

function RootNavigator() {
  const { user } = useContext(AuthContext);
  
  if (user) {
    return (
      <ItemsProvider>
        <AppStack />
      </ItemsProvider>
    );
  }
  
  return <AuthStack />;
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}