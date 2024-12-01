import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const words = ['WORD', 'READING', 'STORY', 'LETTER', 'COMPREHENSION', 'GAME', 'DICTIONARY', 'GUESS'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const HangmanGame = () => {
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(3); // Set initial attempts to 3

  useEffect(() => {
    setRandomWord();
  }, []);

  const setRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
  };

  const handleGuess = (letter) => {
    if (word.includes(letter)) {
      setGuesses([...guesses, letter]);
    } else {
      setRemainingAttempts(remainingAttempts - 1); // Decrease remaining attempts on incorrect guess
    }
  };

  const resetGame = () => {
    setRandomWord();
    setGuesses([]);
    setRemainingAttempts(3); // Reset remaining attempts to 3
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <Text key={index} style={styles.letter}>
        {guesses.includes(letter) ? letter : '_'}
      </Text>
    ));
  };

  const isGameOver = remainingAttempts <= 0; // Game is over if remaining attempts reach 0
  const isGameWon = word.split('').every(letter => guesses.includes(letter));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangman Game</Text>
      <Text style={styles.word}>{renderWord()}</Text>
     <View style={styles.infoContainer}>
        <Text style={styles.info}>Remaining attempts :</Text>
        <Text style={[styles.info, styles.remainingAttempts]}>{remainingAttempts}</Text>
      </View>
      {isGameOver ? (
          <Text style={styles.lost}>Game Over! The word was {word}.</Text>
      ) : isGameWon ? (
       <View style={styles.overlay}>
          <LottieView
            source={require('../assets/party.json')}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.win}>Congratulations! You won!</Text>
        </View>
      ) : (
        <View style={styles.lettersContainer}>
          {alphabet.map((letter) => (
            <TouchableOpacity
              key={letter}
              onPress={() => handleGuess(letter)}
              disabled={guesses.includes(letter)}
              style={[
                styles.letterButton,
                guesses.includes(letter) && styles.disabledButton
              ]}
            >
              <Text style={styles.letterButtonText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Button title="Reset Game" onPress={resetGame}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  word: {
    fontSize: 32,
    marginBottom: 20,
    letterSpacing: 2,
  },
  letter: {
    fontSize: 32,
    marginHorizontal: 5,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color:"black",
  },
  lost: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "red",
  },
   win: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  letterButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  letterButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingAttempts:{
    color:"red",
    marginLeft: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
});

export default HangmanGame;
