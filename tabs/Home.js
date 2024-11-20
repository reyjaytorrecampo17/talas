import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playClickSound, unloadSound } from '../soundUtils'; // Import the sound functions

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchWordOfTheDay = async () => {
    setLoading(true);
    setError('');

    const apiKey = 'x4n1360hwgo4iu8gr0fdvt10dudaxz7n5ygfcv6zfg86g9zl0'; // Replace with your actual Wordnik API key
    const url = `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Word of the Day API Response:", data);

      const word = data.word || 'No word found';
      const definition = data.definitions ? data.definitions[0].text : 'No definition available.';
      const example = data.examples ? data.examples[0].text : 'No example available.';

      console.log("Fetched Word:", word);
      console.log("Fetched Definition:", definition);
      console.log("Fetched Example:", example);

      setWordOfTheDay(word);
      setDefinition(definition);
      setExample(example);

      await AsyncStorage.setItem('wordOfTheDay', word);
      await AsyncStorage.setItem('definition', definition);
      await AsyncStorage.setItem('example', example);
      await AsyncStorage.setItem('lastFetchDate', new Date().toDateString());

      setLoading(false);
    } catch (error) {
      console.error("Error fetching word of the day:", error);
      setError('Failed to fetch Word of the Day. Please check your internet connection or try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkWordOfTheDay = async () => {
      const lastFetchDate = await AsyncStorage.getItem('lastFetchDate');
      const currentDate = new Date().toDateString();

      if (lastFetchDate !== currentDate) {
        console.log("Fetching new word of the day...");
        await fetchWordOfTheDay();
      } else {
        const savedWord = await AsyncStorage.getItem('wordOfTheDay');
        const savedDefinition = await AsyncStorage.getItem('definition');
        const savedExample = await AsyncStorage.getItem('example');
        setWordOfTheDay(savedWord || 'No word found');
        setDefinition(savedDefinition || 'No definition available.');
        setExample(savedExample || 'No example available.');
        setLoading(false);
      }
    };

    checkWordOfTheDay();
    return () => {
      unloadSound(); // Unload the sound when the component unmounts
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError('');
    fetchWordOfTheDay();
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.dictionaryTitle}>Word Of the Day</Text>
      <TouchableOpacity
        style={styles.dictionary}
        onPress={() => {
          playClickSound(); // Play the click sound when the button is pressed
          navigation.navigate('Dictionary', { word: wordOfTheDay });
        }}
      >
        <LinearGradient
          colors={['#11B7FC', '#00EEFF', '#00EEFF', '#11B7FC']}
          style={styles.WordContentContainer}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Text style={styles.textTitle}>{wordOfTheDay || 'No Word Found'}</Text>
              <Text style={styles.definitionText}>Definition: {definition}</Text>
              <Text style={styles.exampleText}>Example: {example}</Text>
            </>
          )}
        </LinearGradient>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.title}>Start your learning journey here!</Text>
      <TouchableOpacity 
        style={styles.BooksLessonCon}
        onPress={() => {
          playClickSound(); // Play the click sound when the button is pressed
          navigation.navigate('Lessons');
        }} 
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

      <TouchableOpacity style={styles.BooksLessonCon}
        onPress={() => {
          playClickSound(); // Play the click sound when the button is pressed
          navigation.navigate('TalasBooks');
        }} 
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
    marginTop: height * 0.06,
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
  definitionText: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: width * 0.045,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  exampleText: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: width * 0.045,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  imageStyle: {
    width: width * 0.13,
    height: height * 0.07,
    resizeMode: 'contain',
  },
  largeImageStyle: {
    width: width * 0.16,
    height: height * 0.08,
    resizeMode: 'contain',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: 18,
    color: 'red',
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#D5D5D5',
    borderRadius: 5,
  },
  retryButtonText: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9747FF',
  },
});

export default Home;
