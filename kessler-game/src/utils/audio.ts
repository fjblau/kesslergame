export function playRocketLaunch() {
  try {
    const audio = new Audio('/rocket-launch.mp3');
    const initialVolume = 0.5;
    audio.volume = initialVolume;
    
    audio.play().catch(() => {
      // Ignore audio play errors (e.g., autoplay policy)
    });

    const fadeStartTime = 2500;
    const fadeDuration = 500;
    const fadeSteps = 20;
    const fadeInterval = fadeDuration / fadeSteps;
    
    setTimeout(() => {
      let step = 0;
      const fadeTimer = setInterval(() => {
        step++;
        audio.volume = initialVolume * (1 - step / fadeSteps);
        
        if (step >= fadeSteps) {
          clearInterval(fadeTimer);
          audio.pause();
          audio.currentTime = 0;
        }
      }, fadeInterval);
    }, fadeStartTime);
  } catch {
    // Ignore audio errors
  }
}

export function playCollision() {
  try {
    const audio = new Audio('/small-explosion.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore audio play errors (e.g., autoplay policy)
    });
  } catch {
    // Ignore audio errors
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
