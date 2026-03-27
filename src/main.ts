import './styles.css'
import './carousel.ts'
import { initMusicPlayer } from './music.ts'
import { initializeRsvpForm } from './rsvp.ts'
import { initCountdown } from './countdown.ts'
import { initWeddingDate, initParentNames, initBrideGroomNames } from './config.ts'
import { initScrollAnimations } from './scroll-animations.ts'

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initBrideGroomNames();
  initParentNames();
  initWeddingDate();
  initMusicPlayer();
  initCountdown();
  initScrollAnimations();
  
  // Initialize RSVP form with invite ID from URL
  initializeRsvpForm();
});


