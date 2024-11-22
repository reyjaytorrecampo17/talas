import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, Button, Alert, Dimensions, LayoutAnimation } from 'react-native';

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
    const inputRefs = useRef([]);

    useEffect(() => {
        setGrid(generateInitialGrid(crosswordData));
    }, [crosswordData]);

    const handleInputChange = (row, col, text) => {
        const newGrid = [...grid];
        newGrid[row][col] = text.toUpperCase();
        setGrid(newGrid);

        // Focus on the next cell automatically
        focusNextCell(row, col, text);
    };

    const focusNextCell = (row, col, text) => {
        if (text && col < 7) {
            // Move to the next cell in the current row
            let nextCell = inputRefs.current[row][col + 1];
            if (nextCell && nextCell.focus) {
                nextCell.focus();
            }
        } else if (text && row < 6) {
            // Move to the first cell of the next row if current row is filled
            let nextCell = inputRefs.current[row + 1][0];
            if (nextCell && nextCell.focus) {
                nextCell.focus();
            }
        }
    };

    const handleGenerate = () => {
        level = (level + 1) % crosswordData.length; // Cycle through levels
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleVerify = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
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
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleSolve = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        width: Dimensions.get('window').width / 10, // Dynamic sizing
        height: Dimensions.get('window').width / 10,
        textAlign: 'center',
        fontSize: 13, // Proportional font size
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
