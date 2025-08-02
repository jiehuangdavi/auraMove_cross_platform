import { Pressable, StyleSheet, Text, Image, View } from 'react-native';
import { Link } from 'expo-router';
//import { exerciseImages, placeholderImage } from '../../exercise-images';

export default function ExerciseListItem({ item }) {
  //const demoImage = exerciseImages[item.name] || placeholderImage;

  return (
    <Link
      href={{ pathname: '/exercise', params: { name: item.name } }}
      asChild
    >
      <Pressable style={styles.exerciseContainer}>
        {/*<Image source={demoImage} style={styles.image} />*/}
        <View style={styles.contentContainer}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseEquipment}>
            <Text style={{ textTransform: 'capitalize' }}>{item.muscle}</Text> |{' '}
            <Text style={{ textTransform: 'capitalize' }}>{item.equipment}</Text>
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseEquipment: {
    color: 'dimgray',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
  },
});