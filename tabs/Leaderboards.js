import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { useState, useEffect } from 'react';
import { auth,db } from '../services/firebase'// Ensure this path is correct
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';

const Leaderboards = ({ route }) => {
  const [points, setPoints] = React.useState(0);
  const [ign, setIgn] = useState('');
  const { userId } = route.params; 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchUserIGN = async () => {
      if (!userId) {
        console.error('No userId provided');
        setError('User ID is missing.');
        setLoading(false);
        return;
      }
  
      try {
        const userDocRef = doc(db, 'users', userId); // Using db, 'users', userId
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setIgn(userDoc.data().ign);
        } else {
          console.log('No such user!');
          setError('No such user!');
        }
      } catch (err) {
        console.error('Error fetching user IGN:', err);
        setError('Failed to fetch IGN.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserIGN();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
      <View style={styles.secondThird}>
      <Image
          source={require('../images/defaultImage.jpg')}
          style={{ height: 60, width: 60, borderRadius: 100}}
        />
        <View style={styles.twoContainer}><Text style={styles.Title}>2</Text></View>
      </View>
      <View style={styles.first}>
      <Image
          source={require('../images/crown.png')}
          style={{ height: 50, width: 70, top: -40, zIndex: 1, position: 'absolute'}}
        />
        <Image
           source={require('../images/defaultImage.jpg')}
          style={{ height: 80, width: 80, borderRadius: 100}}
        />
        <View style={styles.oneContainer}><Text style={styles.Title}>1</Text></View>
      </View>
  
      <View style={styles.secondThird}>
        <Image
           source={require('../images/defaultImage.jpg')}
          style={{ height: 60, width: 60, borderRadius: 100}}
        />
         <View style={styles.threeContainer}><Text style={styles.Title}>3</Text></View>
      </View>
      </View>
      <View style={styles.nameContainer}>
         {loading ? (
            <Text style={styles.username}>Loading...</Text>
          ) : error ? (
            <Text style={styles.username}>{error}</Text>
          ) : (
            <Text style={styles.username}>{ign}</Text>
          )}
        <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../images/star.png')}
          style={{ height: 30, width: 30}}
        />
        <Text style={styles.points}>{points} PTS.</Text>
        </View>
      </View>
    <ScrollView>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>4</Text>
    </View>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>5</Text>
    </View>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>6</Text>
    </View>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>7</Text>
    </View>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>8</Text>
    </View>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>9</Text>
    </View>
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>10</Text>
    </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9C59FE',
  },
  row: {
    marginTop: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  first: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: 'black',
  },
  secondThird: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: 'black',
    top: 30,
  },
  oneContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: 'gold',
    position: 'absolute',
    top: 60,
  },
  twoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: 'silver',
    position: 'absolute',
    top: 40,
  },
  threeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 30,
    width: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: '#CD7F32',
    top: 40,
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  Title:{
    color: '#333',
    fontFamily: 'LilitaOne_400Regular'
  },
  nametitle: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'LilitaOne_400Regular',
  },
  points: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'LilitaOne_400Regular',
  },
  restContainer: {
    alignItems: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    marginTop: 20,
    height: 40,
    width: 300,
    borderRadius: 10,
  },
  restTitle: {
    fontSize: 25,
    fontFamily: 'LilitaOne_400Regular',
  },
  username: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#fff',
    fontSize: 20,
    textShadowColor: 'black',  
    textShadowOffset: { width: 1, height: 1 },  
    textShadowRadius: 2, 
  },
});

export default Leaderboards;


