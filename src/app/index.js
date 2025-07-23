import { StyleSheet, View, FlatList } from 'react-native';
import exercises from '../../assets/Workouts Assets/data/exercises.json';
import ExerciseListItem from '../components/ExerciseListItem.jsx';

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        contentContainerStyle={{ gap: 10 }}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => <ExerciseListItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'ghostwhite',
    justifyContent: 'center',
  },
});