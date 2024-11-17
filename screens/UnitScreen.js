import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Linear Gradient
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

const UnitScreen = ({ navigation }) => {
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
        <TouchableOpacity style={styles.unitContainer}>
          <Text style={styles.unitTitle}>The Ant and the Grasshopper</Text>
          <Text style={styles.readButton}>READ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Vocabulary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Comprehension: Main Ideas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Vocabulary: Homonym</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Phonics: Short Vowels</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9747FF',
  },
  header: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'LilitaOne_400Regular',
    color: '#FFF',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'LilitaOne_400Regular',
    color: '#FFF',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  unitContainer: {
    backgroundColor: '#00BFFF',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  unitTitle: {
    fontSize: 24,
    fontFamily: 'LilitaOne_400Regular',
    color: '#FFF',
    marginBottom: 10,
  },
  readButton: {
    fontSize: 18,
    fontFamily: 'LilitaOne_400Regular',
    color: '#FFF',
    backgroundColor: '#32CD32',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  optionText: {
    fontSize: 20,
    fontFamily: 'LilitaOne_400Regular',
    color: '#000',
  },
});

export default UnitScreen;
