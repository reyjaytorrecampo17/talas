import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const UnitScreen = ({ navigation, route }) => {
  const { unit } = route.params;

  // Define lessons with their respective ids and titles
  const lessons = [
    { id: 'ShortVowels', title: `Unit ${unit} - Short Vowels` },
    { id: 'Sequencing', title: `Unit ${unit} - Sequencing` },
    { id: 'MainIdea', title: `Unit ${unit} - Main Idea` },
    { id: 'Vocabulary', title: `Unit ${unit} - Vocabulary` },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.header}>
        <Text style={styles.title}>Unit {unit} Lessons</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonContainer}
            onPress={() => {
              // Navigate to the correct screen based on the lesson id
              navigation.navigate(lesson.id, { unit });
            }}
          >
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9747FF' },
  header: { height: 100, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, color: '#FFF' },
  contentContainer: { padding: 20 },
  lessonContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  lessonText: { fontSize: 18, color: '#000' },
});

export default UnitScreen;
