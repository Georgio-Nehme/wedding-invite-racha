import './styles.css';

// Sample background images - using placeholder images
const backgroundImages = [
  'C:\Users\Georgio\Desktop\wedd\copilot test\wedding invite\src\assets\image1.jpg',
  'C:\Users\Georgio\Desktop\wedd\copilot test\wedding invite\src\assets\image2.jpg',
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
