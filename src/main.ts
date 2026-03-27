import './styles.css'
import './carousel.ts'
import { initMusicPlayer } from './music.ts'
import { initRSVPForm } from './rsvp.ts'
import { initCountdown } from './countdown.ts'
import { initWeddingDate, initParentNames, initBrideGroomNames } from './config.ts'
import { sampleRSVPData, MockRSVPManager } from './mock-data.ts'
import { initScrollAnimations } from './scroll-animations.ts'

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initBrideGroomNames();
  initParentNames();
  initWeddingDate();
  initMusicPlayer();
  initCountdown();
  initScrollAnimations();
  
  // Initialize RSVP with sample data for demo
  const familyNameDisplay = document.getElementById('family-name-display') as HTMLElement;
  if (familyNameDisplay) {
    familyNameDisplay.textContent = sampleRSVPData.familyName;
  }

  // Use mock manager for demo (can be switched to real RSVPManager with actual API)
  const mockManager = new MockRSVPManager();
  initRSVPForm(sampleRSVPData.inviteId, sampleRSVPData, mockManager);
});


