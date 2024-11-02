import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      setRecipes(parsedRecipes);
      setFilteredRecipes(parsedRecipes);
    } catch (error) {
      console.log('Erreur lors de la récupération des recettes :', error);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const filterRecipes = useCallback(
    (searchText: string) => {
      if (searchText.trim() === '') {
        setFilteredRecipes(recipes);
      } else {
        const lowercasedSearch = searchText.toLowerCase();
        const filtered = recipes.filter((recipe) => {
          const title = typeof recipe.title === 'string' ? recipe.title.toLowerCase() : '';
          const ingredients = typeof recipe.ingredients === 'string' ? recipe.ingredients.toLowerCase() : '';
          return title.includes(lowercasedSearch) || ingredients.includes(lowercasedSearch);
        });
        setFilteredRecipes(filtered);
      }
    },
    [recipes]
  );

  const debouncedFilter = useCallback(debounce(filterRecipes, 300), [filterRecipes]);

  useEffect(() => {
    debouncedFilter(search);
  }, [search, debouncedFilter]);

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
      <Text style={styles.title}>Recettes de Cuisine</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une recette par nom ou ingrédient..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.subtitle}>Recettes Populaires</Text>
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.iconButton}>
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.iconLabel}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/favorites')} style={styles.iconButton}>
          <Ionicons name="heart" size={28} color="white" />
          <Text style={styles.iconLabel}>Favoris</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/search')} style={styles.iconButton}>
          <Ionicons name="search" size={28} color="white" />
          <Text style={styles.iconLabel}>Recherche</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/add-recipe')} style={styles.iconButton}>
          <Ionicons name="add-circle" size={28} color="white" />
          <Text style={styles.iconLabel}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
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
    color: '#333',
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#777',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ff6347',
    paddingHorizontal: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
});
