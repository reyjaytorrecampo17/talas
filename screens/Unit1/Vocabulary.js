import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

const Vocabulary = ({ route, navigation }) => {
  const { unit } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'units', `unit${unit}`, 'vocabularyQuestions');
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

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      Alert.alert('Quiz Complete', 'You have completed this quiz!');
      navigation.goBack();
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unit {unit} Vocabulary</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity key={index} style={styles.optionButton} onPress={handleNext}>
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

export default Vocabulary;
