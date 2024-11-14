// LevelProgressComponent.js
import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';

const LevelProgressComponent = ({ level, currentXP, nextLevelXP }) => {
  const progress = currentXP / nextLevelXP;

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>Level: {level}</Text>
      <ProgressBarAndroid 
        styleAttr="Horizontal"
        indeterminate={false}
        progress={progress}
        color="#2196F3"
      />
      <Text style={styles.xpText}>
        {currentXP} XP / {nextLevelXP} XP
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 14,
    color: '#666',
  },
});

export default LevelProgressComponent;
