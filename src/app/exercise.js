import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/Workouts Assets/data/exercises.json';
import {useState} from 'react';

export default function ExerciseDetailsScreen() {
  const { name } = useLocalSearchParams();

  const exercise = exercises.find((item) => item.name === name);
  const [isInstructionExpanded, setIsInstructionExpanded] = useState(false);

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
      <View>
      <Text style={styles.instructions} numberOfLines = {isInstructionExpanded ? 0:10}>{exercise.instructions}</Text>
      <Text 
        onPress={() => setIsInstructionExpanded(!isInstructionExpanded)}
        style={styles.seeMore} > 
        {isInstructionExpanded ? 'See Less' : 'See More'}
      </Text>
      </View>

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
    lineHeight: 22,
  },
  seeMore: {
    color: 'cornflowerblue',
    alignSelf: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: '600'
  },

});