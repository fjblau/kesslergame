let backgroundMusic: HTMLAudioElement | null = null;
const activeAudioElements: Set<HTMLAudioElement> = new Set();
const activeAudioContexts: Set<AudioContext> = new Set();

let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

export function playBackgroundMusic() {
  if (!soundEnabled) return;
  try {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
    
    backgroundMusic = new Audio('/space-flight.mp3');
    backgroundMusic.volume = 0.4;
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

export function stopAllSounds() {
  try {
    stopBackgroundMusic();
    
    activeAudioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    activeAudioElements.clear();
    
    activeAudioContexts.forEach(ctx => {
      ctx.close().catch(() => {});
    });
    activeAudioContexts.clear();
  } catch {
    // Ignore audio errors
  }
}

export function playRocketLaunch() {
  if (!soundEnabled) return;
  try {
    const audio = new Audio('/rocket-launch.mp3');
    audio.volume = 0.5;
    audio.loop = false;
    activeAudioElements.add(audio);
    
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
              activeAudioElements.delete(audio);
            }
          }, fadeInterval);
        }, fadeStartTime);
        
        setTimeout(() => {
          clearTimeout(fadeTimeout);
          audio.pause();
          audio.currentTime = 0;
          activeAudioElements.delete(audio);
        }, 3000);
      }).catch(() => {
        activeAudioElements.delete(audio);
      });
    }
  } catch {
    // Ignore audio errors
  }
}

export function playCollision() {
  if (!soundEnabled) return;
  try {
    const audio = new Audio('/small-explosion.mp3');
    audio.volume = 0.3;
    activeAudioElements.add(audio);
    
    audio.addEventListener('ended', () => {
      activeAudioElements.delete(audio);
    });
    
    audio.play().catch(() => {
      activeAudioElements.delete(audio);
    });
  } catch {
    // Ignore audio errors
  }
}

export function playSatelliteCapture() {
  if (!soundEnabled) return;
  try {
    const audio = new Audio('/space-gun.mp3');
    audio.volume = 0.4;
    activeAudioElements.add(audio);
    
    audio.addEventListener('ended', () => {
      activeAudioElements.delete(audio);
    });
    
    audio.play().catch(() => {
      activeAudioElements.delete(audio);
    });
  } catch {
    // Ignore audio errors
  }
}

export function playSolarFlare() {
  if (!soundEnabled) return;
  try {
    const audio = new Audio('/solar-flare.mp3');
    audio.volume = 0.5;
    audio.loop = false;
    activeAudioElements.add(audio);
    
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
              activeAudioElements.delete(audio);
            }
          }, fadeInterval);
        }, fadeStartTime);
        
        setTimeout(() => {
          clearTimeout(fadeTimeout);
          audio.pause();
          audio.currentTime = 0;
          activeAudioElements.delete(audio);
        }, 3000);
      }).catch(() => {
        activeAudioElements.delete(audio);
      });
    }
  } catch {
    // Ignore audio errors
  }
}

export function playCascadeWarning() {
  if (!soundEnabled) return;
  try {
    const audioContext = new AudioContext();
    activeAudioContexts.add(audioContext);
    
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
      activeAudioContexts.delete(audioContext);
    }, 400);
  } catch {
    // Ignore audio errors (e.g., if browser doesn't support Web Audio API)
  }
}

export function playDebrisRemoval() {
  if (!soundEnabled) return;
  try {
    const audio = new Audio('/space-slash.mp3');
    audio.volume = 0.5;
    audio.loop = false;
    activeAudioElements.add(audio);
    
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
              activeAudioElements.delete(audio);
            }
          }, fadeInterval);
        }, fadeStartTime);
        
        setTimeout(() => {
          clearTimeout(fadeTimeout);
          audio.pause();
          audio.currentTime = 0;
          activeAudioElements.delete(audio);
        }, 3000);
      }).catch(() => {
        activeAudioElements.delete(audio);
      });
    }
  } catch {
    // Ignore audio errors
  }
}
