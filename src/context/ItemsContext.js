// src/context/ItemsContext.js
import React, { createContext, useState } from "react";

export const ItemsContext = createContext({});

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems(prevItems => [item, ...prevItems]);
  };

  const deleteItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId, updatedData) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, ...updatedData } : item
      )
    );
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, deleteItem, updateItem }}>
      {children}
    </ItemsContext.Provider>
  );
}