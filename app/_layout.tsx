import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="favorites"
        options={{
          headerShown: false, // Cache l'en-tête pour la page "favorites"
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Cache l'en-tête pour la page "favorites"
        }}
      />
      <Stack.Screen
        name="add-recipe"
        options={{
          headerShown: false, // Cache l'en-tête pour la page "favorites"
        }}
      />
      <Stack.Screen
        name="recipe/[id]"
        options={{
          headerShown: false, // Cache l'en-tête pour la page "favorites"
        }}
      />
      <Stack.Screen
        name="edit-recipe/[id]"
        options={{
          headerShown: false, // Cache l'en-tête pour la page "favorites"
        }}
      />
    </Stack>
  );
}
