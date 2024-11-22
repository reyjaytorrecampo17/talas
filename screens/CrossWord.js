import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CrosswordGrid from './CrosswordGrid';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const CrossWord = () => {
    const [crosswordData, setCrosswordData] = useState([]);

    useEffect(() => {
        const fetchCrosswordData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "crosswords"));
                const puzzles = [];
                querySnapshot.forEach((doc) => {
                    puzzles.push(doc.data().clues); // Fetch clues array
                });
                const validPuzzles = puzzles.filter((puzzle) => puzzle !== undefined); // Remove undefined entries
                setCrosswordData(validPuzzles);
            } catch (error) {
                console.error("Error fetching crossword data: ", error);
            }
        };
    
        fetchCrosswordData();
    }, []);
    
    

    if (crosswordData.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CrosswordGrid crosswordData={crosswordData} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CrossWord;
