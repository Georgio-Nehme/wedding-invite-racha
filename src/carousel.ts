import './styles.css';

// Sample background images - using placeholder images
const backgroundImages = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1528742891619-e21cf4c17138?w=1200&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1200&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=1200&fit=crop',
];

let currentImageIndex = 0;

function initBackgroundCarousel() {
  const carousel = document.getElementById('background-carousel');
  if (!carousel) return;

  const updateBackground = () => {
    carousel.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
  };

  // Set initial background
  updateBackground();

  // Change background every 10 seconds
  setInterval(updateBackground, 10000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initBackgroundCarousel);
