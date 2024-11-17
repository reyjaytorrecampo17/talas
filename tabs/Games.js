import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const { width, height } = Dimensions.get('window');
const Games = ({ navigation }) => {
  const [uid, setUid] = useState(null);
  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  // Loading screen
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnQuiz} onPress={() => navigation.navigate('QuizScreen')}>
        <LinearGradient colors={['#CD11FC', '#E26DFF', '#E26DFF', '#CD11FC']} style={styles.gradient}>
          <Image
            source={require('../images/magnifying.png')}
            style={[styles.icon, { left: width * 0.1 }]}  // Adjusting icon position based on screen width
          />
          <Text style={styles.outlineText}>Context Clues</Text>
          <Text style={styles.btnText}>Context Clues</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnQuiz} onPress={() => navigation.navigate('QuizScreen')}>
        <LinearGradient colors={['#0000FF', '#1E90FF', '#87CEFA', '#4682B4']} style={styles.gradient}>
          <Image
            source={require('../images/compass.png')}
            style={[styles.icon, { top: height * 0.01, left: width * 0.08 }]}  // Adjusting icon position based on screen height and width
          />
          <Text style={styles.outlineText}>Story Adventure</Text>
          <Text style={styles.btnText}>Story Adventure</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnQuiz}>
        <LinearGradient colors={['#008C0E', '#6BF36B', '#6BF36B', '#008C0E']} style={styles.gradient}>
          <Image
            source={require('../images/crossword.png')}
            style={[styles.icon, { top: height * 0.01, left: width * 0.08 }]}  // Adjusting icon position based on screen height and width
          />
          <Text style={styles.outlineText}>CrossWord</Text>
          <Text style={styles.btnText}>CrossWord</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9C59FE',
  },
  title: {
    fontSize: 24,
    fontFamily: 'LilitaOne_400Regular',
    color: 'white',
    marginBottom: 20,
  },
  btnQuiz: {
    width: width * 0.9,
    height: height * 0.2,
    marginTop: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    overflow: 'hidden',  // Ensures elements like images don't overflow outside the button area
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  outlineText: {
    fontSize: width * 0.1, // Dynamic font size based on screen width
    fontFamily: 'LilitaOne_400Regular',
    position: 'absolute',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: 'white',
    textAlign: 'center',
    zIndex: 1,
  },
  btnText: {
    fontSize: width * 0.097, // Dynamic font size based on screen width
    height: height * 0.07,
    fontFamily: 'LilitaOne_400Regular',
    textAlign: 'center',
  },
  icon: {
    height: height * 0.15,
    width: width * 0.3,
    position: 'absolute',
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C59FE',
  },
});

export default Games;
