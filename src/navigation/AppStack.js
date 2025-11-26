// src/navigation/AppStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ItemDetails from "../screens/ItemDetails";
import CreateItemScreen from "../screens/CreateItemScreen";

const Stack = createNativeStackNavigator();

export default function AppStack(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="CreateItem" component={CreateItemScreen} />
    </Stack.Navigator>
  );
}