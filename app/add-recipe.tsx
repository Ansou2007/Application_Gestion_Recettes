import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AddRecipeScreen = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState<string | null>(null);

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

    const saveRecipe = async () => {
        if (title && ingredients && instructions && image) {
            try {
                const newRecipe = { title, ingredients, instructions, image };
                const storedRecipes = await AsyncStorage.getItem('recipes');
                const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
                recipes.push(newRecipe);
                await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
                alert('Recette enregistrée avec succès!');
                router.push('/');
            } catch (error) {
                alert("Erreur lors de l'enregistrement de la recette");
            }
        } else {
            alert('Veuillez remplir tous les champs et ajouter une image.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter une nouvelle recette</Text>

            <TextInput
                placeholder="Titre de la recette"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TextInput
                placeholder="Ingrédients (séparés par des virgules)"
                value={ingredients}
                onChangeText={setIngredients}
                style={styles.input}
            />

            <TextInput
                placeholder="Instructions"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={5}
                style={styles.input}
            />

            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
                <Text style={styles.changeImageText}>
                    {image ? 'Changer l\'image' : 'Ajouter une image'}
                </Text>
            </TouchableOpacity>

            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
                <Text style={styles.saveButtonText}>Sauvegarder la recette</Text>
            </TouchableOpacity>

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

export default AddRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        paddingBottom: 80,
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
        width: 200,
        height: 200,
        marginBottom: 20,
        alignSelf: 'center',
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
