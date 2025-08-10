import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodView = () => (
  <View style={styles.container}>
    <Text>Food View</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

