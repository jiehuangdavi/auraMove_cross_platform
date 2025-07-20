import { Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

export default function ExerciseListItem({ item }) {
  return (
    <Link
      href={{ pathname: '/exercise', params: { name: item.name } }}
      asChild
    >
      <Pressable style={styles.exerciseContainer}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseEquipment}>
          Muscle: {item.muscle} | Equipment: {item.equipment}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseEquipment: {
    color: 'dimgray',
  },
  exerciseInstructions: {
    marginTop: 10,
  },
});