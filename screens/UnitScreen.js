import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal} from 'react-native';
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


  const [modalVisible, setModalVisible] = useState(false);

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
        <TouchableOpacity
          style={styles.unitContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.unitTitle}>The Ant and the Grasshopper</Text>
          <Text style={styles.readButton}>READ</Text>
        </TouchableOpacity>
        <TouchableOpacity style= {styles.optionContainer} onPress={() => {
              navigation.navigate('Vocabulary'); 
            }}>
          <Text style={styles.optionText}>Vocabulary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Comprehension: Main Ideas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Comprehension: Sequencing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>Phonics: Short Vowels</Text>
        </TouchableOpacity>
      </ScrollView>

            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>"The Ant and the Grasshopper"</Text>
            <ScrollView style={styles.storyContainer}>
              <Text style={styles.storyText}>
              One summer’s day, in a field, a Grasshopper was hopping about, chirping and singing to its heart's content. An Ant passed by, bearing along with great effort an ear of corn he was taking to his nest.
              "Why don’t you come and chat with me," asked the Grasshopper, "instead of toiling your life away?
              "I am helping to store up food for the winter," said the Ant, "and I recommend you to do the same."
              "Why bother about winter?" said the Grasshopper. "We have got plenty of food at present."
              The Ant and the Grasshopper Story
              But the Ant went on its way and continued its toil.
              When winter came, the Grasshopper found itself dying of hunger, while it saw the ants distributing, every day, corn and grain from the stores they had collected in summer.
              Then the Grasshopper knew...
              
              MORAL: Prepare for the future and work hard when it matters.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButtonModal}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonTextModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignSelf: 'flex-end',
    position: 'absolute',
    left: 300,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#9747FF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '90%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    fontFamily: 'LilitaOne_400Regular',
  },
  closeButtonModal: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    marginTop:'400',
  },
  closeButtonTextModal: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'LilitaOne_400Regular',
  },
  storyContainer: {
    width: '100%',
    height: '90%', 
    marginBottom: 20,
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  storyText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'LilitaOne_400Regular',
  },
});

export default UnitScreen;
