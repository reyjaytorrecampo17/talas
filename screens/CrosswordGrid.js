import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, Button, Alert, Dimensions, LayoutAnimation, ImageBackground, TouchableOpacity } from 'react-native';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

let level = 0;

const generateInitialGrid = (crosswordData, level) => {
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

const generateAnswerGrid = (crosswordData, level) => {
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
    const [grid, setGrid] = useState(generateInitialGrid(crosswordData, 0));
    const [currentOrientation, setCurrentOrientation] = useState('across'); // Default orientation
    const [level, setLevel] = useState(0); // Level state
    const inputRefs = useRef([]);

    useEffect(() => {
        setGrid(generateInitialGrid(crosswordData, level));
    }, [crosswordData, level]);

    const handleInputChange = (row, col, text) => {
        const newGrid = [...grid];
        newGrid[row][col] = text.toUpperCase();
        setGrid(newGrid);
        focusNextCell(row, col, text);
    };

    const focusNextCell = (row, col, text) => {
        if (text) {
            if (currentOrientation === 'across') {
                // Move right if orientation is 'across'
                for (let i = col + 1; i < grid[row].length; i++) {
                    if (inputRefs.current[row][i] && grid[row][i] === '') {
                        inputRefs.current[row][i].focus();
                        return;
                    }
                }
            } else if (currentOrientation === 'down') {
                // Move down if orientation is 'down'
                for (let i = row + 1; i < grid.length; i++) {
                    if (inputRefs.current[i][col] && grid[i][col] === '') {
                        inputRefs.current[i][col].focus();
                        return;
                    }
                }
            }
        }
    };

    const handleCellFocus = (row, col) => {
        // Identify the orientation based on the crossword clue
        crosswordData[level].forEach(({ startx, starty, orientation, answer }) => {
            const x = startx - 1;
            const y = starty - 1;

            if (orientation === 'across' && y === row && col >= x && col < x + answer.length) {
                setCurrentOrientation('across');
            } else if (orientation === 'down' && x === col && row >= y && row < y + answer.length) {
                setCurrentOrientation('down');
            }
        });
    };

    const handleGenerate = () => {
        const nextLevel = (level + 1) % crosswordData.length;
        setLevel(nextLevel);
        setGrid(generateInitialGrid(crosswordData, nextLevel));
    };

    const handleVerify = () => {
        const answerGrid = generateAnswerGrid(crosswordData, level);
        let isCorrect = true;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x] !== answerGrid[y][x]) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }
        Alert.alert(isCorrect ? 'Congratulations!' : 'Incorrect. Please try again.');
    };

    const handleReset = () => {
        setGrid(generateInitialGrid(crosswordData, level));
    };

    const handleSolve = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const answerGrid = generateAnswerGrid(crosswordData, level);
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
                                key={`${rowIndex}-${colIndex}-${cell}`}
                                style={[
                                    styles.cell,
                                    cell === 'X' ? styles.staticCell : styles.editableCell, // Only apply background to editable cells
                                ]}
                                value={cell === 'X' ? '' : cell}
                                editable={cell !== 'X'}
                                onFocus={() => handleCellFocus(rowIndex, colIndex)}
                                onChangeText={(text) => handleInputChange(rowIndex, colIndex, text)}
                                maxLength={1}
                                ref={(el) => {
                                    if (!inputRefs.current[rowIndex]) {
                                        inputRefs.current[rowIndex] = [];
                                    }
                                    inputRefs.current[rowIndex][colIndex] = el;
                                }}
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
        <ImageBackground
            source={require('../assets/background.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                {renderQuestions()}
                {renderGrid()}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleGenerate}>
                        <Text style={styles.buttonText}>Generate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleVerify}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleReset}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSolve}>
                        <Text style={styles.buttonText}>Solve</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        width: Dimensions.get('window').width / 10,
        height: Dimensions.get('window').width / 10,
        textAlign: 'center',
        fontSize: 14,
        borderRadius: 5,
        transition: 'all 0.2s ease', // Smooth transition
    },
    editableCell: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Background for editable cells
        fontFamily: 'LilitaOne_400Regular',
    },
    staticCell: {
        borderColor: 'transparent',
        color: '#000', // Static cells without background
    },
    smallDigit: {
        position: 'absolute',
        top: 2,
        left: 2,
        fontSize: 12,
        fontWeight: 'bold',
    },
    questionsContainer: {
        marginBottom: 10,
        padding: 10,
    },
    questionText: {
        fontSize: 17,
        color: 'black',
        fontFamily: 'LilitaOne_400Regular',
    },
    headingContainer: {
        marginVertical: 5,
    },
    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#228B22',
        textAlign: 'center',
        fontFamily: 'LilitaOne_400Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: '#228B22',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        margin: 5,
        elevation: 3,
        opacity: 0.9,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'LilitaOne_400Regular',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
    },
});

export default CrosswordGrid;
