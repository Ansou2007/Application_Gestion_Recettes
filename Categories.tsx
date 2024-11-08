import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categories = [
    { name: 'Entrées', icon: 'restaurant' },
    { name: 'Plats principaux', icon: 'pizza' },
    { name: 'Desserts', icon: 'ice-cream' },
    { name: 'Boissons', icon: 'beer' },
];

const CategoriesScreen: React.FC = () => {
    const router = useRouter();

    const renderCategory = ({ item }: { item: { name: string; icon: string } }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => router.push(`/categories/${item.name}`)}>
            <Ionicons name={item.icon} size={32} color="#fff" />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Catégories de Recettes</Text>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    categoryName: {
        color: 'white',
        fontSize: 18,
        marginLeft: 15,
    },
});
