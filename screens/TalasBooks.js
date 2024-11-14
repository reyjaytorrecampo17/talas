import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const TalasBooks = ({navigation}) => {
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
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.header}>
        <View style={styles.header}>
            <Text style={styles.title}>My Library</Text>
        </View>
        <View style={styles.statsContainer}>
        <View style={styles.xContainer}>
          {/* X Button to go back */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        </View>
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
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
      position: 'absolute',
      left: 100,
      zIndex: 10,
      backgroundColor: 'red',
      height: 30,
      width: 30,
      borderWidth: 1,
    },
    closeButtonText: {
      fontSize: 20,
      fontFamily: 'LilitaOne_400Regular',
      color: '#FFF',
    },
    xContainer: {
      top: -35,
      left: 20,
    },
  });
  
  export default TalasBooks;
  
  
