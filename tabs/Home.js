import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const Home = ({ navigation }) => {
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
      {fontsLoaded ? (
        <>
          <Text style={styles.dictionaryTitle}>Word Of the Day</Text>
          <TouchableOpacity
            style={styles.dictionary}
            onPress={() => navigation.navigate('Dictionary')} // Navigate to Dictionary screen
          >
            <LinearGradient
              colors={['#11B7FC', '#00EEFF', '#00EEFF', '#11B7FC']}
              style={styles.WordContentContainer}
            >
              <Text style={styles.textTitle}>Dreidel</Text>
            </LinearGradient>
          </TouchableOpacity>
  
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
        </>
      ) : (
        <ActivityIndicator size="24" color="#ffffff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9747FF',
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
});

export default Home;
