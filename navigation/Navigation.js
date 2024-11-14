import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import * as Animatable from 'react-native-animatable'; // Animations
import Leaderboards from '../tabs/Leaderboards';
import Games from '../tabs/Games';
import Dictionary from '../tabs/Dictionary';
import Profile from '../tabs/Profile';
import Home from '../tabs/Home';
import * as Progress from 'react-native-progress'; // For Progress Bars
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth,db } from '../services/firebase'// Ensure this path is correct
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot  } from 'firebase/firestore';
import { useLevel } from '../context/LevelContext';
const Tab = createBottomTabNavigator();

// Custom Animated Icon Component with Realistic Image Icons
const AnimatedIcon = ({ source, focused }) => {
  const animation = focused ? 'bounceIn' : undefined; // Add bounce animation
  const size = focused ? 40 : 35; // Icon sizes

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
    <Animatable.View animation={animation} duration={800} useNativeDriver={true}>
      <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
    </Animatable.View>
  );
};


const ProfileHeader = ({ userId }) => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ign, setIgn] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    if (!userId) {
      console.error('No userId provided');
      setError('User ID is missing.');
      setLoading(false);
      return;
    }
  
    const userDocRef = doc(db, 'users', userId);
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setIgn(userData.ign); // Set user's IGN
        setPoints(userData.currentXP); // Set user's current XP as points
        setLevel(userData.level); // Set user's level
        setProgress(userData.currentXP / userData.nextLevelXP); // Calculate progress
      } else {
        console.log('No such user!');
        setError('No such user!');
      }
      setLoading(false);
    }, (err) => {
      console.error('Error listening to user data:', err);
      setError('Failed to listen to user data.');
      setLoading(false);
    });
  
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [userId]);
  
  
  
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
   const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      navigation.navigate('Login');
      toggleModal(); // Close the modal
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.headerContainer}>
      {/* Profile Picture with Bounce Animation */}
      <View style={{flexDirection: 'column'}}>
      <View style={styles.profileImageContainer}>
      <Animatable.Image
        animation="bounceIn"
        delay={500}
        source={require('../images/defaultImage.jpg')} // Replace with the correct local path
        style={styles.profileImage}
      />
      </View>
      {/* Level Badge with Level-up Animation */}
      <View style={styles.levelBadgeContainer}>
      <View 
        delay={1500} 
        style={styles.levelBadge}
        iterationCount={level > 38 ? 'infinite' : 1} // Flashing effect on level-up
      >
        <Text style={styles.levelText}>{level}</Text>
      </View>
      </View>
      </View>
      <View style={styles.DropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.hamburger}>
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => {toggleDropdown();}} style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {toggleDropdown();}} style={styles.menuItem}>
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown(); // Close the menu
              navigation.navigate('ProfileScreen'); // Navigate to ProfileScreen
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown(); // Close the menu
              toggleModal(); // Call logout modal or logout function
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
      <View style={{flexDirection: 'column'}}>
      <LinearGradient
          colors={['#003343', '#003343']} // Specify your gradient colors here
          style={{
           height: 30,
           width: 150,
           borderRadius: 5,
           top: -10
          }}
          
        ><View style={{flexDirection: 'row', alignItems: 'center'}}>
          {loading ? (
            <Text style={styles.username}>Loading...</Text>
          ) : error ? (
            <Text style={styles.username}>{error}</Text>
          ) : (
            <Text style={styles.username}>{ign}</Text>
          )}
          </View>
        </LinearGradient>
        <View style={styles.pointsContainer}>
          <Image
            source={(require('../images/star.png'))}
            style={{ height: 20, width: 20, marginLeft: 5}}
          />
          <Text delay={1000} style={styles.points}>
            {points} PTS.
          </Text>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.progressBarContainer}>
        <Progress.Bar 
          progress={progress} 
          width={90} 
          color="#01D201" 
          style={styles.progressBar} 
        />
        </View>
        </View>

        {/* Currency/Stats with Pressable Scaling Animation */}
      <View style={styles.statsContainer}>
        {/* Bolt Icon */}
            <Image 
              source={require('../images/Streak.png')}
              style = {{width: 60, height: 35, zIndex: 1, top:2}}
            />
          <View style={styles.AccessContainer}>
            <Text style={styles.statText}>1</Text>
          </View>
        {/* Diamond Icon */}
        <TouchableOpacity 
          style={{zIndex: 2, left: 10, top: 20}}
          onPress={() => navigation.navigate('Shop')}
        >
          <Image
            source={require('../images/Plus.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <Image 
          source={require('../images/Gem.png')}
          style={{width: 30, height: 35, zIndex: 1, right: 24}}
        />
              
        <View style={styles.AccessContainer}>
          <Text style={styles.statText}>1</Text>
        </View>

        {/* Battery Icon */}
        <TouchableOpacity 
          style={{zIndex: 2, left: 10, top: 20}}
          onPress={() => navigation.navigate('Shop')}
        >
          <Image
            source={require('../images/Plus.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <Image 
          source={require('../images/battery.png')}
          style={{width: 30, height: 35, zIndex: 1, right: 24}}
        />
        <View style={styles.AccessContainer}>
          <Text style={styles.statText}>5</Text>
        </View>
      </View>
    </LinearGradient>
              <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Leaving so soon?</Text>
                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={handleLogout}>
                          <View style={styles.modalButtonYes}>                 
                            <Text style={styles.modalButton}>Yes</Text>                     
                        </View> 
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal}>
                        <View style={styles.modalButtonNo}>
                          <Text style={styles.modalButton}>No</Text>
                        </View></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
    </SafeAreaView>
  );
};

const Navigation = () => {
  const auth = getAuth(); // Get the Firebase Auth instance
  const currentUser = auth.currentUser; // Get the current user
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#2c2964', position: 'absolute' },
        tabBarActiveTintColor: '#9146FF', // This controls the color when focused
        tabBarInactiveTintColor: 'white', // This controls the color when not focused
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Leaderboards') {
            iconSource = require('../images/navicon/podium.png');
          } else if (route.name === 'Games') {
            iconSource = require('../images/navicon/joystick.png');
          } else if (route.name === 'Home') {
            iconSource = require('../images/navicon/home.png');
          } else if (route.name === 'Dictionary') {
            iconSource = require('../images/navicon/dictionary.png');
          } else if (route.name === 'Profile') {
            iconSource = require('../images/navicon/profile.png');
          }

          return <AnimatedIcon source={iconSource} focused={focused} />;
        },
        tabBarLabel: ({ focused }) => {
          return focused ? (
            <Text style={{fontFamily: 'LilitaOne_400Regular', color: 'white', fontSize: 11, marginTop: 20 }}>{route.name}</Text>
          ) : null;
        },
        tabBarItemStyle: {
          borderWidth: 1.5, // Add border to the left of each tab
          borderColor: 'black', // Set the border color
          paddingBottom: 5, // Adjust padding to make space for the border
          paddingTop: 5, // Add top padding if needed
        },
      })}
    >
     <Tab.Screen
      name="Leaderboards"
      component={Leaderboards}
      options={{
        headerLeft: false,
        headerShown: true,
        header: () => <ProfileHeader userId={currentUser?.uid} />, // Pass currentUser.uid to ProfileHeader
      }}
      initialParams={{ userId: currentUser?.uid }} // Pass currentUser.uid as userId prop
    />

      <Tab.Screen
        name="Games"
        component={Games}
        options={{
          headerLeft: false,
          headerShown: true,
          header: () => <ProfileHeader userId={currentUser?.uid} />
          , // Use the ProfileHeader here
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerLeft: false,
          headerShown: true,
          header: () => <ProfileHeader userId={currentUser?.uid} />
          , // Use the ProfileHeader here
        }}
      />
      <Tab.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          headerLeft: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerLeft: false,
          headerShown: true,
          header: () => <ProfileHeader userId={currentUser?.uid} />
          , // Use the ProfileHeader here
        }}
      />
    </Tab.Navigator>
  );
};

