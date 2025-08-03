import { StyleSheet, View, FlatList } from 'react-native';
import BodyParts from './bodyParts';

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
        <View className = "flex-1">
            <BodyParts/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'ghostwhite',
  },
});