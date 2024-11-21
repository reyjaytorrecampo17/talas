// CrosswordGrid.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Button, Alert } from 'react-native';

let level = 0;

const generateInitialGrid = (crosswordData) => {
    const initialGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    crosswordData[level].forEach(({ answer, startx, starty, orientation }) => {
        let x = startx - 1;
        let y = starty - 1;

        for (let i = 0; i < answer.length; i++) {
            if (orientation === 'across') {
                initialGrid[y][x + i] = ''; // Mark empty for user input
            } else if (orientation === 'down') {
                initialGrid[y + i][x] = ''; // Mark empty for user input
            }
        }
    });
    return initialGrid;
};

const generateAnswerGrid = (crosswordData) => {
    const answerGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    crosswordData[level].forEach(({ answer, startx, starty, orientation }) => {
        let x = startx - 1;
        let y = starty - 1;

        for (let i = 0; i < answer.length; i++) {
            if (orientation === 'across') {
                answerGrid[y][x + i] = answer[i].toUpperCase();
            } else if (orientation === 'down') {
                answerGrid[y + i][x] = answer[i].toUpperCase();
            }
        }
    });
    return answerGrid;
};

const CrosswordGrid = ({ crosswordData }) => {
    const [grid, setGrid] = useState(generateInitialGrid(crosswordData));

    useEffect(() => {
        setGrid(generateInitialGrid(crosswordData));
    }, [crosswordData]);

    const handleInputChange = (row, col, text) => {
        const newGrid = [...grid];
        newGrid[row][col] = text.toUpperCase();
        setGrid(newGrid);
    };

    const handleGenerate = () => {
        level = (level + 1) % crosswordData.length; // Cycle through levels
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleVerify = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
        const isCorrect = JSON.stringify(grid) === JSON.stringify(answerGrid);
        Alert.alert(isCorrect ? 'Congratulations!' : 'Incorrect. Please try again.');
    };

    const handleReset = () => {
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleSolve = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
        setGrid(answerGrid);
    };

    const renderGrid = () => (
        <View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <View key={colIndex} style={styles.cellContainer}>
                            {crosswordData[level].map(({ startx, starty, position }) => {
                                if (rowIndex + 1 === starty && colIndex + 1 === startx) {
                                    return (
                                        <Text key={`digit-${position}`} style={styles.smallDigit}>
                                            {position}
                                        </Text>
                                    );
                                }
                                return null;
                            })}
                            <TextInput
                                key={`${rowIndex}-${colIndex}-${cell}`} // Force re-render
                                style={[styles.cell, cell === 'X' ? styles.staticCell : null]}
                                value={cell === 'X' ? '' : cell}
                                editable={cell !== 'X'}
                                onChangeText={(text) => handleInputChange(rowIndex, colIndex, text)}
                                maxLength={1}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    const renderQuestions = () => {
        const questions = { across: [], down: [] };

        crosswordData[level].forEach(({ hint, orientation, position }) => {
            const questionText = `${position}. ${hint}`;
            questions[orientation].push(
                <Text key={`question-${position}`} style={styles.questionText}>
                    {questionText}
                </Text>
            );
        });

        return (
            <View>
                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Across</Text>
                </View>
                <View style={styles.questionsContainer}>
                    {questions.across}
                </View>
                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Down</Text>
                </View>
                <View style={styles.questionsContainer}>
                    {questions.down}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderQuestions()}
            {renderGrid()}
            <View style={styles.buttonContainer}>
                <Button color="#228B22" title="Generate" onPress={handleGenerate} />
                <View style={styles.gap} />
                <Button color="#228B22" title="Verify" onPress={handleVerify} />
                <View style={styles.gap} />
                <Button color="#228B22" title="Reset" onPress={handleReset} />
                <View style={styles.gap} />
                <Button color="#228B22" title="Solve" onPress={handleSolve} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    cellContainer: {
        position: 'relative',
    },
    cell: {
        borderWidth: 1,
        margin: 1,
        borderColor: '#228B22',
        width: 40, // Increased from 30 to 40
        height: 40, // Increased from 30 to 40
        textAlign: 'center',
        fontSize: 15, // Increased font size for better visibility
    },
    staticCell: {
        borderColor: 'transparent',
        color: '#000', // Ensure visibility of static cells
    },
    smallDigit: {
        position: 'absolute',
        top: 2,
        left: 2,
        fontSize: 12, // Slightly larger for better readability
        fontWeight: 'bold',
    },
    questionsContainer: {
        marginBottom: 10,
        padding: 10,
    },
    questionText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    headingContainer: {
        marginVertical: 5,
    },
    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#228B22',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    gap: {
        width: 10,
    },
});


export default CrosswordGrid;
