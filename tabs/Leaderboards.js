import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const Leaderboards = ({ route }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontsLoaded] = useFonts({ LilitaOne_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  // Fetch and listen to changes in the 'users' collection
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('points', 'desc'));

    // Real-time listener using onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching users:', err);
        setError('Failed to fetch leaderboard data.');
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
      {loading ? (
        <ActivityIndicator size={50} color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView>
          {/* Display the top 3 users */}
          <View style={styles.topContainer}>
          <View style={styles.secondThird}>
          <Image
              source={require('../images/defaultImage.jpg')}
              style={{ height: 60, width: 60, borderRadius: 100}}
            />
            <View style={styles.twoContainer}><Text style={styles.Title}>2</Text></View>
          </View>
            {users.slice(0, 3).map((user, index) => (
              <View key={user.id} style={styles.topUser}>
                <Image
                  source={require('../images/defaultImage.jpg')}
                  style={{
                    height: index === 0 ? 80 : 60,
                    width: index === 0 ? 80 : 60,
                    borderRadius: 100,
                    borderWidth: 1
                  }}
                />
                {index === 0 && (
                  <Image
                    source={require('../images/crown.png')}
                    style={{ height: 50, width: 70, top: -40, zIndex: 1, position: 'absolute' }}
                  />
                )}
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={styles.username}>{user.ign}</Text>
                <View style={{flexDirection: 'row'}}> 
                <Image
                  source={require('../images/star.png')}
                  style={{ height: 23, width: 23}}
                />
                <Text style={styles.points}>{user.points} PTS.</Text>
                </View>
              </View>
            ))}
          <View style={styles.secondThird}>
          <Image
            source={require('../images/defaultImage.jpg')}
            style={{ height: 60, width: 60, borderRadius: 100}}
          />
          <View style={styles.threeContainer}><Text style={styles.Title}>3</Text></View>
      </View>
      </View>
          {/* Display the rest of the users */}
          {users.slice(3).map((user, index) => (
            <View key={user.id} style={styles.restContainer}>
              <Text style={styles.restTitle}>{index + 4}</Text>
              <Text style={styles.username}>{user.ign}</Text>
              <Text style={styles.points}>{user.points} PTS.</Text>
            </View>
          ))}
        </ScrollView>
      )}
      </View>
      <View style={styles.ScrollViewContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9C59FE',
  },
  header: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'LilitaOne_400Regular',
  },
  top:{
    width: '100%s',
    height: '50%'
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 60,
  },
  topUser: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
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
  rankText: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#333',
  },
  username: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#fff',
    fontSize: 18,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    margin: 5
  },
  points: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  restContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  restTitle: {
    fontSize: 20,
    fontFamily: 'LilitaOne_400Regular',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  secondThird: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: 'black',
    top: 30,
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
  Title:{
    color: '#333',
    fontFamily: 'LilitaOne_400Regular'
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
  ScrollViewContainer:{
    justifyContent: 'center',
    width: '100%',
    height: '40%'
  }
});

export default Leaderboards;

