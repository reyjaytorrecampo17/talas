import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useFonts, LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const StoryScreen = ({ route, navigation }) => {
  const { unit, userId } = route.params; // Get unit and userId from route params
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // Fetch the story data from the specific unit document
        const storyRef = doc(db, `units/unit${unit}`);
        const storySnapshot = await getDoc(storyRef);

        if (storySnapshot.exists()) {
          setStory(storySnapshot.data());
        } else {
          console.error('Story document does not exist');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [unit]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{story?.title}</Text>
      <Text style={styles.text}>{story?.text}</Text>
      <Button
        title="Proceed to Questions"
        onPress={() => navigation.navigate('UnitScreen', { unit, userId })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center', // This centers the content vertically
    alignItems: 'center', // This centers the content horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default StoryScreen;
