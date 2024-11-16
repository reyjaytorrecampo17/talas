import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from'../services/firebase' // Adjust the import path if needed
import Checkbox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';


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
      // Proceed with navigation as usual
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'The email address is not valid.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('User Not Found', 'No user found with this email address.');
      } else {
        Alert.alert('Login Error', error.message);
      }
    }
    if (!isSelected) {
      Alert.alert('Error', 'Please accept the Terms and Conditions');
      return;
    }
  };
  
  return (
    <View style={styles.container}>
      {fontsLoaded ? (
      <>
      <View style={styles.logocon}>
      <Image source={require('../images/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.spc} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!isPasswordVisible}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.forgotpassTxt}>Forgot Password?</Text>
      <Checkbox
        value={isSelected}
        onValueChange={setSelection}
        style={styles.checkbox}
      />
      <Text style={styles.label}>
        I have read and accept <Text style={styles.termsCon}>Terms and Condition</Text> and <Text style={styles.termsCon}>Privacy policy</Text>
      </Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={{top: 30}}>
        <Text style={styles.linkText} onPress={() => navigation.navigate('RegisterScreen')}>
          Don't have an account? <Text style={styles.RegisterText}>Register Here</Text>
        </Text>
        </View>
      </View>
      </>
      ) : (
        <ActivityIndicator size="24" color="#ffffff" />
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9146FF',
  },
  logo: {
    width: width * 1, // Adjust logo width relative to screen width (90%)
    height: height * .6,
    aspectRatio: 1, // Maintains the aspect ratio (1:1 here, adjust based on your logo)
    resizeMode: 'contain',
  },
  logocon: {
    position: 'absolute',
    top: -100,
    left: 17,
    right: 0,
    alignItems: 'center',
    paddingTop: width * 0.1,
  },
  spc: {
    height: 300,
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
  forgotpassTxt: {
    fontSize: 15,
    fontFamily: 'LilitaOne_400Regular',
    color: '#a9a9a9',
    left: '65%',
    marginBottom: 20,
    textShadowColor: 'black',  
    textShadowOffset: { width: 1, height: 1 },  
    textShadowRadius: 2, 
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 30,
  },
  LoginButton: {
    alignItems: 'center',
    backgroundColor: '#007fff',
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.09,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  checkbox: {
    alignSelf: 'flex-start',
    left: 5,
    top: 1,
    backgroundColor: 'white',
  },
  label: {
    margin: 10,
    fontSize: 18,
    marginTop: -20,
    marginBottom: 40,
    left: 30,
    color: '#fff',
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
  termsCon:{
    color: '#007fff'
  },
  RegisterText: {
    fontFamily: 'LilitaOne_400Regular',
    textDecorationLine: 'underline',
    margin: 20,
    top: 20,
    fontSize: 18,
    color: '#19C74A'
  },
  linkText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 2, 
  },
});

export default LoginScreen;
