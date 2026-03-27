import musicFile from './assets/zad.mp3?url';

// Music Player Logic with Environment Variables
export function initMusicPlayer() {
  // Read environment variables with fallback defaults
  const musicUrl = musicFile || '/wedding-invite-racha/assets/zad.mp3';
  const baseVolume = parseFloat(import.meta.env.VITE_MUSIC_VOLUME) || 0.3;
  const fadeStep = parseFloat(import.meta.env.VITE_MUSIC_FADE_STEP) || 0.05;
  const fadeInterval = parseInt(import.meta.env.VITE_MUSIC_FADE_INTERVAL) || 100;

  const audio = document.getElementById('background-music') as HTMLAudioElement;

  if (!audio) return;

  // Set audio source
  const source = document.createElement('source');
  source.src = musicUrl;
  source.type = 'audio/mpeg';
  audio.appendChild(source);

  console.log('Music URL:', musicUrl);

  // Set initial volume
  audio.volume = baseVolume;
  
  // iOS and mobile devices are very strict about autoplay
  // Always require user interaction
  const playAudio = () => {
    audio.muted = true;
    audio.volume = 0;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Music started playing');
        // Fade in
        let volume = 0;
        const fadeInInterval = setInterval(() => {
          volume += fadeStep;
          if (volume >= baseVolume) {
            audio.volume = baseVolume;
            audio.muted = false;
            clearInterval(fadeInInterval);
          } else {
            audio.volume = volume;
          }
        }, fadeInterval);
      }).catch(e => {
        console.error('Failed to play music:', e);
      });
    }
  };
  
  // Listen for first user interaction
  const events = ['click', 'touchstart', 'touchend'];
  const startAudio = () => {
    playAudio();
    // Remove listeners after first interaction
    events.forEach(event => {
      document.removeEventListener(event, startAudio);
    });
  };
  
  events.forEach(event => {
    document.addEventListener(event, startAudio);
  });
  
  // Also try to autoplay on page load (works on some browsers)
  const autoPlayPromise = audio.play();
  if (autoPlayPromise !== undefined) {
    autoPlayPromise.catch(() => {
      console.log('Autoplay blocked, waiting for user interaction');
    });
  }
}


