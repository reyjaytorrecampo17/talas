import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playClickSound } from '../soundUtils'; // Import the sound utility

const apiKey = 'x4n1360hwgo4iu8gr0fdvt10dudaxz7n5ygfcv6zfg86g9zl0'; // Replace with your actual API key

export default function App() {
    const [newWord, setNewWord] = useState("");
    const [checkedWord, setCheckedWord] = useState("");
    const [definition, setDefinition] = useState("");
    const [example, setExample] = useState("");
    const [error, setError] = useState(null);
    const [wordOfTheDay, setWordOfTheDay] = useState("");

    useEffect(() => {
        const fetchWordOfTheDay = async () => {
            const wordOfTheDayURL = `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`;

            try {
                const response = await fetch(wordOfTheDayURL);
                const wordData = await response.json();
                const word = wordData.word;

                setWordOfTheDay(word);
                getWordInfo(word);  // Fetch additional data for the Word of the Day
            } catch (error) {
                console.error("Error fetching Word of the Day:", error);
                setError("Failed to fetch Word of the Day");
            }
        };

        fetchWordOfTheDay();
    }, []);

    const searchWord = (enteredWord) => {
        const capitalizedWord = enteredWord.charAt(0).toUpperCase() + enteredWord.slice(1);
        setNewWord(capitalizedWord);
    };

    const getWordInfo = async (word) => {
        const url = `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word.trim())}/definitions?limit=1&includeRelated=false&includeTags=false&api_key=${apiKey}`;

        try {
            const response = await fetch(url);
            const fetchedData = await response.json();

            if (fetchedData.length > 0 && fetchedData[0].text) {
                const word = fetchedData[0].word;
                const def = fetchedData[0].text;
                const eg = fetchedData[0].exampleUses.length > 0 ? fetchedData[0].exampleUses[0].text : 'No example available.';

                setCheckedWord(word);
                setDefinition(def);
                setExample(eg);
            } else {
                setError("Word not found in the dictionary API.");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("An error occurred while fetching data.");
        }

        setTimeout(() => {
            setError(null);
        }, 3000);
    };

    const clear = async () => {
        setCheckedWord("");
        setDefinition("");
        setExample("");
        setNewWord("");
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
                        <TouchableOpacity style={styles.button} onPress={() => { playClickSound(); getWordInfo(newWord); }}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.clearButton} onPress={() => { playClickSound(); clear(); }}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {checkedWord && !error && (
                        <ScrollView
                            style={styles.resultsContainer}
                            contentContainerStyle={styles.scrollViewContent}
                        >
                            <Text style={styles.word}>{checkedWord}</Text>
                            <TouchableOpacity style={styles.playButton} onPress={() => { playClickSound(); }}>
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
    word: {
        fontSize: 26,
        fontFamily: 'LilitaOne_400Regular',
        color: '#333',
    },
    playButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 50,
        alignSelf: 'center',
    },
    resultTextContainer: {
        marginTop: 20,
    },
    resultLabel: {
        fontSize: 18,
        fontFamily: 'LilitaOne_400Regular',
        color: '#333',
    },
    resultText: {
        fontSize: 16,
        fontFamily: 'LilitaOne_400Regular',
        color: '#555',
        marginBottom: 10,
    },
    clearButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
    },
    clearButtonText: {
        fontSize: 18,
        fontFamily: 'LilitaOne_400Regular',
        color: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
