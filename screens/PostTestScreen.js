import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

const PostTestScreen = ({ navigation }) => {
  const questions = [
    {
      id: '1',
      question: 'What is the main idea of the passage?',
      options: ['Friendship is important', 'Studying is hard', 'Traveling is fun', 'Games are exciting'],
    },
    {
      id: '2',
      question: 'Which word best describes the main character?',
      options: ['Brave', 'Lazy', 'Happy', 'Sad'],
    },
    {
      id: '3',
      question: 'What lesson can we learn from the story?',
      options: ['Always tell the truth', 'Never give up', 'Share with friends', 'Help others'],
    },
    {
      id: '4',
      question: 'What was the problem in the story?',
      options: ['Lost key', 'Family argument', 'Friendship issue', 'Missing pet'],
    },
    {
      id: '5',
      question: 'How did the main character resolve the conflict?',
      options: ['Talked it out', 'Ignored it', 'Ran away', 'Fought back'],
    },
  ];

  const [answers, setAnswers] = useState({}); // Store user answers

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    console.log('User Answers:', answers);

    // Here you can handle the logic to save user answers to Firestore or evaluate the quiz
    Alert.alert('Success', 'Your answers have been submitted successfully!');
    navigation.navigate('Home'); // Redirect to the next screen
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post-Test</Text>
      {questions.map((question) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[question.id] === option ? styles.selectedOption : null,
              ]}
              onPress={() => handleAnswerChange(question.id, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Answers</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9146FF',
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
    backgroundColor: '#04BF04', // Highlight selected option
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
});

export default PostTestScreen;
