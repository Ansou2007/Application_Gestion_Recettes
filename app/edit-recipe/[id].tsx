import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const EditRecipeScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const storedRecipes = await AsyncStorage.getItem('recipes');
                const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
                const recipeToEdit = recipes.find((r: any) => r.title === id);

                if (recipeToEdit) {
                    setTitle(recipeToEdit.title);
                    setIngredients(recipeToEdit.ingredients);
                    setInstructions(recipeToEdit.instructions);
                    setImage(recipeToEdit.image);
                }
            } catch (error) {
                console.log('Erreur lors de la récupération de la recette:', error);
            }
        };

        loadRecipe();
    }, [id]);

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

    const saveChanges = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            const updatedRecipes = recipes.map((recipe: any) =>
                recipe.title === id
                    ? { ...recipe, title, ingredients, instructions, image }
                    : recipe
            );

            await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            alert('Recette modifiée avec succès!');
            router.back();
        } catch (error) {
            alert('Erreur lors de la sauvegarde des modifications');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifier la recette</Text>

            <TextInput
                placeholder="Titre de la recette"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TextInput
                placeholder="Ingrédients"
                value={ingredients}
                onChangeText={setIngredients}
                style={styles.input}
            />

            <TextInput
                placeholder="Instructions"
                value={instructions}
                onChangeText={setInstructions}
                style={styles.input}
                multiline
                numberOfLines={5}
            />

            {image && (
                <Image source={{ uri: image }} style={styles.image} />
            )}

            <TouchableOpacity onPress={pickImage}>
                <Text style={styles.changeImageText}>
                    {image ? 'Changer l\'image' : 'Ajouter une image'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Sauvegarder les modifications</Text>
            </TouchableOpacity>

            {/* Barre de navigation en bas */}
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

export default EditRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    changeImageText: {
        color: 'blue',
        textAlign: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        backgroundColor: '#FF6347',
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
