import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import BodyParts from './bodyParts';

export default function ExercisesScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Exercises',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.statsButton}
              onPress={() => router.push('/authView/fitnessView/statistics')}
            >
              <Ionicons name="stats-chart-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1 }}>
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
  statsButton: {
    marginRight: 15,
  },
});