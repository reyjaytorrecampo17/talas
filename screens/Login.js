import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase'; // Adjust the import path if needed
import Checkbox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { playClickSound } from '../soundUtils'; // Import the sound utility

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
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

  const handleLogin = async () => {
    if (!isSelected) {
      Alert.alert('Error', 'Please accept the Terms and Conditions to Login.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'The email address is not valid.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('User Not Found', 'No user found with this email address.');
      } else {
        Alert.alert('Login Error', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onFocus={async () => await playClickSound()} // Play sound when the field is focused
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          onFocus={async () => await playClickSound()} // Play sound when the field is focused
        />

        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        <View style={styles.checkboxContainer}>
        <Checkbox
          value={isSelected}
          onValueChange={async (newValue) => {
            await playClickSound(); // Play the click sound when the checkbox is toggled
            setSelection(newValue); // Update the checkbox state
          }}
          style={styles.checkbox}
        />
          <Text style={styles.label}>
            I have read and accept{' '}
            <Text style={styles.link}>Terms and Conditions</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={async () => { 
            await playClickSound(); // Play the click sound
            handleLogin(); // Trigger the login action
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.registerLink} onPress={async () => { 
          await playClickSound(); // Play the click sound
          navigation.navigate('RegisterScreen'); // Navigate to the RegisterScreen
        }}>
          Don't have an account? <Text style={styles.registerText}>Register Here</Text>
        </Text>

      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#9146FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: height * 0.1,
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 1.5,
    height: height * 0.25,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontFamily: 'LilitaOne_400Regular',
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    color: '#a9a9a9',
    fontSize: width * 0.05,
    marginBottom: 20,
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontFamily: 'LilitaOne_400Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 50,
    width: width * 0.86,
    left: -10
  },
  checkbox: {
    marginRight: 10,
    backgroundColor: 'white',
    left: 5,
    top: -7,
  },
  label: {
    fontSize: width * 0.05,
    color: '#fff',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontFamily: 'LilitaOne_400Regular',
  },
  link: {
    color: '#007fff',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontSize: width * 0.05,
    fontFamily: 'LilitaOne_400Regular',
  },
  loginButton: {
    backgroundColor: '#007fff',
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  registerLink: {
    fontSize: width * 0.05,
    color: '#fff',
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  registerText: {
    color: '#19C74A',
    textDecorationLine: 'underline',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
    fontSize: width * 0.06,
    fontFamily: 'LilitaOne_400Regular',
  },
});

export default LoginScreen;
