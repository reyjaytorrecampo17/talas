import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase'; // Import initialized Firebase auth
import Navigation from './navigation/Navigation'; // Import your Navigation component
import LoginScreen from './screens/Login'; // Import LoginScreen
import ProfileScreen from './screens/ProfileScreen'; // Import ProfileScreen
import QuizScreen from './screens/QuizScreen'; // Import QuizScreen
import RegisterScreen from './screens//RegisterScreen'; // Import RegisterScreen
import PretestScreen from './screens/PretestScreen';
import Shop from './screens/Shop';
import LessonScreen from './screens/LessonScreen';
import TalasBooks from './screens/TalasBooks';
import { LevelProvider } from './context/LevelContext';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <LevelProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Navigation' : 'Login'}>
        {user ? (
          <Stack.Screen name="Navigation" component={Navigation} options={{ headerShown: false }} />
        ) : (
          <>
             <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="Shop" component={Shop} options={{ headerShown: false }}/>
        <Stack.Screen name="Lessons" component={LessonScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TalasBooks" component={TalasBooks} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PretestScreen" component={PretestScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </LevelProvider>
  );
}
