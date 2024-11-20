import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase'; // Updated to import db
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { playClickSound } from '../soundUtils'; // Import the sound utility

const { width, height } = Dimensions.get('window');

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
    return 100 + currentLevel * 50;
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const generatedIGN = generateIGN(firstName);

      const difficultyLevels = {
        easy: { pretestCompleted: false },
        medium: { pretestCompleted: false },
        hard: { pretestCompleted: false },
      };

      const initialLevel = 1;
      const initialXP = 0;
      const initialNextLevelXP = calculateNextLevelXP(initialLevel);

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName,
        lastName,
        age: parseInt(age),
        ign: generatedIGN,
        level: initialLevel,
        difficultyLevels,
        currentXP: initialXP,
        nextLevelXP: initialNextLevelXP,
      });

      Alert.alert('Success', 'Registration successful! Enjoy your journey here in TALAS!');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Navigation', params: { uid: user.uid } }],
      });
    } catch (error) {
      console.error('Error registering:', error.code, error.message);
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
          errorMessage = error.message;
      }
      Alert.alert('Registration Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../images/registerlogo.png')} style={styles.logo} />
      <View style={styles.nameContainer}>
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
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={async () => {
          await playClickSound(); // Play the click sound
          handleRegister(); // Trigger the register action
        }}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>


      <Text 
        style={styles.loginText} 
        onPress={async () => { 
          await playClickSound(); // Play the click sound
          navigation.navigate('Login'); // Navigate to the Login screen
        }}
      >
        Already have an account?{' '}
        <Text style={styles.loginLink}>Login</Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    backgroundColor: '#9146FF',
  },
  logo: {
    width: '100%',
    height: height * 0.3,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  inputName: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: height * 0.06,
    paddingHorizontal: 10,
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontFamily: 'LilitaOne_400Regular',
  },
  input: {
    height: height * 0.06,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 15,
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontFamily: 'LilitaOne_400Regular',
  },
  registerButton: {
    backgroundColor: '#02EB02',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: height * 0.05,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  loginText: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: height * 0.05,
    color: '#fff',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontFamily: 'LilitaOne_400Regular',
  },
  loginLink: {
    textDecorationLine: 'underline',
    color: '#007fff',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontFamily: 'LilitaOne_400Regular',
  },
});
