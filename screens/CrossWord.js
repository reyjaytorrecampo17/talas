import React from 'react';
import { View, StyleSheet } from 'react-native';
import CrosswordGrid from './CrosswordGrid.js';
const crosswordData = [
    [
        {
            answer: "TIGER",
            hint: "The powerful predator roams the jungle",
            startx: 4,
            starty: 1,
            orientation: "down",
            position: 1,
        },
        {
            answer: "EAGLE",
            hint: "A majestic bird known for its keen eyesight",
            startx: 4,
            starty: 4,
            orientation: "across",
            position: 2,
        },
        {
            answer: "ITALIC",
            hint: "It's a style of typeface characterized by slanted letters",
            startx: 7,
            starty: 1,
            orientation: "down",
            position: 3,
        },
        {
            answer: "INFINITE",
            hint:"It describes something boundless or limitless in extent or quantity",
            startx: 1,
            starty: 2,
            orientation: "across",
            position: 4,
        },
    ],
    [
        {
            answer: "QUIVER",
            hint: "To shake or tremble slightly, often with rapid movements",
            startx: 1,
            starty: 4,
            orientation: "across",
            position: 1,
        },
        {
            answer: "TWIRL",
            hint: "To spin or rotate quickly",
            startx: 3,
            starty: 2,
            orientation: "down",
            position: 2,
        },
        {
            answer: "GAZE",
            hint: "To look steadily and intently at something, often implying concentration or contemplation",
            startx: 5,
            starty: 1,
            orientation: "down",
            position: 3,
        },
        {
            answer: "FLUTE",
            hint: "A musical instrument with a high-pitched sound",
            startx: 2,
            starty: 6,
            orientation: "across",
            position: 4,
        },
    ],
];
const CrossWord = () => {
    return (
        <View style={styles.container}>
            <CrosswordGrid crosswordData={crosswordData} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
export default CrossWord;