import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const RecipeDetailsScreen: React.FC = () => {
    const [recipe, setRecipe] = useState<any>(null);
    const { id } = useLocalSearchParams(); // Récupérer l'ID de la recette
    const router = useRouter();

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const storedRecipes = await AsyncStorage.getItem('recipes');
                const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
                const selectedRecipe = recipes.find((r: any) => r.title === id);
                setRecipe(selectedRecipe);
            } catch (error) {
                console.log('Erreur lors de la récupération de la recette :', error);
            }
        };
        loadRecipe();
    }, [id]);

    if (!recipe) {
        return <Text>Chargement...</Text>;
    }

    const toggleFavorite = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            const updatedRecipes = recipes.map((r: any) => {
                if (r.title === recipe.title) {
                    return { ...r, isFavorite: !r.isFavorite };
                }
                return r;
            });

            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            setRecipe((prevRecipe: any) => ({
                ...prevRecipe,
                isFavorite: !prevRecipe.isFavorite,
            }));
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour la recette.');
        }
    };

    const deleteRecipe = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
            const updatedRecipes = recipes.filter((r: any) => r.title !== id);

            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            Alert.alert('Succès', 'La recette a été supprimée avec succès.');
            router.push('/');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de supprimer la recette.');
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            'Confirmer la suppression',
            'Êtes-vous sûr de vouloir supprimer cette recette ?',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', onPress: deleteRecipe, style: 'destructive' },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
            <Text style={styles.sectionTitle}>Ingrédients</Text>
            <Text style={styles.textContent}>{recipe.ingredients}</Text>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.textContent}>{recipe.instructions}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => router.push(`/edit-recipe/${recipe.title}`)}>
                    <Ionicons name="pencil" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
                    <Ionicons name="trash" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.favoriteButton]} onPress={toggleFavorite}>
                    <Ionicons name={recipe.isFavorite ? "heart" : "heart-outline"} size={18} color="#fff" />
                    <Text style={styles.buttonText}>{recipe.isFavorite ? "Ret des favoris" : "Ajou aux favoris"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#555',
        marginTop: 20,
        marginBottom: 10,
    },
    textContent: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14, // Réduire la taille du texte
        marginLeft: 5,
    },
    editButton: {
        backgroundColor: '#FF6347',
    },
    deleteButton: {
        backgroundColor: '#FF6347',
    },
    favoriteButton: {
        backgroundColor: '#FF6347',
    },
});
