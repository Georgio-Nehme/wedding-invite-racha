import './styles.css'
import './carousel.ts'
import { initMusicPlayer } from './music.ts'
import { initializeRsvpForm } from './rsvp.ts'
import { initCountdown } from './countdown.ts'
import { initWeddingDate, initParentNames, initBrideGroomNames, initWishMoneyAccount, initContactInfo } from './config.ts'
import { initScrollAnimations } from './scroll-animations.ts'

// Hide loading screen with animation and show app content
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
  
  if (app) {
    app.classList.add('loaded');
  }
}

// Initialize all components
async function initializeApp() {
  try {
    // Initialize all components
    initBrideGroomNames();
    initParentNames();
    initWeddingDate();
    initWishMoneyAccount();
    initContactInfo();
    initMusicPlayer();
    initCountdown();
    initScrollAnimations();
    
    // Initialize RSVP form with invite ID from URL
    initializeRsvpForm();
    
    // Wait for images and fonts to load
    await Promise.all([
      document.fonts.ready,
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', resolve);
        }
      })
    ]);
    
    // Add a small delay to ensure everything is ready
    setTimeout(() => {
      hideLoadingScreen();
    }, 1200);
    
  } catch (error) {
    console.error('Error initializing app:', error);
    // Hide loading screen even if there's an error
    setTimeout(() => {
      hideLoadingScreen();
    }, 2000);
  }
}

// Initialize on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

