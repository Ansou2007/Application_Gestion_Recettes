import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function RecipeApp() {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [storedRecipes, setStoredRecipes] = useState([]);

    // Function to pick an image from the library
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.uri);
        }
    };

    // Function to store the recipe
    const storeRecipe = async () => {
        const newRecipe = {
            name: recipeName,
            ingredients,
            instructions,
            imageUri,
        };

        try {
            const existingRecipes = await AsyncStorage.getItem('@recipes');
            const recipesArray = existingRecipes ? JSON.parse(existingRecipes) : [];
            recipesArray.push(newRecipe);

            await AsyncStorage.setItem('@recipes', JSON.stringify(recipesArray));
            setStoredRecipes(recipesArray); // Update the state with the stored recipes
            clearInputs(); // Clear the inputs after saving
        } catch (e) {
            console.error('Failed to store the recipe.', e);
        }
    };

    // Function to clear input fields after saving
    const clearInputs = () => {
        setRecipeName('');
        setIngredients('');
        setInstructions('');
        setImageUri(null);
    };

    // Function to retrieve stored recipes
    const getRecipes = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@recipes');
            setStoredRecipes(jsonValue != null ? JSON.parse(jsonValue) : []);
        } catch (e) {
            console.error('Failed to retrieve the recipes.', e);
        }
    };

    // Load the recipes when the component mounts
    useEffect(() => {
        getRecipes();
    }, []);

    return (
        <ScrollView>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add a Recipe</Text>

                <TextInput
                    placeholder="Recipe Name"
                    value={recipeName}
                    onChangeText={setRecipeName}
                    style={{ borderBottomWidth: 1, marginBottom: 10, fontSize: 16 }}
                />

                <TextInput
                    placeholder="Ingredients"
                    value={ingredients}
                    onChangeText={setIngredients}
                    style={{ borderBottomWidth: 1, marginBottom: 10, fontSize: 16 }}
                />

                <TextInput
                    placeholder="Instructions"
                    value={instructions}
                    onChangeText={setInstructions}
                    style={{ borderBottomWidth: 1, marginBottom: 10, fontSize: 16 }}
                />

                <Button title="Pick an Image" onPress={pickImage} />
                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: 200, height: 200, marginVertical: 10 }}
                    />
                )}

                <Button title="Save Recipe" onPress={storeRecipe} />

                <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Stored Recipes</Text>
                {storedRecipes.length > 0 ? (
                    storedRecipes.map((recipe, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.name}</Text>
                            <Text>Ingredients: {recipe.ingredients}</Text>
                            <Text>Instructions: {recipe.instructions}</Text>
                            {recipe.imageUri && (
                                <Image
                                    source={{ uri: recipe.imageUri }}
                                    style={{ width: 200, height: 200, marginVertical: 10 }}
                                />
                            )}
                        </View>
                    ))
                ) : (
                    <Text>No recipes stored yet.</Text>
                )}
            </View>
        </ScrollView>
    );
}
