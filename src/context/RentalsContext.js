import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "./AuthContext";

export const RentalsContext = createContext();

export function RentalsProvider({ children }) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Busca aluguéis em tempo real
  useEffect(() => {
    if (!user) {
      setRentals([]);
      setLoading(false);
      return;
    }

    // Busca todos os aluguéis onde o usuário é locatário OU proprietário
    const q = query(
      collection(db, "rentals"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rentalsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(rental => 
          rental.userId === user.id || rental.ownerId === user.id
        );
      
      setRentals(rentalsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Criar novo pedido de aluguel
  const createRental = async (rentalData) => {
    try {
      const newRental = {
        ...rentalData,
        userId: user.id,
        userName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "rentals"), newRental);
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar aluguel:", error);
      return { success: false, error: error.message };
    }
  };

  // Aprovar pedido de aluguel
  const approveRental = async (rentalId) => {
    try {
      const rentalRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalRef, {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
      console.log("Aluguel aprovado com sucesso!");
      return { success: true };
    } catch (error) {
      console.error("Erro ao aprovar aluguel:", error);
      return { success: false, error: error.message };
    }
  };

  // Rejeitar pedido de aluguel
  const rejectRental = async (rentalId) => {
    try {
      const rentalRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });
      console.log("Aluguel rejeitado com sucesso!");
      return { success: true };
    } catch (error) {
      console.error("Erro ao rejeitar aluguel:", error);
      return { success: false, error: error.message };
    }
  };

  // Cancelar aluguel
  const cancelRental = async (rentalId) => {
    try {
      const rentalRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao cancelar aluguel:", error);
      return { success: false, error: error.message };
    }
  };

  // Marcar como ativo
  const activateRental = async (rentalId) => {
    try {
      const rentalRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalRef, {
        status: 'active',
        activatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao ativar aluguel:", error);
      return { success: false, error: error.message };
    }
  };

  // Marcar como concluído
  const completeRental = async (rentalId) => {
    try {
      const rentalRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalRef, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao concluir aluguel:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <RentalsContext.Provider value={{ 
      rentals, 
      loading,
      createRental,
      approveRental,
      rejectRental,
      cancelRental,
      activateRental,
      completeRental
    }}>
      {children}
    </RentalsContext.Provider>
  );
}