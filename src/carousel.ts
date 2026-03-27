import './styles.css';
import image1 from './assets/image1.jpg';
import image2 from './assets/image2.jpg';

// Sample background images - using placeholder images
const backgroundImages = [
  image1,
  image2,
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
