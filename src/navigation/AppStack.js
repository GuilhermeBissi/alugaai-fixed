// navigation/AppStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import CreateItemScreen from "../screens/CreateItemScreen";
import EditItemScreen from "../screens/EditItemScreen";
import ItemDetails from "../screens/ItemDetails";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* TabNavigator como tela principal */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* Telas que abrem por cima das tabs */}
      <Stack.Screen 
        name="CreateItem" 
        component={CreateItemScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="EditItem" 
        component={EditItemScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="ItemDetails" 
        component={ItemDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}