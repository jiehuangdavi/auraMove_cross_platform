import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/authContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || 'User'}</Text>
      <Text style={styles.subtitle}>What would you like to track today?</Text>

      <View style={styles.cardContainer}>
        <Link href="/authView/fitnessView/statistics" asChild>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="barbell-outline" size={40} color="#007aff" />
            <Text style={styles.cardText}>Fitness</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/foodView" asChild>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="fast-food-outline" size={40} color="#007aff" />
            <Text style={styles.cardText}>Food</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.cardContainer}>
        <Link href="/authView/fitnessView/statistics" asChild>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="stats-chart-outline" size={40} color="#FF6B6B" />
            <Text style={styles.cardText}>Statistics</Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.placeholderCard}>
          <Ionicons name="add-circle-outline" size={40} color="#ccc" />
          <Text style={styles.placeholderText}>More</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#86868b',
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  placeholderCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#86868b',
  },
});

export default Dashboard;
