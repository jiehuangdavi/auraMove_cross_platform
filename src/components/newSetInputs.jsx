import { View, Text, StyleSheet, TextInput, Button} from 'react-native';
import { useState } from 'react';

const NewSetInput = () => {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const addSet = () => {
        console.warn('Add Set', reps, weight);
        // save data in database
        setReps('');
        setWeight('');
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Set</Text>
      <View style={styles.row}>
        <TextInput 
            value = {reps} 
            onChangeText={setReps} 
            placeholder="Reps" 
            style={styles.input} 
            keyboardType="numeric" 
        />
        <TextInput 
            value = {weight} 
            onChangeText={setWeight} 
            placeholder="Weight" 
            style={styles.input} 
            keyboardType="numeric" 
        />
        <Button title="Add" onPress={ addSet} />   
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