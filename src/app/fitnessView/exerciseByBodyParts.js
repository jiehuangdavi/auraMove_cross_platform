import {View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import { exerciseData, exerciseImages } from '../../api/data/localData.js';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bodyParts } from '../../constants/image_path.js';

export default function ExerciseByBodyPart() {
    const item = useLocalSearchParams(); // get the parameter that was passed to this function during navigation
    const [allExercises, setAllExercises] = useState([]);
    const [displayedExercises, setDisplayedExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 10;

    useEffect(() => {
        if(item.name) {
            getExercises(item.name); //get exercises by body parts
        }
    }, [item]);

    // This effect handles the pagination logic
    useEffect(() => {
        if (allExercises.length > 0) {
            const startIndex = (currentPage - 1) * exercisesPerPage;
            const endIndex = startIndex + exercisesPerPage;
            setDisplayedExercises(allExercises.slice(startIndex, endIndex));
        }
    }, [allExercises, currentPage]);

    const getExercises = (bodypart) => {
        // This function is now synchronous as it loads from a local file
        try {
            // Look up the data directly from the imported map, ensuring case-insensitivity
            const data = exerciseData[bodypart.toLowerCase()];
            if (data) {
                setAllExercises(data);
                setCurrentPage(1); // Reset to first page when new body part is selected
            } else {
                console.warn(`No local data found for bodypart: ${bodypart}`);
                setAllExercises([]); // Set to empty array if not found
            }
        } catch (error) {
            console.error("Failed to load local exercises:", error);
            setAllExercises([]); // Corrected a bug that would cause a crash
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(allExercises.length / exercisesPerPage);

    // Find the corresponding body part data from the constants file to get the local image
    const bodyPartData = bodyParts.find(
        bp => bp.name.toLowerCase() === (item.name || '').toLowerCase()
    );

    return (
        <>
            <Stack.Screen
                options={{
                    // Set a dynamic, user-friendly title instead of the file path
                    title: item.name ? `${item.name.charAt(0).toUpperCase() + item.name.slice(1)} Exercises` : 'Exercises'
                }}
            />
            <FlatList
                ListHeaderComponent={
                    <Image
                        source={bodyPartData?.image}
                        style={styles.bodyPartImage}
                    />
                }
                data={displayedExercises}
                numColumns={2}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={{
                    justifyContent: 'space-between'
                }}
                renderItem={({item}) => <ExerciseCard item={item} />}
                ListEmptyComponent={() => {
                    if (loading) {
                        return <ActivityIndicator size="large" color="#555" style={{ marginTop: 40 }} />;
                    }
                    // This handles the case where loading is false but no exercises were found
                    return <Text style={styles.emptyText}>No exercises found for this body part.</Text>;
                }}
                ListFooterComponent={() => {
                    if (allExercises.length > exercisesPerPage) {
                        return (
                            <View style={styles.paginationContainer}>
                                <TouchableOpacity
                                    style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                                    onPress={() => setCurrentPage(prev => prev - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <Text style={styles.paginationText}>Previous</Text>
                                </TouchableOpacity>
                                <Text style={styles.pageInfo}>{`Page ${currentPage} of ${totalPages}`}</Text>
                                <TouchableOpacity
                                    style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                                    onPress={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <Text style={styles.paginationText}>Next</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    return null;
                }}
            />
        </>
    )
}

const ExerciseCard = ({item}) => {
    return (
        <Link
              href={{ pathname: '/fitnessView/exerciseDetails', params: item }}
              asChild
        >
        <TouchableOpacity style={styles.card}>
            <Image
                // Use the local image map to get the correct, bundled image asset
                source={exerciseImages[item.id]}
                resizeMode="contain"
                style={{width: wp(52), height: wp(52), borderRadius: 10}}
            />

            <Text style={styles.cardText}>{item.name}</Text>
        </TouchableOpacity>
        </Link>
    )
}

const styles = StyleSheet.create({
    bodyPartImage: {
        width: '100%',
        height: 200,
    },
    listContainer: {
        paddingBottom: 20, // Add padding to the bottom to not overlap with pagination
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        width: '42%', // Set a fixed width for two columns with a small gap
        marginVertical: 10,
        alignItems: 'center',
    },

    cardText: {
        marginTop: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyText: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
    },
    paginationButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#a0a0a0',
    },
    paginationText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pageInfo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});