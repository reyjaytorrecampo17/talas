import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playClickSound, unloadSound } from '../soundUtils';  // Import sound utility functions
import LottieView from 'lottie-react-native'; // Import Lottie
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Adjust the path based on your project
import { getAuth } from "firebase/auth";
import { Video } from 'expo-av'; // Import the Video component

const { width, height } = Dimensions.get('window');

const Home = ({ userId }) => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [level, setLevel] = useState(0);
  const navigation = useNavigation();

  // Fetch user level and navigate if necessary
  useEffect(() => {
    const fetchUserLevelAndNavigate = async () => {
      try {
        const auth = getAuth(); // Get Firebase auth instance
        const user = auth.currentUser; // Get current user

        if (user) {
          const userId = user.uid; // Get the userId (UID)

          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data:", userData); // Log entire user data
            const currentLevel = userData?.level ?? 0; // Default to 0 if level is undefined
            setLevel(currentLevel);
            console.log("User level:", currentLevel); // Log level to check

            // Check if the current level is a multiple of 5 and post-test is not completed
            if (currentLevel % 5 === 0 && currentLevel !== 0) {
              const postTestCompleted = await AsyncStorage.getItem(`postTestCompletedLevel${currentLevel}`);
              console.log("Post-test completion status:", postTestCompleted); // Log status of post-test completion
              if (!postTestCompleted) {
                navigation.navigate('PostTestScreen', { level: currentLevel });
              }
            }
          } else {
            console.error("User document does not exist.");
          }
        } else {
          console.error("No user is currently logged in.");
        }
      } catch (error) {
        console.error('Error fetching user level from Firestore:', error);
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevelAndNavigate();
  }, [navigation]);

  const fetchPostTestStatus = async () => {
    try {
      const postTestCompleted = await AsyncStorage.getItem('postTestCompleted');
      if (postTestCompleted) {
        console.log('Post-test is completed');
      } else {
        console.log('Post-test is not completed');
      }
    } catch (error) {
      console.error('Error checking post-test status:', error);
    }
  };

  // Fetch the word of the day
  const fetchWordOfTheDay = async () => {
    try {
      // Fetch a random word
      const randomWordResponse = await fetch('https://random-word-api.herokuapp.com/word');
      const randomWordData = await randomWordResponse.json();
      const selectedWord = randomWordData[0];

      // Fetch the definition and example for the random word
      const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`);
      const dictionaryData = await dictionaryResponse.json();

      if (dictionaryData.title === "No Definitions Found") {
        setError('No word of the day found.');
        setLoading(false);
        return;
      }

      if (dictionaryData.length > 0) {
        const wordData = {
          word: dictionaryData[0].word,
          definition: dictionaryData[0].meanings[0].definitions[0].definition,
          example: dictionaryData[0].meanings[0].definitions[0].example || 'No example available.',
          timestamp: new Date().getTime()
        };

        await AsyncStorage.setItem('wordOfTheDay', JSON.stringify(wordData));
        setWordOfTheDay(wordData.word);
        setDefinition(wordData.definition);
        setExample(wordData.example);
        setError('');
      } else {
        setError('No word of the day found.');
      }
    } catch (error) {
      console.error('Error fetching word of the day:', error);
      setError('An error occurred while fetching word of the day.');
    }
    setLoading(false);
  };

  // Clean up sound when the component is unmounted
  useEffect(() => {
    return () => {
      unloadSound();
    };
  }, []);

  // Check word of the day from AsyncStorage
  useEffect(() => {
    const checkWordOfTheDay = async () => {
      try {
        const wordData = await AsyncStorage.getItem('wordOfTheDay');
        if (wordData) {
          const { word, definition, example, timestamp } = JSON.parse(wordData);
          const currentTime = new Date().getTime();
          const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

          if (currentTime - timestamp < oneDay) {
            setWordOfTheDay(word);
            setDefinition(definition);
            setExample(example);
            setLoading(false);
            return;
          }
        }
        await fetchWordOfTheDay();
      } catch (error) {
        console.error('Error checking word of the day:', error);
        await fetchWordOfTheDay();
      }
    };

    checkWordOfTheDay();
  }, []);

  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color="#ffffff" />
      </View>
    );
  }

  // Handle navigation and sound on click
  const handleClick = async (screen, params = {}) => {
    await playClickSound(); // Play sound on press
    navigation.navigate(screen, params); // Navigate to the specified screen
  };

  return (
      <View style={styles.container}>
        <Text style={styles.dictionaryTitle}>Word Of the Day</Text>
        <TouchableOpacity
          style={styles.dictionary}
          onPress={() => handleClick('Dictionary', { word: wordOfTheDay })}
        >
          <LinearGradient
            colors={['#0000FF', '#00EEFF', '#00EEFF', '#0000FF']}
            style={styles.WordContentContainer}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <LottieView 
                    source={require('../assets/book.json')} 
                    autoPlay 
                    loop 
                    style={styles.animation}
                  />
                  <Text style={styles.textTitle}>{wordOfTheDay}</Text>
                </View>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.title}>Start your learning journey here!</Text>
        <TouchableOpacity 
          style={styles.BooksLessonCon}
          onPress={() => handleClick('Lessons')}  // Call handleClick with the screen name
        >
          <LinearGradient
            colors={['#CD11FC', '#E26DFF', '#E26DFF', '#CD11FC']}
            style={styles.contentContainer}
          >
            <LottieView 
              source={require('../assets/lessons.json')} 
              autoPlay 
              loop 
              style={styles.animationLearn}
            />
            <Text style={styles.textTitle}>Lessons</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.BooksLessonCon}
          onPress={() => navigation.navigate('TalasBooks')}  // Call handleClick with the screen name
        >
          <LinearGradient
            colors={['#008C0E', '#6BF36B', '#6BF36B', '#008C0E']}
            style={styles.contentContainer}
          >
            <LottieView 
              source={require('../assets/talasBooks.json')} 
              autoPlay 
              loop 
              style={styles.animationLearn}
            />
            <Text style={styles.textTitleBooks}>Talas Books</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PostTestScreen')}
        >
          <Text style={styles.buttonText}>Take Post-Test</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  videoPlayer: {
    position: 'absolute',
    top: -50,
    left: 0,
    width: width, // Set width to match screen size
    height: height, // Set height to match screen size
    justifyContent: 'center',
    alignItems: 'center',
  },  
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Aligns the content vertically
  },
  contentContainer: {
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.12,
    width: width * 0.8,
  },
  WordContentContainer: {
    borderWidth: 1,
    borderRadius: 10,
    height: height * 0.18,
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BooksLessonCon: {
    marginTop: height * 0.02,
    borderRadius: 10,
    height: height * 0.12,
    width: width * 0.80,
    justifyContent: 'center',
  },
  dictionary: {
    marginTop: height * 0.02,
    borderRadius: 10,
    height: height * 0.18,
    width: width * 0.85,
  },
  dictionaryTitle: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: width * 0.05,
    left: 10,
    color: 'white',
    alignSelf: 'flex-start',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  title: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: width * 0.05,
    color: 'white',
    marginTop: height * 0.04,
    marginBottom: height * 0.03,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  textTitle: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: width * 0.06,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    left: 10 
  },
  textTitleBooks:{
    fontFamily: 'LilitaOne_400Regular',
    fontSize: width * 0.06,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    left: 25
  },
  imageStyle: {
    height: height * 0.07,
    width: width * 0.15,
    position: 'absolute',
    top: height * 0.03,
    left: width * 0.05,
  },
  largeImageStyle: {
    height: height * 0.15,
    width: width * 0.3,
    position: 'absolute',
    left: width * -0.03,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  definitionText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  exampleText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9747FF',
  },
  animation: {
    width: 180,
    height: 180,
    marginLeft: -50
  },
  animationLearn: {
    width: 90,
    height: 90,
    marginTop:-20,
    position:'absolute',
    backgroundColor: 'transparent',
    left: 5
  },
});

export default Home;
