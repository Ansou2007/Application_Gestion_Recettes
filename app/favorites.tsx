import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const FavoritesScreen = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const router = useRouter();

    // Fonction pour charger les recettes favorites depuis AsyncStorage
    const loadFavoriteRecipes = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes'); // Récupérer toutes les recettes
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            // Filtrer les recettes qui sont marquées comme favorites
            const favorites = recipes.filter((r: { isFavorite: boolean; }) => r.isFavorite === true);
            setFavoriteRecipes(favorites);
        } catch (error) {
            console.log('Erreur lors de la récupération des recettes favorites :', error);
        }
    };

    // Utiliser useEffect pour charger les recettes favorites au démarrage
    useEffect(() => {
        loadFavoriteRecipes();
    }, []);

    // Rendre chaque recette favorite
    const renderRecipe = ({ item }) => (
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
            <Text style={styles.title}>Mes Recettes Favorites</Text>
            {favoriteRecipes.length === 0 ? (
                <Text style={styles.noFavoritesText}>Aucune recette favorite pour le moment.</Text>
            ) : (
                <FlatList
                    data={favoriteRecipes}
                    renderItem={renderRecipe}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

export default FavoritesScreen;

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
    noFavoritesText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
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
});
