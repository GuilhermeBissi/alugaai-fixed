import React, { createContext, useState } from "react";

export const RentalsContext = createContext({});

export function RentalsProvider({ children }) {
  const [rentals, setRentals] = useState([]);

  // Criar novo aluguel
  const createRental = ({ item, userId, userName, startDate, endDate, totalDays, totalPrice }) => {
    const newRental = {
      id: Date.now().toString(),
      itemId: item.id,
      itemTitle: item.title,
      itemPrice: item.price,
      userId,
      userName,
      startDate,
      endDate,
      totalDays,
      totalPrice,
      status: 'pending', // pending, active, completed, cancelled
      createdAt: new Date().toISOString(),
    };

    setRentals(prev => [newRental, ...prev]);
    return newRental;
  };

  // Buscar aluguéis do usuário
  const getUserRentals = (userId) => {
    return rentals.filter(rental => rental.userId === userId);
  };

  // Buscar aluguéis de um item
  const getItemRentals = (itemId) => {
    return rentals.filter(rental => rental.itemId === itemId);
  };

  // Atualizar status do aluguel
  const updateRentalStatus = (rentalId, newStatus) => {
    setRentals(prev =>
      prev.map(rental =>
        rental.id === rentalId ? { ...rental, status: newStatus } : rental
      )
    );
  };

  // Cancelar aluguel
  const cancelRental = (rentalId) => {
    updateRentalStatus(rentalId, 'cancelled');
  };

  return (
    <RentalsContext.Provider
      value={{
        rentals,
        createRental,
        getUserRentals,
        getItemRentals,
        updateRentalStatus,
        cancelRental,
      }}
    >
      {children}
    </RentalsContext.Provider>
  );
}