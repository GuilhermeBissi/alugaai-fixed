// App.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { ItemsProvider } from "./src/context/ItemsContext";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";

function RootNavigator() {
  const { user } = useContext(AuthContext);
  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ItemsProvider>
    </AuthProvider>
  );
}