import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase'; // Updated to import db
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const generateIGN = (firstName) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `${firstName}_${randomNumber}`;
  };
  const calculateNextLevelXP = (currentLevel) => {
    // Example logic for dynamically calculating next level XP
    return 100 + currentLevel * 50; // Example: Level 1 requires 100 XP, Level 2 requires 150, and so on.
  };

  // Handle user registration
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Password validation (example: minimum length)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const generatedIGN = generateIGN(firstName);

      // Difficulty levels with pretestCompleted set to false
      const difficultyLevels = {
        easy: { pretestCompleted: false },
        medium: { pretestCompleted: false },
        hard: { pretestCompleted: false },
      };

      const initialLevel = 1;
      const initialXP = 0;
      const initialNextLevelXP = calculateNextLevelXP(initialLevel);

      // Add new user data to Firestore with difficulty levels and other fields
      await setDoc(doc(db, 'users', user.uid), { // Updated to use db
        email: user.email,
        firstName,
        lastName,
        age: parseInt(age), // Convert age to an integer
        ign: generatedIGN,
        level: initialLevel, // Initialize the user at level 1
        difficultyLevels,
        currentXP: initialXP,
        nextLevelXP: initialNextLevelXP,// Include difficulty levels object
      });

      // Provide feedback to the user
      Alert.alert('Success', 'Registration successful! Enjoy your journey here in TALAS!');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Navigation', params: { uid: user.uid } }],
      });
    } catch (error) {
      console.error('Error registering:', error.code, error.message);
      // Provide more user-friendly error messages
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message; // Default to the error message from Firebase
      }
      Alert.alert('Registration Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('../images/registerlogo.png')}
          style={{width: '100%', height: '30%', alignSelf: 'center'}}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.inputName}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.inputName}
          />
        </View>
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.registerbutton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account? <Text style={{ textDecorationLine: 'underline', color: '#007fff' }}>Login</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9146FF',
  },
  header1: {
    fontSize: 24,
    fontFamily: 'LilitaOne_400Regular',
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  header2: {
    fontSize: 24,
    fontFamily: 'LilitaOne_400Regular',
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
    textShadowColor: '#000000',
    textShadowRadius: 10,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    // iOS Shadow Properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,  // Adjust opacity as desired
    shadowRadius: 6.27,

    // Android Shadow Properties
    elevation: 10,  // Higher value means a more pronounced shadow
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'LilitaOne_400Regular',
  },
  inputName:{
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    width: 155,
    margin: 5,
    left:-5,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'LilitaOne_400Regular',
    paddingHorizontal: 10,
  },
  linkTextregister: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  registerbutton: {
    backgroundColor: '#02EB02',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: 150,
    alignItems: 'center',
    alignSelf: 'center', // Center the button horizontally
    marginTop: 50
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  loginText:{
    fontFamily: 'LilitaOne_400Regular',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 50,
    color: '#fff',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  }
});
