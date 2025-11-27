import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { db, storage } from "../firebase";
import { AuthContext } from "./AuthContext";

export const ItemsContext = createContext();

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Busca itens em tempo real
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        console.log('=== ITEM DO FIRESTORE ===');
        console.log('ID:', doc.id);
        console.log('Título:', data.title);
        console.log('imageUrl:', data.imageUrl);
        console.log('========================');
        
        return {
          id: doc.id,
          ...data
        };
      });
      
      setItems(itemsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 📸 Upload para Firebase Storage
  const uploadImageToStorage = async (uri) => {
    if (!uri) {
      console.log('⚠️ Nenhuma imagem para fazer upload');
      return null;
    }

    try {
      console.log('📤 Iniciando upload para Firebase Storage...');
      console.log('URI:', uri);

      // Buscar o arquivo
      const response = await fetch(uri);
      const blob = await response.blob();
      
      console.log('📦 Blob criado:', blob.size, 'bytes');

      // Nome único para o arquivo
      const filename = `items/${user.id}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      console.log('☁️ Fazendo upload para:', filename);

      // Fazer upload
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('✅ Upload concluído!');

      // Pegar URL pública
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('🔗 URL da imagem:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('❌ Erro ao fazer upload:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem:', error.message);
      
      // Mensagem mais amigável
      if (error.code === 'storage/unauthorized') {
        console.error('⚠️ Erro de permissão! Verifique as regras do Storage.');
      }
      
      throw error;
    }
  };

  // Adicionar novo item
  const addItem = async (itemData) => {
    try {
      console.log('📝 Criando novo item...');
      console.log('Dados recebidos:', itemData);

      let imageUrl = null;

      // Se tem imagem, fazer upload
      if (itemData.imageUrl) {
        console.log('🖼️ Item tem imagem, fazendo upload...');
        imageUrl = await uploadImageToStorage(itemData.imageUrl);
      } else {
        console.log('ℹ️ Item sem imagem');
      }

      // Criar documento no Firestore
      const newItem = {
        title: itemData.title,
        description: itemData.description,
        price: itemData.price,
        category: itemData.category,
        imageUrl: imageUrl, // ← URL do Firebase Storage
        ownerId: user.id,
        ownerName: user.name,
        createdAt: new Date().toISOString()
      };

      console.log('💾 Salvando no Firestore:', newItem);

      const docRef = await addDoc(collection(db, "items"), newItem);
      
      console.log('✅ Item criado com sucesso! ID:', docRef.id);

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("❌ Erro ao adicionar item:", error);
      console.error("Detalhes:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Atualizar item
  const updateItem = async (itemId, updates) => {
    try {
      console.log('📝 Atualizando item:', itemId);
      console.log('Dados:', updates);

      let finalUpdates = { ...updates };

      // Se tem nova imagem para fazer upload
      if (updates.imageUrl && !updates.imageUrl.startsWith('http')) {
        console.log('🖼️ Nova imagem detectada, fazendo upload...');
        const newImageUrl = await uploadImageToStorage(updates.imageUrl);
        finalUpdates.imageUrl = newImageUrl;
      }

      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, {
        ...finalUpdates,
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Item atualizado com sucesso!');
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      return { success: false, error: error.message };
    }
  };

  // Deletar item
  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "items", itemId));
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <ItemsContext.Provider value={{ 
      items, 
      loading, 
      addItem, 
      updateItem, 
      deleteItem 
    }}>
      {children}
    </ItemsContext.Provider>
  );
}