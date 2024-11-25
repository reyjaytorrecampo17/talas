import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playClickSound, unloadSound } from '../soundUtils';  // Import the sound utility functions
import LottieView from 'lottie-react-native'; // Import Lottie

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

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

  useEffect(() => {
    return () => {
      unloadSound(); // Clean up sound when the component is unmounted
    };
  }, []);

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

  // Function to handle navigation and sound on click
  const handleClick = async (screen, params = {}) => {
    await playClickSound();  // Play sound on press
    navigation.navigate(screen, params);  // Navigate to the specified screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dictionaryTitle}>Word Of the Day</Text>
      <TouchableOpacity
        style={styles.dictionary}
        onPress={() => handleClick('Dictionary', { word: wordOfTheDay })} // Pass parameters for navigation
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
          colors={['#02EB02', '#02E702', '#02DD02', '#01D201']}
          style={styles.contentContainer}
        >
          <Image
            source={require('../images/abc.png')}
            style={styles.imageStyle}
          />
          <Text style={styles.textTitle}>Lessons</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.BooksLessonCon}
        onPress={() => handleClick('TalasBooks')}  // Call handleClick with the screen name
      >
        <LinearGradient
          colors={['#FEE20E', '#FCD113', '#FCD113', '#F6BA06']}
          style={styles.contentContainer}
        >
          <Image
            source={require('../images/talas.png')}
            style={styles.largeImageStyle}
          />
          <Text style={styles.textTitle}>Talas Books</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9747FF',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
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
});

export default Home;
