import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const debounce = (func, delay) => {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const HomeScreen = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [categories] = useState(['All', 'Desserts', 'Entrées', 'Plats', 'Salades', 'Boissons', 'Desserts', 'Entrées', 'Plats', 'Salades', 'Boissons', 'Desserts', 'Entrées', 'Plats', 'Salades', 'Boissons']);

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
    (searchText) => {
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

  const renderRecipe = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => router.push(`/recipe/${item.title}`)}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="image" size={50} color="#ccc" />
        </View>
      )}
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const groupRecipesIntoPairs = (recipes) => {
    const result = [];
    for (let i = 0; i < recipes.length; i += 2) {
      result.push(recipes.slice(i, i + 2));
    }
    return result;
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une recette..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={() => console.log('Notification pressed')}>
          <Ionicons name="notifications-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Liste de catégories défilante */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />

      {/* Espace entre les catégories et les recettes */}
      <View style={styles.spacing} />

      {/* Liste des recettes */}
      <FlatList
        data={groupRecipesIntoPairs(filteredRecipes)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((recipe, index) => (
              <View key={index} style={styles.recipeContainer}>
                {renderRecipe({ item: recipe })}
              </View>
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('')} style={styles.iconButton}>
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.iconLabel}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('favorites')} style={styles.iconButton}>
          <Ionicons name="heart" size={28} color="white" />
          <Text style={styles.iconLabel}>Favoris</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('Categories')} style={styles.iconButton}>
          <Ionicons name="grid-outline" size={28} color="white" />
          <Text style={styles.iconLabel}>Catégories</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('add-recipe')} style={styles.iconButton}>
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
    paddingBottom: 80,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  notificationButton: {
    marginLeft: 15,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
    width: '100%',
  },
  recipeImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  categoryList: {
    paddingVertical: 10,
    paddingLeft: 15,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 10,
    height: 33,
    justifyContent: 'center',
  },
  categoryText: {
    color: '#ff6347',
    fontSize: 14,
    fontWeight: '500',
  },
  spacing: {
    height: 20, // Ajustez la hauteur pour définir l'espace souhaité
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
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  recipeContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});
