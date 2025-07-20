import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import exercises from '../../assets/Workouts Assets/data/exercises.json';
import ExerciseListItem from '../components/ExerciseListItem.jsx';
//import 'expo-router/entry';
export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data = {exercises}
        renderItem = {({item}) => <ExerciseListItem item={item} />}
      />
  
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'ghostwhite',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
  },
});