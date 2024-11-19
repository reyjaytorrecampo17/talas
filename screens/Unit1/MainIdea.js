import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const MainIdea = ({ route, navigation }) => {
  const { unit, userId } = route.params; // Assuming userId is passed as part of route params
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'units', `unit${unit}`, 'MainIdea');
        const snapshot = await getDocs(questionsRef);
        if (snapshot.empty) {
          Alert.alert('No Questions', 'No questions found for this unit.');
        } else {
          setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [unit]);

  const handleAnswerSelection = async (selectedOptionIndex, correctOptionIndex) => {
    if (selectedOptionIndex === correctOptionIndex) {
      Alert.alert('Correct!', 'You selected the correct answer.', [
        {
          text: 'Next',
          onPress: handleNext,
        },
      ]);
    } else {
      Alert.alert('Incorrect!', 'Please try again.');
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);  // Increment the question index
    } else {
      // All questions have been answered, update completion status in Firestore
      await updateTopicCompletion();
      Alert.alert('Quiz Complete', 'You have completed this quiz!');
      navigation.goBack();  // Navigate back after quiz completion
    }
  };

  // Function to update the topic completion flag in Firestore (dynamically based on the unit number)
  const updateTopicCompletion = async () => {
    try {
      const userRef = doc(db, 'users', userId); // Assuming users are stored in a 'users' collection
      const fieldName = `mainIdeaCompleted${unit}`; // Dynamically generate the field name based on unit number
      await updateDoc(userRef, {
        [fieldName]: true, // Set the dynamic field to true
      });
    } catch (error) {
      console.error('Error updating user completion:', error);
      Alert.alert('Error', 'Failed to update completion status.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noQuestionsText}>No questions available.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unit {unit} Main Idea</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswerSelection(index, currentQuestion.correctOption)}  // Compare selected answer with correct answer
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  questionContainer: { marginBottom: 20 },
  questionText: { fontSize: 18, marginBottom: 10 },
  optionButton: { backgroundColor: '#add8e6', padding: 10, marginVertical: 5, borderRadius: 5 },
  optionText: { fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noQuestionsText: { fontSize: 16, textAlign: 'center', color: '#888' },
});

export default MainIdea;
