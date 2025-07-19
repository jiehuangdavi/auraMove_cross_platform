import { StyleSheet, Text, View } from 'react-native';

export default function ExerciseListItem({ item }) {
  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseEquipment}>
        Muscle: {item.muscle} | Equipment: {item.equipment}
      </Text>
      {/* <Text style={styles.exerciseInstructions}>Instructions: {item.instructions}</Text> */}
    </View>
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