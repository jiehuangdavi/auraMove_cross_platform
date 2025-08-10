import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { exerciseImages } from '../../../api/data/localData';

export default function Statistics() {
  const router = useRouter();
  const [todayPlan, setTodayPlan] = useState([]);
  const [showExerciseBrowser, setShowExerciseBrowser] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingExercise, setEditingExercise] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data for today's statistics
  const [stats, setStats] = useState({
    caloriesBurned: 0,
    steps: 0,
    expectedCalories: 500,
    expectedSteps: 10000
  });

  // Mock data for today's exercise plan
  useEffect(() => {
    // Initialize with some sample exercises
    const samplePlan = [
      {
        id: 1,
        name: 'Push-ups',
        sets: 3,
        reps: 15,
        weight: 0,
        completed: false,
        bodyPart: 'chest'
      },
      {
        id: 2,
        name: 'Squats',
        sets: 4,
        reps: 20,
        weight: 0,
        completed: false,
        bodyPart: 'legs'
      },
      {
        id: 3,
        name: 'Pull-ups',
        sets: 3,
        reps: 8,
        weight: 0,
        completed: false,
        bodyPart: 'back'
      }
    ];
    setTodayPlan(samplePlan);
    
    // Load available exercises
    loadAvailableExercises();
  }, []);

  const loadAvailableExercises = () => {
    // This would typically load from your exercise database
    // For now, using mock data
    const exercises = [
      { id: 1, name: 'Push-ups', bodyPart: 'chest', equipment: 'bodyweight' },
      { id: 2, name: 'Squats', bodyPart: 'legs', equipment: 'bodyweight' },
      { id: 3, name: 'Pull-ups', bodyPart: 'back', equipment: 'bar' },
      { id: 4, name: 'Bench Press', bodyPart: 'chest', equipment: 'barbell' },
      { id: 5, name: 'Deadlift', bodyPart: 'back', equipment: 'barbell' },
      { id: 6, name: 'Lunges', bodyPart: 'legs', equipment: 'bodyweight' },
      { id: 7, name: 'Plank', bodyPart: 'core', equipment: 'bodyweight' },
      { id: 8, name: 'Bicep Curls', bodyPart: 'arms', equipment: 'dumbbell' }
    ];
    setAvailableExercises(exercises);
  };

  const toggleExerciseCompletion = (exerciseId) => {
    setTodayPlan(prev => 
      prev.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
    
    // Update stats when exercise is completed
    updateStats();
  };

  const updateStats = () => {
    const completedExercises = todayPlan.filter(ex => ex.completed).length;
    const totalExercises = todayPlan.length;
    
    // Calculate calories burned based on completed exercises
    const caloriesPerExercise = 50; // Mock value
    const newCalories = completedExercises * caloriesPerExercise;
    
    // Calculate steps (mock calculation)
    const stepsPerExercise = 200; // Mock value
    const newSteps = completedExercises * stepsPerExercise;
    
    setStats(prev => ({
      ...prev,
      caloriesBurned: newCalories,
      steps: newSteps
    }));
  };

  const addExerciseToPlan = (exercise) => {
    const newExercise = {
      id: Date.now(),
      name: exercise.name,
      sets: 3,
      reps: 10,
      weight: 0,
      completed: false,
      bodyPart: exercise.bodyPart
    };
    
    setTodayPlan(prev => [...prev, newExercise]);
    setShowExerciseBrowser(false);
    setSearchQuery('');
    
    Alert.alert('Success', `${exercise.name} added to today's plan!`);
  };

  const removeExerciseFromPlan = (exerciseId) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise from today\'s plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setTodayPlan(prev => prev.filter(ex => ex.id !== exerciseId));
            updateStats();
          }
        }
      ]
    );
  };

  const openEditModal = (exercise) => {
    setEditingExercise(exercise);
    setShowEditModal(true);
  };

  const saveExerciseEdit = () => {
    if (editingExercise) {
      setTodayPlan(prev => 
        prev.map(ex => 
          ex.id === editingExercise.id ? editingExercise : ex
        )
      );
      setShowEditModal(false);
      setEditingExercise(null);
      updateStats();
    }
  };

  const filteredExercises = availableExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderExerciseCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.exerciseCard}
      onPress={() => addExerciseToPlan(item)}
    >
      <View style={styles.exerciseCardContent}>
        <Text style={styles.exerciseCardName}>{item.name}</Text>
        <Text style={styles.exerciseCardBodyPart}>{item.bodyPart}</Text>
        <Text style={styles.exerciseCardEquipment}>{item.equipment}</Text>
      </View>
      <Ionicons name="add-circle-outline" size={24} color="#007aff" />
    </TouchableOpacity>
  );

  const renderTodayPlanItem = ({ item }) => (
    <View style={[styles.planItem, item.completed && styles.completedPlanItem]}>
      <View style={styles.planItemHeader}>
        <TouchableOpacity 
          style={styles.completionButton}
          onPress={() => toggleExerciseCompletion(item.id)}
        >
          <Ionicons 
            name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={item.completed ? "#4CAF50" : "#666"} 
          />
        </TouchableOpacity>
        
        <View style={styles.planItemInfo}>
          <Text style={[styles.planItemName, item.completed && styles.completedText]}>
            {item.name}
          </Text>
          <Text style={styles.planItemDetails}>
            {item.sets} sets × {item.reps} reps
            {item.weight > 0 && ` @ ${item.weight}kg`}
          </Text>
        </View>
        
        <View style={styles.planItemActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={20} color="#007aff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeExerciseFromPlan(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Workout Statistics',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowExerciseBrowser(true)}
            >
              <Ionicons name="add" size={24} color="#007aff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        {/* Statistics Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flame-outline" size={32} color="#FF6B6B" />
              <Text style={styles.statValue}>{stats.caloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories Burned</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((stats.caloriesBurned / stats.expectedCalories) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((stats.caloriesBurned / stats.expectedCalories) * 100)}% of goal
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="footsteps-outline" size={32} color="#4ECDC4" />
              <Text style={styles.statValue}>{stats.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((stats.steps / stats.expectedSteps) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((stats.steps / stats.expectedSteps) * 100)}% of goal
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Exercise Plan */}
        <View style={styles.planContainer}>
          <View style={styles.planHeader}>
            <View style={styles.planHeaderTop}>
              <Text style={styles.sectionTitle}>Today's Exercise Plan</Text>
              <TouchableOpacity 
                style={styles.selectPlanButton}
                onPress={() => router.push('/authView/fitnessView/exercises')}
              >
                <Ionicons name="list-outline" size={20} color="#007aff" />
                <Text style={styles.selectPlanButtonText}>Select Plan</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.planSubtitle}>
              {todayPlan.filter(ex => ex.completed).length} of {todayPlan.length} completed
            </Text>
          </View>

          {todayPlan.length === 0 ? (
            <View style={styles.emptyPlan}>
              <Ionicons name="fitness-outline" size={48} color="#ccc" />
              <Text style={styles.emptyPlanText}>No exercises planned for today</Text>
              <View style={styles.emptyPlanActions}>
                <TouchableOpacity 
                  style={styles.selectPlanButtonLarge}
                  onPress={() => router.push('/authView/fitnessView/exercises')}
                >
                  <Ionicons name="list-outline" size={24} color="#fff" />
                  <Text style={styles.selectPlanButtonLargeText}>Select Exercise Plan</Text>
                </TouchableOpacity>
                <Text style={styles.emptyPlanOrText}>or</Text>
                <TouchableOpacity 
                  style={styles.addExerciseButton}
                  onPress={() => setShowExerciseBrowser(true)}
                >
                  <Text style={styles.addExerciseButtonText}>Add Individual Exercise</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={todayPlan}
              renderItem={renderTodayPlanItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Exercise Browser Modal */}
      <Modal
        visible={showExerciseBrowser}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Exercise to Plan</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowExerciseBrowser(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseCard}
            keyExtractor={item => item.id.toString()}
            style={styles.exerciseList}
          />
        </View>
      </Modal>

      {/* Edit Exercise Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>Edit Exercise</Text>
            
            {editingExercise && (
              <View style={styles.editForm}>
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Sets:</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingExercise.sets.toString()}
                    onChangeText={(text) => setEditingExercise({
                      ...editingExercise,
                      sets: parseInt(text) || 0
                    })}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Reps:</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingExercise.reps.toString()}
                    onChangeText={(text) => setEditingExercise({
                      ...editingExercise,
                      reps: parseInt(text) || 0
                    })}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Weight (kg):</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editingExercise.weight.toString()}
                    onChangeText={(text) => setEditingExercise({
                      ...editingExercise,
                      weight: parseFloat(text) || 0
                    })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}

            <View style={styles.editModalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveExerciseEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    marginRight: 15,
  },
  
  // Statistics Section
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#86868b',
    marginTop: 5,
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#86868b',
    marginTop: 8,
  },

  // Exercise Plan Section
  planContainer: {
    padding: 20,
  },
  planHeader: {
    marginBottom: 20,
  },
  planHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  selectPlanButtonText: {
    color: '#007aff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  planSubtitle: {
    fontSize: 16,
    color: '#86868b',
    marginTop: 5,
  },
  emptyPlan: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPlanText: {
    fontSize: 16,
    color: '#86868b',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyPlanActions: {
    alignItems: 'center',
    gap: 15,
  },
  selectPlanButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  selectPlanButtonLargeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyPlanOrText: {
    fontSize: 14,
    color: '#86868b',
    marginVertical: 5,
  },
  addExerciseButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  addExerciseButtonText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
  },
  planItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedPlanItem: {
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  planItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionButton: {
    marginRight: 12,
  },
  planItemInfo: {
    flex: 1,
  },
  planItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#4CAF50',
  },
  planItemDetails: {
    fontSize: 14,
    color: '#86868b',
  },
  planItemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  removeButton: {
    padding: 8,
  },

  // Exercise Browser Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  closeButton: {
    padding: 8,
  },
  searchInput: {
    margin: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d2d2d7',
    borderRadius: 8,
    fontSize: 16,
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseCardContent: {
    flex: 1,
  },
  exerciseCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 4,
  },
  exerciseCardBodyPart: {
    fontSize: 14,
    color: '#86868b',
    marginBottom: 2,
  },
  exerciseCardEquipment: {
    fontSize: 12,
    color: '#666',
  },

  // Edit Modal
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 20,
    textAlign: 'center',
  },
  editForm: {
    marginBottom: 24,
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 16,
    color: '#1d1d1f',
    fontWeight: '500',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#d2d2d7',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  editModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d2d2d7',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#86868b',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
