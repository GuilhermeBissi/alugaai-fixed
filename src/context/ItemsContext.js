// src/context/ItemsContext.js
import React, { createContext, useState } from "react";

export const ItemsContext = createContext({});

// Itens de exemplo iniciais
const INITIAL_ITEMS = [
  { id: '1', title: 'Bicicleta elétrica', price: 'R$ 25/dia', image: null, description: 'Bicicleta elétrica em ótimo estado', category: 'Veículos' },
  { id: '2', title: 'Projetor portátil', price: 'R$ 40/dia', image: null, description: 'Projetor Full HD portátil', category: 'Eletrônicos' },
  { id: '3', title: 'Caixa de som JBL', price: 'R$ 15/dia', image: null, description: 'Caixa de som bluetooth', category: 'Eletrônicos' },
  { id: '4', title: 'Ferramentas (kit)', price: 'R$ 30/dia', image: null, description: 'Kit completo de ferramentas', category: 'Ferramentas' }
];

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(INITIAL_ITEMS);

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