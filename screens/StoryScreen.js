import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFonts, LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StoryScreen = ({ route, navigation }) => {
  const { unit, userId } = route.params;
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonScale] = useState(new Animated.Value(1));
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track if speech is playing

  const handleTTSToggle = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(story.text, {
        pitch: 1.5,
        rate: 0.9,
        language: 'en-US',
      });
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      if (isSpeaking) Speech.stop();
    };
  }, [isSpeaking]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
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

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (isSpeaking) Speech.stop();
    setIsSpeaking(false);

    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('UnitScreen', { unit, userId });
    });
  };

  const handleBackPress = () => {
    Speech.stop();
    navigation.goBack();
  };

  if (loading) {
    return (
      <LinearGradient colors={['#25276B', '#25276B']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading your story...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#25276B', '#25276B']} style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={40} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Story - Unit {unit}</Text>
      </LinearGradient>
      <SafeAreaView style={styles.storyContainer}>
        <TouchableOpacity onPress={handleTTSToggle} style={styles.ttsButton}>
          <AntDesign name={isSpeaking ? 'pausecircle' : 'sound'} size={25} color="#FF6347" />
        </TouchableOpacity>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.storyTitle}>{story?.title}</Text>
          <Text style={styles.text}>{story?.text}</Text>
        </ScrollView>
      </SafeAreaView>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.startButton}>
          <Text style={styles.startButtonText}>Proceed to Questions</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25276B',
  },
  header: {
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
    padding: 10,
  },
  title: {
    fontSize: width * 0.08,
    color: '#FFF',
    fontFamily: 'LilitaOne_400Regular',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.045,
    color: '#FFFFFF',
    fontFamily: 'LilitaOne_400Regular',
  },
  storyContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#FFF',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ttsButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  storyTitle: {
    fontSize: width * 0.06,
    color: '#FF6347',
    fontFamily: 'LilitaOne_400Regular',
    marginBottom: 15,
    alignSelf: 'center',
    textAlign: 'center', // Ensures the text is centered
  },
  scrollView: {
    marginBottom: 15
  },
  text: {
    fontSize: width * 0.045,
    lineHeight: height * 0.03,
    color: '#333',
    textAlign: 'justify',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: width * 0.045,
    color: '#FFF',
    fontFamily: 'LilitaOne_400Regular',
  },
});

export default StoryScreen;
