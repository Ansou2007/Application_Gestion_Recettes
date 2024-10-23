import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    // Fonction pour supprimer la recette
    const deleteRecipe = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
            const updatedRecipes = recipes.filter((r: any) => r.title !== id); // Retirer la recette par titre

            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            Alert.alert('Succès', 'La recette a été supprimée avec succès.');
            router.push('/'); // Redirection après suppression
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de supprimer la recette.');
        }
    };

    // Alerte pour confirmer la suppression
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
        <View style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
            <Text style={styles.sectionTitle}>Ingrédients:</Text>
            <Text>{recipe.ingredients}</Text>
            <Text style={styles.sectionTitle}>Instructions:</Text>
            <Text>{recipe.instructions}</Text>

            <Button title="Modifier la recette" onPress={() => router.push(`/edit-recipe/${recipe.title}`)} />
            <Button title="Supprimer la recette" onPress={confirmDelete} color="red" />
        </View>
    );
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
    },
});
