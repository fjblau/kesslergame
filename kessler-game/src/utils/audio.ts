let backgroundMusic: HTMLAudioElement | null = null;

export function playBackgroundMusic() {
  try {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    
    backgroundMusic = new Audio('/space-flight.mp3');
    backgroundMusic.volume = 0.2;
    backgroundMusic.loop = true;
    
    backgroundMusic.play().catch(() => {
      // Ignore audio play errors (e.g., autoplay policy)
    });
  } catch {
    // Ignore audio errors
  }
}

export function stopBackgroundMusic() {
  try {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      backgroundMusic = null;
    }
  } catch {
    // Ignore audio errors
  }
}

export function playRocketLaunch() {
  try {
    const audio = new Audio('/rocket-launch.mp3');
    audio.volume = 0.5;
    audio.loop = false;
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        const fadeStartTime = 2500;
        const fadeDuration = 500;
        const fadeSteps = 20;
        const fadeInterval = fadeDuration / fadeSteps;
        
        const fadeTimeout = setTimeout(() => {
          let step = 0;
          const fadeTimer = setInterval(() => {
            step++;
            audio.volume = Math.max(0, 0.5 * (1 - step / fadeSteps));
            
            if (step >= fadeSteps) {
              clearInterval(fadeTimer);
              audio.pause();
              audio.currentTime = 0;
            }
          }, fadeInterval);
        }, fadeStartTime);
        
        setTimeout(() => {
          clearTimeout(fadeTimeout);
          audio.pause();
          audio.currentTime = 0;
        }, 3000);
      }).catch(() => {
        // Ignore audio play errors (e.g., autoplay policy)
      });
    }
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
