import { Audio } from 'expo-av';

let sound;

export const playClickSound = async () => {
  try {
    if (!sound) {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/clickmenu.wav')
      );
      sound = loadedSound;
    }
    await sound.replayAsync(); // Play the sound
  } catch (error) {
    console.error('Error playing click sound:', error);
  }
};

// Clean up function to unload the sound
export const unloadSound = async () => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
};
