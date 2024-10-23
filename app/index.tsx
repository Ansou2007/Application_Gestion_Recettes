import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Importation de l'icône
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);

  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      setRecipes(parsedRecipes);
    } catch (error) {
      console.log('Erreur lors de la récupération des recettes :', error);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const renderRecipe = ({ item }: { item: { title: string; ingredients: string; image: string } }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => router.push(`/recipe/${item.title}`)}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
      )}
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeIngredients}>
          {item.ingredients.length > 50 ? `${item.ingredients.substring(0, 50)}...` : item.ingredients}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Recettes de Cuisine</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher une recette..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Bouton pour accéder aux recettes favorites */}
      <TouchableOpacity style={styles.favoriteButton} onPress={() => router.push('/favorites')}>
        <Ionicons name="heart" size={24} color="white" />
        <Text style={styles.favoriteButtonText}>Recettes Favorites</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Recettes Populaires</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-recipe')}
      >
        <Text style={styles.addButtonText}>Ajouter une nouvelle recette</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeContent: {
    padding: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
