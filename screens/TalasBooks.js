import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { Ionicons } from '@expo/vector-icons'; // Import back arrow icon
import { playClickSound } from '../soundUtils'; // Import the sound utility

const TalasBooks = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  const handleBackPress = async () => {
    await playClickSound(); // Play sound when back button is pressed
    navigation.goBack(); // Navigate to the previous screen
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.header}>
        <View style={styles.header}>
          <Text style={styles.title}>My Library</Text>
          {/* Back Arrow Button in the upper left corner */}
          <TouchableOpacity style={styles.closeButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>

        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9747FF',
  },
  header: {
    height: 130,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'LilitaOne_400Regular',
    color: '#FFF',
    margin: 10,
    top: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    top: -30,
  },
  closeButton: {
    position: 'absolute',
    top: 40, // Position it in the upper left corner
    left: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});

export default TalasBooks;
