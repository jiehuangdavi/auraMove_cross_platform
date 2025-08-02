import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';

const API_ENDPOINT_URL = 'http://localhost:5000/exercises';

const NewSetInput = ({ exerciseName }) => {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addSet = async () => {
    if (!exerciseName || !reps.trim() || !weight.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const exerciseData = {
      exercise: exerciseName,
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
    };

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Set saved successfully!');
        setReps('');
        setWeight('');
      } else {
        Alert.alert('Error', result.message || 'An error occurred while saving the data.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      Alert.alert('Network Error', 'Unable to connect to the server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Set</Text>
      <View style={styles.row}>
        <TextInput
          value={reps}
          onChangeText={setReps}
          placeholder="Reps"
          style={styles.input}
          keyboardType="numeric"
          editable={!isLoading}
        />
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Weight"
          style={styles.input}
          keyboardType="numeric"
          editable={!isLoading}
        />
        <Button title={isLoading ? 'Adding...' : 'Add'} onPress={addSet} disabled={isLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gainsboro',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
});

export default NewSetInput;