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
      <TouchableOpacity style={styles.btnQuiz} onPress={() => {
              navigation.navigate('QuizScreen'); 
            }}>
        <LinearGradient colors={['#CD11FC', '#E26DFF', '#E26DFF', '#CD11FC']} style={styles.gradient}>
          <Image
            source={require('../images/magnifying.png')}
            style={{ height: height* 0.15, width: width * 0.3, position: 'absolute', left: 50, margin: 10}}
          />
          <Text style={styles.outlineText}>Context Clues</Text>
          <Text style={styles.btnText}>Context Clues</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnQuiz} onPress={() => {
              navigation.navigate('QuizScreen'); 
            }}>
        <LinearGradient colors={['#0000FF', '#1E90FF', '#87CEFA', '#4682B4']} style={styles.gradient}>

          <Image
            source={require('../images/compass.png')}
            style={{ height: height* 0.15, width: width * 0.3, position: 'absolute', left: 10, top: -10, margin: 10}}
          />
          <Text style={styles.outlineText}>Story Adventure</Text>
          <Text style={styles.btnText}>Story Adventure</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnQuiz}>
        <LinearGradient colors={['#19F119', '#6BF36B', '#6BF36B', '#19F119']} style={styles.gradient}>
            
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnQuiz}>
        <LinearGradient colors={['#3544CE', '#3948C9', '#3948C9', '#3544CE']} style={styles.gradient}>
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
    margin: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  outlineText: {
    fontSize: 40,
    fontFamily: 'LilitaOne_400Regular',
    position: 'absolute',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: 'white',
    textAlign: "center",
    zIndex: 1,
  },
  btnText: {
    fontSize: 43,
    fontFamily: 'LilitaOne_400Regular',
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C59FE',
  },
});

export default Games;
