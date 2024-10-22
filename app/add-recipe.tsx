import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Importer le router pour naviguer

const AddRecipeScreen = () => {
    const router = useRouter(); // Utiliser le router pour naviguer
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState<string | null>(null);

    // Fonction pour ouvrir l'image picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Fonction pour sauvegarder la recette
    const saveRecipe = async () => {
        if (title && ingredients && instructions && image) {
            try {
                const newRecipe = { title, ingredients, instructions, image };
                const storedRecipes = await AsyncStorage.getItem('recipes');
                const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
                recipes.push(newRecipe);
                await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
                alert('Recipe saved successfully!');
                router.push('/'); // Retourner à la page d'accueil après la sauvegarde
            } catch (error) {
                alert('Failed to save recipe');
            }
        } else {
            alert('Please fill all the fields and add an image.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Add a New Recipe</Text>

            {/* Input for recipe title */}
            <TextInput
                placeholder="Recipe Title"
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                }}
            />

            {/* Input for ingredients */}
            <TextInput
                placeholder="Ingredients (comma separated)"
                value={ingredients}
                onChangeText={setIngredients}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                }}
            />

            {/* Input for instructions */}
            <TextInput
                placeholder="Instructions"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={5}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                }}
            />

            {/* Button to pick an image */}
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
                <Text style={{ color: 'blue', textAlign: 'center' }}>
                    {image ? 'Change Image' : 'Pick an Image'}
                </Text>
            </TouchableOpacity>

            {/* Display the selected image */}
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200, marginBottom: 20, alignSelf: 'center' }}
                />
            )}

            {/* Button to save the recipe */}
            <Button title="Save Recipe" onPress={saveRecipe} />
        </View>
    );
};

export default AddRecipeScreen;
