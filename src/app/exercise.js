import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/Workouts Assets/data/exercises.json';

export default function ExerciseDetailsScreen() {
  const { name } = useLocalSearchParams();

  const exercise = exercises.find((item) => item.name === name);

  if (!exercise) {
    return <Text>Exercise not found!</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      <Text style={styles.exerciseSubtitle}>
        <Text style={styles.subtitleValue}>{exercise.muscle}</Text> |{' '}
        <Text style={styles.subtitleValue}>{exercise.equipment}</Text>
      </Text>

      <Text style={styles.instructions}>{exercise.instructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseSubtitle: {
    color: 'dimgray',
    fontSize: 16,
  },
  subtitleValue: {
    textTransform: 'capitalize',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
});