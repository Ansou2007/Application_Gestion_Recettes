import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => router.push('/')} style={styles.iconButton}>
                    <Ionicons name="home" size={28} color="white" />
                    <Text style={styles.iconLabel}>Accueil</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/favorites')} style={styles.iconButton}>
                    <Ionicons name="heart" size={28} color="white" />
                    <Text style={styles.iconLabel}>Favoris</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/Categories')} style={styles.iconButton}>
                    <Ionicons name="grid-outline" size={28} color="white" />
                    <Text style={styles.iconLabel}>Catégories</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/add-recipe')} style={styles.iconButton}>
                    <Ionicons name="add-circle" size={28} color="white" />
                    <Text style={styles.iconLabel}>Ajouter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        paddingBottom: 80, // Assure que la barre de navigation n'est pas recouverte
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
