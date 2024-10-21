// app/add-recipe.tsx

import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AddRecipeScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const router = useRouter();

    const saveRecipe = async () => {
        const newRecipe = { id: Date.now(), name, ingredients };
        const storedRecipes = await AsyncStorage.getItem('recipes');
        const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
        recipes.push(newRecipe);
        await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
        router.push('/'); // Redirige vers l'écran d'accueil
    };

    return (
        <View>
            <TextInput placeholder="Nom de la recette" value={name} onChangeText={setName} />
            <TextInput placeholder="Ingrédients" value={ingredients} onChangeText={setIngredients} />
            <Button title="Enregistrer" onPress={saveRecipe} />
        </View>
    );
};

export default AddRecipeScreen;
