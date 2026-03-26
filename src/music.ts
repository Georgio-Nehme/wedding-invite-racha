// Music Player Logic with Environment Variables
export function initMusicPlayer() {
  // Read environment variables with fallback defaults
  const musicUrl = import.meta.env.VITE_MUSIC_URL || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const baseVolume = parseFloat(import.meta.env.VITE_MUSIC_VOLUME) || 0.3;
  const fadeStep = parseFloat(import.meta.env.VITE_MUSIC_FADE_STEP) || 0.05;
  const fadeInterval = parseInt(import.meta.env.VITE_MUSIC_FADE_INTERVAL) || 100;
  const autoplay = import.meta.env.VITE_MUSIC_AUTOPLAY === 'true';

  const audio = document.getElementById('background-music') as HTMLAudioElement;
  const toggleBtn = document.getElementById('music-toggle') as HTMLButtonElement;

  if (!audio || !toggleBtn) return;

  // Set audio source
  const source = document.createElement('source');
  source.src = musicUrl;
  source.type = 'audio/mpeg';
  audio.appendChild(source);

  // Set initial volume
  audio.volume = baseVolume;

  // Handle toggle button click
  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      // Fade in
      audio.volume = 0;
      audio.play().catch(err => {
        console.log('Playback prevented:', err);
      });
      
      let volume = 0;
      const fadeInInterval = setInterval(() => {
        volume += fadeStep;
        if (volume >= baseVolume) {
          audio.volume = baseVolume;
          clearInterval(fadeInInterval);
        } else {
          audio.volume = volume;
        }
      }, fadeInterval);

      toggleBtn.classList.add('playing');
    } else {
      // Fade out
      let volume = audio.volume;
      const fadeOutInterval = setInterval(() => {
        volume -= fadeStep;
        if (volume <= 0) {
          audio.pause();
          audio.volume = baseVolume; // Reset for next play
          clearInterval(fadeOutInterval);
        } else {
          audio.volume = volume;
        }
      }, fadeInterval);

      toggleBtn.classList.remove('playing');
    }
  });

  // Listen to play/pause events
  audio.addEventListener('play', () => {
    toggleBtn.classList.add('playing');
  });

  audio.addEventListener('pause', () => {
    toggleBtn.classList.remove('playing');
  });

  // Autoplay if enabled
  if (autoplay) {
    // Start muted to bypass browser autoplay policy
    audio.muted = true;
    audio.volume = 0;
    
    audio.play().then(() => {
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

      toggleBtn.classList.add('playing');
    }).catch(err => {
      console.log('Autoplay prevented by browser policy:', err);
      // User will need to click button to start
      audio.muted = false;
    });
  }
}
