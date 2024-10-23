import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);

  // Fonction pour charger les recettes depuis AsyncStorage
  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      setRecipes(parsedRecipes);
    } catch (error) {
      console.log('Erreur lors de la récupération des recettes :', error);
    }
  };

  // Utiliser useEffect pour charger les recettes au démarrage
  useEffect(() => {
    loadRecipes();
  }, []);

  const handleSearch = () => {
    console.log('Recherche de:', search);
  };

  const renderRecipe = ({ item }: { item: { title: string; ingredients: string; image: string } }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => router.push(`/recipe/${item.title}`)}>
      {/* Afficher l'image de la recette */}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
      )}

      {/* Titre de la recette */}
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
      <Text style={styles.title}>Bienvenue sur l'application de Recettes de Cuisine</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher une recette..."
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
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
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    textAlign: 'center',
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
