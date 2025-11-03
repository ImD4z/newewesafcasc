
import { useCallback } from 'react';

export const useSound = (soundUrl: string) => {
  const play = useCallback(() => {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(e => console.error("Audio playback failed:", e));
    } catch (e) {
      console.error("Failed to create audio object:", e);
    }
  }, [soundUrl]);

  return play;
};