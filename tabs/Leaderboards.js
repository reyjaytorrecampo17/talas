import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase'; // Ensure this path is correct

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
        setUsers(usersData);  // Update the state with the fetched users
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch leaderboard data.');
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.header}>Leaderboard</Text>
      </View>

      {loading ? (
        <ActivityIndicator size={50} color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView>
          {/* Display the top 10 users */}
          <View style={styles.topContainer}>
            {users.slice(0, 3).map((user, index) => (
              <View key={user.id} style={styles.topUser}>
                {/* Profile Image */}
                <Image
                  source={require('../images/defaultImage.jpg')}
                  style={{
                    height: index === 0 ? 80 : 60,
                    width: index === 0 ? 80 : 60,
                    borderRadius: 100,
                  }}
                />
                {/* Crown for the top user only */}
                {index === 0 && (
                  <Image
                    source={require('../images/crown.png')}
                    style={{ height: 50, width: 70, top: -40, zIndex: 1, position: 'absolute' }}
                  />
                )}
                {/* Rank Badge */}
                <View style={[styles.rankBadge, { backgroundColor: index === 0 ? 'gold' : 'silver' }]}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={styles.username}>{user.ign}</Text>
                <Text style={styles.points}>{user.points} PTS.</Text>
              </View>
            ))}
          </View>

          {/* Display the rest of the users (if needed) */}
          {users.slice(3).map((user, index) => (
            <View key={user.id} style={styles.restContainer}>
              <Text style={styles.restTitle}>{index + 11}</Text>
              <Text style={styles.username}>{user.ign}</Text>
              <Text style={styles.points}>{user.points} PTS.</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'LilitaOne_400Regular',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
    flexWrap: 'wrap', // This allows the top users to wrap to the next line if needed
  },
  topUser: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  rankBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 100,
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
  },
  points: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'LilitaOne_400Regular',
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
});

export default Leaderboards;
