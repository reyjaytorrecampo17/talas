import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, AsyncStorage, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchWordOfTheDay = async () => {
    setLoading(true);
    setError('');

    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/word'; // Replace with actual Word of the Day API

    try {
      const response = await fetch(url);
      const data = await response.json();
      const word = data[0]?.word || 'No word found';
      setWordOfTheDay(word);

      await AsyncStorage.setItem('wordOfTheDay', word);

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
        setLoading(false);
      }
    };

    checkWordOfTheDay();

    const interval = setInterval(() => {
      checkWordOfTheDay();
    }, 86400000);

    return () => clearInterval(interval);
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
        onPress={() => navigation.navigate('Dictionary')}
      >
        <LinearGradient
          colors={['#11B7FC', '#00EEFF', '#00EEFF', '#11B7FC']}
          style={styles.WordContentContainer}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.textTitle}>{wordOfTheDay || 'No Word Found'}</Text>
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
        onPress={() => navigation.navigate('Lessons')} 
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
      onPress={() => navigation.navigate('TalasBooks')} 
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
});

export default Home;
