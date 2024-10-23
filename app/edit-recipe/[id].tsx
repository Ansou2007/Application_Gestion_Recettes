import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditRecipeScreen: React.FC = () => {
    const [recipe, setRecipe] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const { id } = useLocalSearchParams(); // Utiliser useLocalSearchParams pour récupérer l'ID
    const router = useRouter();

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const storedRecipes = await AsyncStorage.getItem('recipes');
                const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
                const selectedRecipe = recipes.find((r: any) => r.title === id);
                if (selectedRecipe) {
                    setRecipe(selectedRecipe);
                    setTitle(selectedRecipe.title);
                    setIngredients(selectedRecipe.ingredients);
                    setInstructions(selectedRecipe.instructions);
                    setImage(selectedRecipe.image);
                }
            } catch (error) {
                console.log('Erreur lors de la récupération de la recette :', error);
            }
        };
        loadRecipe();
    }, [id]);

    const saveChanges = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
            const updatedRecipes = recipes.map((r: any) => {
                if (r.title === id) {
                    return { title, ingredients, instructions, image };
                }
                return r;
            });
            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            router.push('/'); // Redirection après modification
        } catch (error) {
            console.log('Erreur lors de la sauvegarde des modifications', error);
        }
    };

    if (!recipe) {
        return <Text>Chargement...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifier la Recette</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Titre" style={styles.input} />
            <TextInput value={ingredients} onChangeText={setIngredients} placeholder="Ingrédients" style={styles.input} />
            <TextInput value={instructions} onChangeText={setInstructions} placeholder="Instructions" style={styles.input} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Button title="Sauvegarder les modifications" onPress={saveChanges} />
        </View>
    );
};

export default EditRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
});
