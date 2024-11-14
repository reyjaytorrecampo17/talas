import React from 'react';
import { Modal, View, Text, Button } from 'react-native';

const FeedbackModal = ({ visible, onNext, isCorrect }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          <Text>{isCorrect ? 'Correct!' : 'Wrong!'}</Text>
          <Button title="Next Question" onPress={onNext} />
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;
