// app/add-recipe.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const AddRecipeScreen: React.FC = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const router = useRouter();

  const handleSaveRecipe = () => {
    // Vous pouvez ajouter ici la logique pour enregistrer la recette
    console.log('Recette ajoutée :', { recipeName, ingredients, instructions });

    // Retour à l'accueil après ajout
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une nouvelle recette</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de la recette"
        value={recipeName}
        onChangeText={setRecipeName}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingrédients"
        value={ingredients}
        onChangeText={setIngredients}
      />

      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
      />

      <Button title="Sauvegarder la recette" onPress={handleSaveRecipe} />
    </View>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});
