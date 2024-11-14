import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { AntDesign } from 'react-native-vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

export default function App() {
    const [newWord, setNewWord] = useState("");
    const [checkedWord, setCheckedWord] = useState("");
    const [definition, setDefinition] = useState("");
    const [example, setExample] = useState("");
    const [sound, setSound] = useState();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const searchWord = (enteredWord) => {
        // Capitalize the first letter of the entered word
        const capitalizedWord = enteredWord.charAt(0).toUpperCase() + enteredWord.slice(1);
        setNewWord(capitalizedWord);
    };

    const getInfo = async () => {
        if (!newWord.trim()) {
            setError("Please enter a word to search.");
            setTimeout(() => setError(null), 3000);
            return;
        }

        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${newWord.trim()}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                setError("Word not found in the database");
                setTimeout(() => setError(null), 3000);
                return;
            }

            const fetchedData = await response.json();
            setData(fetchedData);

            if (fetchedData.length > 0) {
                const word = fetchedData[0].word;
                const def = fetchedData[0].meanings[0].definitions[0].definition;
                const eg = fetchedData[0].meanings[0].definitions[0].example || "No example available.";

                setCheckedWord(word);
                setDefinition(def);
                setExample(eg);
                setError(null);
            } else {
                setError("Word not found in the database");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("An error occurred while fetching data");
        }

        setTimeout(() => {
            setError(null);
        }, 3000);
    };

    const playAudio = async () => {
        if (data && data[0].phonetics && data[0].phonetics[0] && data[0].phonetics[0].audio) {
            if (sound) {
                await sound.unloadAsync();
            }

            const audioUri = data[0].phonetics[0].audio;
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });

            setSound(newSound);
            await newSound.playAsync();
        }
    };

    const clear = async () => {
        setCheckedWord("");
        setDefinition("");
        setExample("");
        setNewWord("");
        setData(null);

        if (sound) {
            await sound.unloadAsync();
        }
    };
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

    return (
        <SafeAreaView style={styles.container}>
            {fontsLoaded ? (
            <>
            <Text style={styles.heading}>Dictionary</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search..."
                    value={newWord}
                    onChangeText={(text) => searchWord(text)}
                />
                <TouchableOpacity style={styles.button} onPress={() => getInfo()}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={() => clear()}>
                <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {checkedWord && !error && (
                <ScrollView 
                    style={styles.resultsContainer} 
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <Text style={styles.word}>{checkedWord}</Text>
                    <TouchableOpacity style={styles.playButton} onPress={() => playAudio()}>
                        <AntDesign name="sound" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <View style={styles.resultTextContainer}>
                        <Text style={styles.resultLabel}>Definition:</Text>
                        <Text style={styles.resultText}>{definition}</Text>
                        <Text style={styles.resultLabel}>Example:</Text>
                        <Text style={styles.resultText}>{example}</Text>
                    </View>
                </ScrollView>
            )}
            </>
            ) : (
            <ActivityIndicator size="24" color="#ffffff" />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        fontFamily: 'LilitaOne_400Regular',
        marginTop: 10,
    },
    heading: {
        fontSize: 30,
        marginBottom: 20,
        fontFamily: 'LilitaOne_400Regular',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 18,
        fontFamily: 'LilitaOne_400Regular',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        marginLeft: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'LilitaOne_400Regular',
        fontSize: 18,
        textShadowColor: 'black',  
        textShadowOffset: { width: 2, height: 2 },  
        textShadowRadius: 2,  
    },
    resultsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        padding: 20,
        marginTop: 20,
        height: '60%',
        width: '100%',
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    word: {
        fontSize: 28,
        fontFamily: 'LilitaOne_400Regular',
        color: '#333',
    },
    playButton: {
        backgroundColor: '#2ecc71',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    resultTextContainer: {
        alignItems: 'flex-start',
        paddingTop: 20,
        width: '100%',
    },
    resultLabel: {
        fontSize: 20,
        fontFamily: 'LilitaOne_400Regular',
        color: '#555',
        marginBottom: 5,
    },
    resultText: {
        fontSize: 18,
        fontFamily: 'LilitaOne_400Regular',
        marginBottom: 15,
        color: '#777',
        lineHeight: 24,
        textAlign: 'justify',
    },
    clearButton: {
        marginStart: '80%',
        backgroundColor: '#FF4A4A',
        borderRadius: 10,
        padding: 5
    },
    clearButtonText: {
        color: '#fff',
        fontFamily: 'LilitaOne_400Regular',
        fontSize: 15,
        textShadowColor: 'black',  
        textShadowOffset: { width: 1, height: 2 },  
        textShadowRadius: 2,  
    },
});
