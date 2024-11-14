import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const PretestScreen = ({ route, navigation }) => {
  const { uid, difficulty } = route?.params || {};

  if (!uid || !difficulty) {
    Alert.alert('Error', 'User ID or difficulty not found.');
    return null;
  }

  const [pretestCompleted, setPretestCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (uid && difficulty) {
      fetchPretestStatus();
    }
  }, [uid, difficulty]);

  const fetchPretestStatus = async () => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const pretestStatus = userData.difficultyLevels?.[difficulty]?.pretestCompleted;

        setPretestCompleted(pretestStatus); // Update the pretest completion status

        if (pretestStatus) {
          // If pretest is completed, allow navigation to the QuizScreen
          navigation.replace('QuizScreen', { difficulty, uid });
        } else {
          fetchQuestions(); // If pretest is not completed, fetch the questions for the pretest
        }
      } else {
        console.error('User does not exist');
        setPretestCompleted(false);
      }
    } catch (error) {
      console.error('Error fetching pretest status:', error);
      Alert.alert('Error', `Could not fetch pretest status: ${error.message}`);
    }
  };

  const fetchQuestions = async () => {
    try {
      const pretestRef = doc(db, 'pretest', difficulty);
      const pretestSnap = await getDoc(pretestRef);

      if (pretestSnap.exists()) {
        const pretestData = pretestSnap.data();
        const { question, options, correctAnswerIndex } = pretestData;

        const fetchedQuestions = [{
          id: 1,
          question: question,
          options: options,
          correctAnswer: options[correctAnswerIndex],
        }];
        
        setQuestions(fetchedQuestions);
      } else {
        console.error('Pretest data for this difficulty does not exist');
        Alert.alert('Error', 'Pretest data not found.');
      }
    } catch (error) {
      console.error('Error fetching pretest questions:', error);
      Alert.alert('Error', `Could not fetch pretest questions: ${error.message}`);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === questions.length) {
      try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          [`difficultyLevels.${difficulty}.pretestCompleted`]: true,
        });

        Alert.alert('Success', 'Your pretest has been completed!');
        setPretestCompleted(true);
        navigation.replace('QuizScreen', { difficulty, uid }); // Navigate after updating Firestore
      } catch (error) {
        Alert.alert('Error', `Could not submit your answers: ${error.message}`);
      }
    } else {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pretest - {difficulty}</Text>

      {pretestCompleted ? (
        <Text style={styles.completedText}>You have already completed the pretest for {difficulty}!</Text>
      ) : (
        questions.map((question) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[question.id] === option && styles.selectedOption,
                ]}
                onPress={() => handleAnswerChange(question.id, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}

      {/* Submit Button is shown only if pretest is not completed */}
      {!pretestCompleted && (
        <>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Answers</Text>
          </TouchableOpacity>

          {/* Back Button allows navigation to Games regardless of pretest status */}
          <TouchableOpacity 
            style={styles.gamesButton} 
            onPress={() => navigation.navigate('Games')}
          >
            <Text style={styles.submitText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#9146FF',
  },
  gamesButton: {
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#02EB02',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#ff6347',
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },
  completedText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PretestScreen;
