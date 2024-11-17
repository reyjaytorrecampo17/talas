import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, AsyncStorage, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const Home = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // Helper function to fetch data with timeout
  const fetchDataWithTimeout = async (url, timeout = 5000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();
      clearTimeout(timer);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  // Fetch Word of the Day with caching to speed up loading
  const fetchWordOfTheDay = async () => {
    setLoading(true);
    setError('');

    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/word'; // Replace with actual Word of the Day API

    try {
      const data = await fetchDataWithTimeout(url);
      const word = data[0]?.word || 'No word found';
      setWordOfTheDay(word);
      await AsyncStorage.setItem('wordOfTheDay', word);

      // Save the date of the fetch for future caching
      const currentDate = new Date().toDateString();
      await AsyncStorage.setItem('lastFetchDate', currentDate);

      setLoading(false);
    } catch (error) {
      setError('Failed to fetch Word of the Day. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkWordOfTheDay = async () => {
      const savedDate = await AsyncStorage.getItem('lastFetchDate');
      const currentDate = new Date().toDateString();

      if (savedDate !== currentDate) {
        fetchWordOfTheDay();
      } else {
        const savedWord = await AsyncStorage.getItem('wordOfTheDay');
        setWordOfTheDay(savedWord);
        setLoading(false); // Set loading to false once the word is loaded from AsyncStorage
      }
    };

    // Check and load data asynchronously to speed up the display
    checkWordOfTheDay();

    // Set interval for real-time fetch (every 24 hours)
    const interval = setInterval(() => {
      checkWordOfTheDay(); // Check if a new word should be fetched
    }, 86400000); // 86400000 ms = 24 hours

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Runs once when the component mounts

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
      {/* Immediate content display with skeleton loading */}
      <Text style={styles.dictionaryTitle}>Word Of the Day</Text>
      <TouchableOpacity
        style={styles.dictionary}
        onPress={() => navigation.navigate('Dictionary')} // Navigate to Dictionary screen
      >
        <LinearGradient
          colors={['#11B7FC', '#00EEFF', '#00EEFF', '#11B7FC']}
          style={styles.WordContentContainer}
        >
          {loading ? (
            <SkeletonLoader /> // A custom loader component for skeleton UI
          ) : (
            <Text style={styles.textTitle}>{wordOfTheDay || 'No Word Found'}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.title}>Start your learning journey</Text>
      <TouchableOpacity 
        style={styles.BooksLessonCon}
        onPress={() => navigation.navigate('Lessons')} 
      >
        <LinearGradient
          colors={['#02EB02', '#02E702', '#02DD02', '#01D201']}
          style={styles.contentContainer}
        >
          <Image
            source={require('../images/abc.png')}
            style={{ height: 50, width: 50, alignSelf: 'flex-start', position: 'absolute', margin: 40 }}
          />
          <Text style={styles.textTitle}>Lessons</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.BooksLessonCon}
      onPress={() => navigation.navigate('TalasBooks')} 
      >
        <LinearGradient
          colors={['#FEE20E', '#FCD113', '#FCD113', '#F6BA06']}
          style={styles.contentContainer}
        >
          <Image
            source={require('../images/talas.png')}
            style={{ height: 130, width: 130, alignSelf: 'flex-start', position: 'absolute' }}
          />
          <Text style={styles.textTitle}>Talas Books</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <View style={styles.skeletonContainer}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9747FF',
  },
  skeletonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  contentContainer: {
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  WordContentContainer: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BooksLessonCon: {
    justifyContent: 'space-evenly',
    marginTop: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    width: 280,
    height: 100,
  },
  dictionary: {
    marginTop: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    height: 150,
  },
  dictionaryTitle: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: 20,
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: 10,
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2,  
  },
  title: {
    fontFamily: 'LilitaOne_400Regular',
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    marginTop: 30,
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2,  
  },
  textTitle: {
    marginLeft: 70,
    fontFamily: 'LilitaOne_400Regular',
    fontSize: 25,
    color: 'white',
    zIndex: 1,
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2,  
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Home;
