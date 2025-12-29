export type SoundEffect = 'launch' | 'cascade';

const SOUND_FILES: Record<SoundEffect, string> = {
  launch: '/audio/smallExplosion.mp3',
  cascade: 'synthesized',
};

export function playSound(effect: SoundEffect) {
  const soundPath = SOUND_FILES[effect];
  
  if (soundPath === 'synthesized') {
    playCascadeWarning();
    return;
  }
  
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Silently fail if audio playback is blocked
    });
  } catch {
    // Ignore errors (browser compatibility, file not found, etc.)
  }
}

export function playCascadeWarning() {
  try {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    }, 400);
  } catch {
    // Ignore audio errors (e.g., if browser doesn't support Web Audio API)
  }
}
