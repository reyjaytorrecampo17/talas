import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Replace with your Firebase configuration
import { getAuth } from 'firebase/auth';

const LessonScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  const [statuses, setStatuses] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            setStatuses(userSnapshot.data());
          } else {
            console.error('User document does not exist');
          }
        } else {
          console.error('No user is logged in');
        }
      } catch (error) {
        console.error('Error fetching statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  const isUnit2Locked =
    !statuses.ShortVowelsCompleted ||
    !statuses.Sequencing ||
    !statuses.mainIdeaCompleted ||
    !statuses.vocabularyCompleted;

  const isUnit3Locked =
    !statuses.ShortVowelsCompleted2 ||
    !statuses.Sequencing2 ||
    !statuses.mainIdeaCompleted2 ||
    !statuses.vocabularyCompleted2;

  const isUnit4Locked =
    !statuses.ShortVowelsCompleted3 ||
    !statuses.Sequencing3 ||
    !statuses.mainIdeaCompleted3 ||
    !statuses.vocabularyCompleted3;

  const renderUnitButton = (unit, isLocked, onPress) => (
    <TouchableOpacity
      style={[styles.unitContainer, isLocked && styles.lockedUnit]}
      onPress={isLocked ? null : onPress}
    >
      <Text style={styles.unitText}>{`Unit ${unit}`}</Text>
      {isLocked && <Text style={styles.lockedText}>Locked</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#050313', '#18164C', '#25276B']} style={styles.header}>
        <View style={styles.header}>
          <Text style={styles.title}>Lessons</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.xContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {renderUnitButton(1, false, () => navigation.navigate('UnitScreen', { unit: 1 }))}
      {renderUnitButton(2, isUnit2Locked, () => navigation.navigate('UnitScreen', { unit: 2 }))}
      {renderUnitButton(3, isUnit3Locked, () => navigation.navigate('UnitScreen', { unit: 3 }))}
      {renderUnitButton(4, isUnit4Locked, () => navigation.navigate('UnitScreen', { unit: 4 }))}
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
  unitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '15%',
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#ffe135',
  },
  lockedUnit: {
    backgroundColor: '#A9A9A9',
  },
  unitText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'LilitaOne_400Regular',
  },
  lockedText: {
    fontSize: 16,
    color: 'red',
    marginTop: 5,
  },
});

export default LessonScreen;
