// ProfileHeader.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import * as Animatable from 'react-native-animatable'; // Animations
import * as Progress from 'react-native-progress'; // For Progress Bars
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const ProfileHeader = () => {
  const [points, setPoints] = React.useState(0);
  const [level, setLevel] = React.useState(38);
  const [progress, setProgress] = React.useState(0.75); // XP progress (75%)
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Return null or a loading spinner while fonts are loading
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.DropdownContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.hamburger}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.menuItem}>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDropdown} style={styles.menuItem}>
              <Text style={styles.menuText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDropdown} style={styles.menuItem}>
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDropdown} style={styles.menuItem}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.headerContainer}>
        <View style={styles.profileImageContainer}>
          <Animatable.Image
            animation="bounceIn"
            delay={500}
            source={require('./images/1.jpg')} // Replace with the correct local path
            style={styles.profileImage}
          />
        </View>
        <View style={styles.levelBadgeContainer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>
        <LinearGradient
          colors={['#003343', '#003343']}
          style={styles.usernameContainer}
        >
          <Image
            source={require('./images/star.png')}
            style={styles.starIcon}
          />
          <Text style={styles.username}>IGN</Text>
        </LinearGradient>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>120 PTS.</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={progress}
            width={50}
            color="#01D201"
            style={styles.progressBar}
          />
        </View>
        <View style={styles.statsContainer}>
          <Image
            source={require('./images/Streak.png')}
            style={styles.streakIcon}
          />
          <View style={styles.AccessContainer}>
            <Text style={styles.statText}>1</Text>
          </View>
          <Image
            source={require('./images/Gem.png')}
            style={styles.gemIcon}
          />
          <View style={styles.AccessContainer}>
            <Text style={styles.statText}>1</Text>
          </View>
          <Image
            source={require('./images/battery.png')}
            style={styles.batteryIcon}
          />
          <View style={styles.AccessContainer}>
            <Text style={styles.statText}>5</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container:{
      backgroundColor: '#050313'
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingBottom: 80
      
    },
    profileImage: {
      width: 60,
      height: 60,
      borderColor: '#333',
      borderRadius: 5,
      borderWidth: 1,
    },
    profileImageContainer:{
      borderWidth: 7,
      borderColor: '#C0C0C1', 
      borderRadius: 10,
      zIndex: 1,
    },
    username: {
      fontFamily: 'LilitaOne_400Regular',
      color: '#fff',
      fontSize: 20,
      left: 10
    },
    pointsContainer: {
      position: 'fixed',
      backgroundColor: '#003343',
      right: 200,
      top: 15,
      paddingHorizontal: 30,
      paddingVertical: 2,
      borderWidth: 1,
      borderRadius: 5
    },
    points: {
      fontFamily: 'LilitaOne_400Regular',
      color: '#fff',
      fontSize: 18,
    },
    levelBadge: {
      backgroundColor: '#003343',
      paddingVertical: 3,
      paddingHorizontal: 6,
      borderWidth: 1.5,
      borderColor: '#EBAE5B',
      zIndex: 1,
    },
    levelBadgeContainer:{
      right: 55,
      top: 35,
      borderWidth: 1.5,
      borderColor: '#333',
      zIndex: 1,
    },
    levelText: {
      fontFamily: 'LilitaOne_400Regular',
      color: '#fff',
    },
    progressBar:{
      borderRadius: 1,
      left: 20,
    },
    progressBarContainer:{
      position: 'static',
      backgroundColor: '#003343',
      right: 370,
      top: 37,
      paddingVertical: 4,
      paddingHorizontal: 40 ,
      borderWidth: 1,
      borderRadius: 5
    },
    statsContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      right: 500,
      top: 80
    },
    AccessContainer: {
      backgroundColor: '#003343',
      paddingVertical: -2,
      paddingHorizontal: 30 ,
      alignItems: 'center',
      justifyContent:'center',
      right: 50,
      borderRadius: 10,
      borderWidth: 1
    },
    statText: {
      fontFamily: 'LilitaOne_400Regular',
      fontSize: 15,
      color: '#fff',
      left: 10
    },
    DropdownContainer:{
      justifyContent: 'center',
      alignContent: 'center',
      marginLeft: '90%',
      marginTop: '11%',
      position: 'absolute',
      justifyContent: 'flex-start',
      alignItems: 'flex-end', // Align items to the right
      zIndex: 3
    },
    hamburger: {
      justifyContent: 'center',
      alignContent: 'center',
      padding: 5,
      backgroundColor: '#003343',
      borderRadius: 5,
      height: 37,
      width: 50,
      right: -15,
      marginTop: 20, // Optional: add space from the top padding: 10,
      borderRadius: 5,
      position: 'absolute',
    },
    hamburgerText: {
      alignSelf: 'center',
      fontSize: 25,
      color: '#fff',
      top: -5,
    },
    dropdown: {
      position: 'absolute',
      top: 60, // Adjust this value to position the dropdown below the hamburger
      backgroundColor: '#fff',
      width: 100,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    menuItem: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    menuText: {
      fontSize: 16,
      fontFamily: 'LilitaOne_400Regular',
      color: '#333',
    }
  });
  

export default ProfileHeader;
