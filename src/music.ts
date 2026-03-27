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

  // Auto-start music with fade in - requires user interaction
  audio.muted = true;
  audio.volume = 0;
  
  // Try to play on page load
  audio.play().then(() => {
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
  }).catch(err => {
    console.error('Autoplay prevented by browser policy or file error:', err);
    
    // If autoplay fails, play on first user interaction
    const playAudio = () => {
      audio.muted = true;
      audio.volume = 0;
      audio.play().then(() => {
        console.log('Music started after user interaction');
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
      }).catch(e => console.error('Failed to play music:', e));
      
      // Remove listeners after first interaction
      document.removeEventListener('click', playAudio);
      document.removeEventListener('touchstart', playAudio);
    };
    
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);
  });
}