// Styles for the ProfileHeader
const styles = StyleSheet.create({
  container:{
    backgroundColor: '#050313'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 60
    
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
    left: 10,
    fontSize: 25,
  },
  pointsContainer: {
    flexDirection: 'row',
    top: -10,
    width: 130,
    backgroundColor: '#003343',
    borderWidth: 1,
    borderRadius: 5
  },
  points: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#fff',
    fontSize: 18,
    
  },
  levelBadge: {
    flex:1,
    width: '100%',
    backgroundColor: '#003343',
    borderWidth: 1.5,
    borderColor: '#EBAE5B',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  levelBadgeContainer:{
    width: 40,
    height: 25,
    borderWidth: 1.5,
    borderColor: '#333',
    zIndex: 1,
    alignSelf: 'center',
    top: -15
  },
  levelText: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#fff',
  },
  progressBar:{
    borderRadius: 1,
   
  },
  progressBarContainer:{
    top: -11,
    width: 100,
    height: 15,
    backgroundColor: '#003343',
    borderWidth: 1,
    borderRadius: 5
  },
  statsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 120,
    left: 20
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
    marginLeft: '95%',
    top: 35,
    position: 'absolute',
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
    right: -20,
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
    top: 20, // Adjust this value to position the dropdown below the hamburger
    left: -100,
    backgroundColor: '#fff',
    width: 120,
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
    color: '#333 ',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent background
},
modalContent: {
    height: 200,
    width: 300,
    padding: 20,
    backgroundColor: '#B57BFE',
    borderRadius: 10,
    alignItems: 'center',
},
modalText: {
    marginBottom: 20,
    fontSize: 30,
    fontFamily: 'LilitaOne_400Regular',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'black',  
    textShadowOffset: { width: 1, height: 1 },  
    textShadowRadius: 2, 
},
modalButtonYes: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#C20000',
  height: 50,
  width: 100,
  margin: 10,
  borderWidth: 1,
  borderRadius: 10,
  textShadowColor: 'black',  
  textShadowOffset: { width: 1, height: 1 },  
  textShadowRadius: 2, 
},
modalButtonNo: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#00B300',
  height: 50,
  width: 100,
  margin: 10,
  borderWidth: 1,
  borderRadius: 10,
  textShadowColor: 'black',  
  textShadowOffset: { width: 1, height: 1 },  
  textShadowRadius: 2, 
},
modalButton:{
  color: 'white',
  fontFamily: 'LilitaOne_400Regular',
  fontSize: 20
}
});

export default Navigation;