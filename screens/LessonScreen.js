import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const LessonScreen = ({navigation}) => {
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
            <Text style={styles.title}>Lessons</Text>
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
      <TouchableOpacity style= {styles.unitOneContainer}>
        <Text style={styles.unitText}>Unit 1</Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.unitTwoContainer}>
        <Text style={styles.unitText}>Unit 2</Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.unitThreeContainer}>
        <Text style={styles.unitText}>Unit 3</Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.unitFourContainer}>
        <Text style={styles.unitText}>Unit 4</Text>
      </TouchableOpacity>
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
    unitOneContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '15%',
        margin: 20,
        marginTop: 50,
        borderRadius: 10,
        backgroundColor: '#ffe135'
    },
    unitTwoContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '15%',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#7A0F0F'
    },
    unitThreeContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '15%',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#00B300'
    },
    unitFourContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '15%',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#132097'
    },
    unitText:{
        color: 'white',
        fontSize: 30,
        fontFamily: 'LilitaOne_400Regular'
    }
  });

export default LessonScreen;
  
