import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { auth, db } from '../services/firebase'; // Assuming your firebase setup is in firebase.js

const UnitScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null); // State to store user info
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    // Listen for user authentication state change
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the user's document from Firestore
          const userRef = doc(db, 'users', firebaseUser.uid); // Assuming user data is stored in 'users' collection
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUser(userDoc.data()); // Set user data to state
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null); // No user logged in
      }
      setLoading(false); // Set loading to false after checking the auth state
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Unit 1</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.unitContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.unitTitle}>The Ant and the Grasshopper</Text>
          <Text style={styles.readButton}>READ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('Vocabulary', { unit: 'unit1' })}>
          <Text style={styles.optionText}>Vocabulary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('MainIdea', { unit: 'unit1' })}>
          <Text style={styles.optionText}>Comprehension: Main Ideas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}onPress={() => navigation.navigate('Sequencing', { unit: 'unit1' })}>
          <Text style={styles.optionText}>Comprehension: Sequencing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('ShortVowels', { unit: 'unit1' })}>
          <Text style={styles.optionText}>Phonics: Short Vowels</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>"The Ant and the Grasshopper"</Text>
            <ScrollView style={styles.storyContainer}>
              <Text style={styles.storyText}>
                One summer’s day, in a field, a Grasshopper was hopping about, chirping and singing to its heart's content. An Ant passed by, bearing along with great effort an ear of corn he was taking to his nest...
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButtonModal} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonTextModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9747FF' },
  header: { height: 130, justifyContent: 'center', alignItems: 'center' },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 30, fontFamily: 'LilitaOne_400Regular', color: '#FFF' },
  closeButton: { justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', position: 'absolute', left: 300, zIndex: 10, backgroundColor: 'red', height: 30, width: 30, borderWidth: 1 },
  closeButtonText: { fontSize: 20, fontFamily: 'LilitaOne_400Regular', color: '#FFF' },
  contentContainer: { alignItems: 'center', padding: 20 },
  unitContainer: { backgroundColor: '#00BFFF', width: '100%', borderRadius: 10, padding: 20, alignItems: 'center', marginBottom: 20 },
  unitTitle: { fontSize: 24, fontFamily: 'LilitaOne_400Regular', color: '#FFF', marginBottom: 10 },
  readButton: { fontSize: 18, fontFamily: 'LilitaOne_400Regular', color: '#FFF', backgroundColor: '#32CD32', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', width: '100%', borderRadius: 10, padding: 15, marginBottom: 15 },
  optionText: { fontSize: 20, fontFamily: 'LilitaOne_400Regular', color: '#000' },
  userInfoContainer: { marginTop: 20, alignItems: 'center' },
  userInfoText: { fontSize: 18, color: '#FFF' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { backgroundColor: '#9747FF', padding: 20, borderRadius: 10, width: '90%', height: '90%' },
  modalText: { fontSize: 16, marginBottom: 20, color: 'white', fontFamily: 'LilitaOne_400Regular' },
  closeButtonModal: { backgroundColor: 'red', padding: 10, borderRadius: 5, width: '30%' },
  closeButtonTextModal: { color: 'white', fontSize: 20, fontFamily: 'LilitaOne_400Regular' },
  storyContainer: { width: '100%', height: '90%', marginBottom: 20, padding: 40, backgroundColor: '#FFFFFF', borderRadius: 10 },
  storyText: { fontSize: 16, color: '#000', fontFamily: 'LilitaOne_400Regular' },
});

export default UnitScreen;
