import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Vérifier l'import
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeDetailsScreen: React.FC = () => {
    const [recipe, setRecipe] = useState<any>(null);
    const { id } = useLocalSearchParams(); // Utiliser useLocalSearchParams pour récupérer l'ID
    const router = useRouter();

    useEffect(() => {
        // Vérifier que l'ID est bien récupéré
        console.log('ID de la recette:', id);

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
            <Text style={styles.sectionTitle}>Ingrédients:</Text>
            <Text>{recipe.ingredients}</Text>
            <Text style={styles.sectionTitle}>Instructions:</Text>
            <Text>{recipe.instructions}</Text>

            <Button title="Modifier la recette" onPress={() => router.push(`/edit-recipe/${recipe.title}`)} />
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
