// screens/EditItemScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { ItemsContext } from '../context/ItemsContext';
import { showAlert } from '../utils/alert';

let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  console.warn('expo-image-picker não instalado');
}

export default function EditItemScreen({ navigation, route }) {
  const { item } = route.params;
  const { updateItem } = useContext(ItemsContext);
  
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price.replace(/[^\d,]/g, '').replace(',', '.'));
  const [category, setCategory] = useState(item.category);
  const [imageUri, setImageUri] = useState(item.imageUrl);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const categories = [
    'Eletrônicos',
    'Ferramentas',
    'Esportes',
    'Música',
    'Veículos',
    'Camping',
    'Outros'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Título deve ter no mínimo 3 caracteres';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Descrição deve ter no mínimo 10 caracteres';
    }
    
    if (!price) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Preço deve ser um valor válido';
    }
    
    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    if (!ImagePicker) {
      showAlert('Recurso indisponível', 'ImagePicker não disponível');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      showAlert('Permissão negada', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Montar objeto de atualização
      const updates = {
        title: title.trim(),
        description: description.trim(),
        price: `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}/dia`,
        category,
      };

      // Se a imagem mudou (nova URI diferente da original)
      if (imageUri !== item.imageUrl) {
        updates.imageUrl = imageUri;
      }

      const result = await updateItem(item.id, updates);

      if (result.success) {
        showAlert('Sucesso! 🎉', 'Item atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        showAlert('Erro', 'Não foi possível atualizar o item');
      }
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      showAlert('Erro', 'Ocorreu um erro ao atualizar o item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Item</Text>
        <Text style={styles.headerSubtitle}>Atualize as informações do seu item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Foto do Item</Text>
          <TouchableOpacity style={styles.imageUploadArea} onPress={pickImage}>
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.changeImageBtn}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>📷 Trocar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadText}>Toque para adicionar foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título do Item *</Text>
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors(prev => ({ ...prev, title: null }));
            }}
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Ex: Bicicleta elétrica"
            placeholderTextColor="#64748b"
            maxLength={50}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria *</Text>
          <TouchableOpacity
            style={[styles.pickerButton, errors.category && styles.inputError]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={category ? styles.pickerTextSelected : styles.pickerTextPlaceholder}>
              {category || 'Selecione uma categoria'}
            </Text>
            <Text style={styles.pickerArrow}>{showCategoryPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          
          {showCategoryPicker && (
            <View style={styles.categoryList}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                    setErrors(prev => ({ ...prev, category: null }));
                  }}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                  {category === cat && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço por dia (R$) *</Text>
          <View style={[styles.priceInputContainer, errors.price && styles.inputError]}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                setErrors(prev => ({ ...prev, price: null }));
              }}
              style={styles.priceInput}
              placeholder="0,00"
              placeholderTextColor="#64748b"
              keyboardType="decimal-pad"
            />
          </View>
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors(prev => ({ ...prev, description: null }));
            }}
            style={[styles.textarea, errors.description && styles.inputError]}
            placeholder="Descreva seu item, condições de uso, o que está incluso, etc."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500 caracteres</Text>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageUploadArea: {
    width: '100%',
    height: 200,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1e293b',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#06b6d4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  changeImageText: {
    color: '#021024',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  pickerButton: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerTextSelected: {
    color: '#fff',
    fontSize: 15,
  },
  pickerTextPlaceholder: {
    color: '#64748b',
    fontSize: 15,
  },
  pickerArrow: {
    color: '#94a3b8',
    fontSize: 12,
  },
  categoryList: {
    marginTop: 8,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  categoryItem: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  categoryText: {
    color: '#fff',
    fontSize: 15,
  },
  checkmark: {
    color: '#06b6d4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  currencySymbol: {
    paddingLeft: 14,
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    padding: 14,
    paddingLeft: 8,
    color: '#fff',
    fontSize: 15,
  },
  textarea: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
    minHeight: 120,
  },
  charCount: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#06b6d4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#021024',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#0891b2',
    opacity: 0.7,
  },
});