import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

// This is the main component for your app screen
const ExerciseLogger = ({ exerciseName }) => {
  // State variables to hold the input from the user
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Configuration ---
  // Replace this with the actual URL of your backend API endpoint
  //const API_ENDPOINT_URL = 'https://your-backend-api.com/exercises';
  // When running on an iOS Simulator, 'localhost' points to your Mac.
  const API_ENDPOINT_URL = 'http://localhost:5000/exercises';
  /**
   * Handles the submission of the exercise data.
   * It validates the input, sends a POST request to the backend,
   * and handles the response.
   */
  const handleSubmit = async () => {
    // Basic validation to ensure fields are not empty
    if (!exerciseName || !reps.trim() || !weight.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    // Prepare the data payload in the required format
    const exerciseData = {
      exercise: exerciseName,
      reps: parseInt(reps, 10), // Convert reps to a number
      weight: parseFloat(weight), // Convert weight to a number
    };

    // Set loading state to true to show feedback to the user
    setIsLoading(true);

    try {
      // Use fetch to send the data to your backend
      const response = await fetch(API_ENDPOINT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });

      // The 'await response.json()' part is important to get the body of the response
      const result = await response.json();

      if (response.ok) {
        // If the request was successful (status code 2xx)
        Alert.alert('Success', 'Exercise data saved successfully!');
        // Clear the input fields after successful submission
        setReps('');
        setWeight('');
      } else {
        // If the server responded with an error (status code 4xx or 5xx)
        Alert.alert(
          'Error',
          result.message || 'An error occurred while saving the data.'
        );
      }
    } catch (error) {
      // Handle network errors or other issues with the fetch call
      console.error('Submission Error:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    } finally {
      // Set loading state back to false regardless of the outcome
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Log a New Set</Text>

        {/* Reps Input */}
        <TextInput
          style={styles.input}
          placeholder="Reps (e.g., 8)"
          placeholderTextColor="#999"
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad" // Show number pad for easier input
          editable={!isLoading}
        />

        {/* Weight Input */}
        <TextInput
          style={styles.input}
          placeholder="Weight (e.g., 7.5)"
          placeholderTextColor="#999"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad" // Show decimal pad for easier input
          editable={!isLoading}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Saving...' : 'Save Exercise'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#99caff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseLogger;
