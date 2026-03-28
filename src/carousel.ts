import './styles.css';
import image1 from './assets/image1.jpg';
import image2 from './assets/image2.jpg';

// Sample background images - using placeholder images
const backgroundImages = [
  image1,
  image2,
];

let currentImageIndex = 0;

function preloadImages(): Promise<void[]> {
  return Promise.all(
    backgroundImages.map(src => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });
    })
  );
}

function initBackgroundCarousel() {
  const carousel = document.getElementById('background-carousel');
  if (!carousel) return;

  const updateBackground = () => {
    carousel.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
  };

  // Preload all images first
  preloadImages()
    .then(() => {
      // Set initial background after images are loaded
      updateBackground();
      
      // Change background every 10 seconds
      setInterval(updateBackground, 10000);
    })
    .catch(error => {
      console.error('Error preloading images:', error);
      // Still set the first image even if some fail to load
      updateBackground();
      setInterval(updateBackground, 10000);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initBackgroundCarousel);
