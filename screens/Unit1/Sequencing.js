import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase'; // Replace with your Firebase configuration
import { getAuth } from 'firebase/auth';

const Sequencing = ({ route, navigation }) => {
  const { unit } = route.params || {}; // Get unit from route params
  const [questions, setQuestions] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [quizCompleted, setQuizCompleted] = useState(false); // Flag for quiz completion
  const auth = getAuth(); // Firebase Authentication to get the current user

  useEffect(() => {
    if (!unit) {
      Alert.alert(
        'Error',
        'Missing unit parameter. Returning to the previous screen.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    const fetchQuestions = async () => {
      try {
        const SequencingQuestionsRef = collection(db, 'units', unit, 'Sequencing');
        const querySnapshot = await getDocs(SequencingQuestionsRef);

        if (querySnapshot.empty) {
          Alert.alert('No Questions', 'No main idea questions available for this unit.');
          setQuestions([]);
        } else {
          const fetchedQuestions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQuestions(fetchedQuestions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [unit]);

  const handleOptionPress = (selectedOption, selectedOptionIndex, correctOption) => {
    if (selectedOptionIndex === correctOption) {
      Alert.alert('Correct!', 'You selected the correct answer.', [
        {
          text: 'Next',
          onPress: () => {
            // Proceed to the next question
            if (currentQuestionIndex + 1 < questions.length) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
              setQuizCompleted(true); // Set quizCompleted flag to true
              Alert.alert('Congratulations!', 'You have completed all the questions.');
              // Update the user document with completion status
              updateUserMainIdeaStatus();
              // Optionally, navigate to another screen or reset the quiz
              navigation.goBack(); // Example: go back to the previous screen
            }
          },
        },
      ]);
    } else {
      Alert.alert('Incorrect!', 'Please try again.');
    }
  };

  // Update the user's document with the completed quiz status
  const updateUserMainIdeaStatus = async () => {
    const user = auth.currentUser; // Get the current user
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid); // Reference to the user's document
        await updateDoc(userRef, {
          Sequencing: true, // Update field with quiz completion status
        });
        console.log('User main idea status updated');
      } catch (error) {
        console.error('Error updating user status:', error);
        Alert.alert('Error', 'Failed to update user status. Please try again later.');
      }
    } else {
      Alert.alert('Error', 'No user logged in.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Get the current question to display
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sequencing - {unit}</Text>
      {quizCompleted ? (
        <View style={styles.completedMessage}>
          <Text style={styles.message}>You have completed the main idea quiz!</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.optionText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {currentQuestion ? (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {`${currentQuestionIndex + 1}. ${currentQuestion.question}`}
              </Text>
              {currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.optionButton}
                    onPress={() => handleOptionPress(option, idx, currentQuestion.correctOption)} // Pass the index
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noOptionsText}>No options available for this question.</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noQuestionsText}>No questions available for this unit.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  content: {
    marginTop: 10,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#FFE135',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuestionsText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  noOptionsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  completedMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Sequencing;
