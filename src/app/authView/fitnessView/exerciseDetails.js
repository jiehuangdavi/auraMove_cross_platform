import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { exerciseImages } from '../../../api/data/localData';

export default function ExerciseDetails() {
    const item = useLocalSearchParams();

    // Helper function to capitalize strings for better presentation
    const capitalize = (str) => {
        if (typeof str !== 'string' || !str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Instructions and secondary muscles are passed as comma-separated strings
    const instructions = item.instructions ? item.instructions.split(',') : [];
    const secondaryMuscles = item.secondaryMuscles ? item.secondaryMuscles.split(',').map(capitalize).join(', ') : '';

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: item.name ? capitalize(item.name) : 'Exercise Details'
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={exerciseImages[item.id]}
                    style={styles.exerciseImage}
                    resizeMode="contain"
                />

                <View style={styles.detailsContainer}>
                    <Text style={styles.exerciseName}>{capitalize(item.name || '')}</Text>

                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Equipment: </Text>
                        {capitalize(item.equipment || '')}
                    </Text>
                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Target Muscle: </Text>
                        {capitalize(item.target || '')}
                    </Text>
                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Secondary Muscles: </Text>
                        {secondaryMuscles}
                    </Text>

                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    {instructions.map((instruction, index) => (
                        <Text key={index} style={styles.instructionText}>
                            {`\u2022 ${capitalize(instruction.trim())}`}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    exerciseImage: {
        width: '100%',
        height: 300,
    },
    detailsContainer: {
        padding: 20,
    },
    exerciseName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailItem: { fontSize: 16, marginBottom: 8 },
    detailLabel: { fontWeight: 'bold' },
    instructionsTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
    instructionText: { fontSize: 16, marginBottom: 8, lineHeight: 24 },
});
