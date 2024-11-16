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
        {loading ? (
          <ActivityIndicator size={50} color="#0000ff" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <ScrollView>
            {/* Display the top 3 users separately */}
            <View style={styles.topContainer}>
              {users.slice(0, 1).map((user, index) => (
                <View key={user.id} style={styles.topUser}>
                  <Image source={require('../images/defaultImage.jpg')} style={styles.profileImage} />
                  <Image source={require('../images/crown.png')} style={styles.crownImage} />
                  <View style={[styles.rankBadge, { backgroundColor: 'gold' }]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.username}>{user.ign}</Text>
                  <View style={styles.pointsContainer}>
                    <Image source={require('../images/star.png')} style={styles.starImage} />
                    <Text style={styles.points}>{user.points} PTS.</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', top: -120 }}>
              <View style={styles.topContainer2}>
                {users.slice(1, 2).map((user, index) => (
                  <View key={user.id} style={styles.topUser}>
                    <Image source={require('../images/defaultImage.jpg')} style={styles.profileImage} />
                    <View style={[styles.rankBadge, { backgroundColor: 'silver' }]}>
                      <Text style={styles.rankText}>{index + 2}</Text>
                    </View>
                    <Text style={styles.username}>{user.ign}</Text>
                    <View style={styles.pointsContainer}>
                      <Image source={require('../images/star.png')} style={styles.starImage} />
                      <Text style={styles.points}>{user.points} PTS.</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.topContainer3}>
                {users.slice(2, 3).map((user, index) => (
                  <View key={user.id} style={styles.topUser}>
                    <Image source={require('../images/defaultImage.jpg')} style={styles.profileImage} />
                    <View style={[styles.rankBadge, { backgroundColor: '#cd7f32' }]}>
                      <Text style={styles.rankText}>{index + 3}</Text>
                    </View>
                    <Text style={styles.username}>{user.ign}</Text>
                    <View style={styles.pointsContainer}>
                      <Image source={require('../images/star.png')} style={styles.starImage} />
                      <Text style={styles.points}>{user.points} PTS.</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', top: -130 }}>
            <ScrollView>
              {/* Display users ranked 4 to 10 */}
              {users.slice(3, 10).map((user, index) => (
                <View key={user.id} style={styles.restContainer}>
                  <View style={styles.restUser}>
                    <Text style={styles.restText}>{index + 4}</Text>
                    <Image source={require('../images/defaultImage.jpg')} style={styles.restprofileImage} />
                    <Text style={styles.restusername}>{user.ign}</Text>
                    <View style={styles.pointsContainer}>
                      <Image source={require('../images/star.png')} style={styles.starImage} />
                      <Text style={styles.restpoints}>{user.points} PTS.</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
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
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexWrap: 'wrap', // This allows the top users to wrap to the next line if needed
  },
  topContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexWrap: 'wrap', // This allows the top users to wrap to the next line if needed
    left: -20
  },
  topContainer3: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexWrap: 'wrap', // This allows the top users to wrap to the next line if needed
    left: 20
  },
  topUser: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 100,
    borderWidth: 2,
    margin: 5
  },
  restprofileImage:{
    top: -8,
    marginRight: 10,
    height: 40,
    width: 40,
    borderRadius: 100,
    borderWidth: 2,
  },
  crownImage: {
    height: 50,
    width: 70,
    top: -30,
    zIndex: 1,
    position: 'absolute'
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
    top: 70,
  },
  rankText: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#333',
    fontSize: 20,
    marginlef: -10,
  },
  restText:{
    fontFamily: 'LilitaOne_400Regular',
    color: '#333',
    fontSize: 20,
    marginlef: -10,
    marginRight: 10
  },
  username: {
    fontFamily: 'LilitaOne_400Regular',
    color: '#fff',
    fontSize: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  restusername:{
    fontFamily: 'LilitaOne_400Regular',
    color: '#333',
    fontSize: 20,
    marginRight: 25,
  },
  pointsContainer: {
    flexDirection: 'row',
  },
  starImage: {
    width: 20,
    height: 20,
  },
  points: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'LilitaOne_400Regular',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  restpoints:{
    color: '#333',
    fontSize: 18,
    fontFamily: 'LilitaOne_400Regular',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  restContainer:{
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 300,
    height: 60,
    borderRadius: 10,
    padding: 20,
    margin: 10
  },
  restUser:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
  }
});

export default Leaderboards;
