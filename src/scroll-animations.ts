// Scroll Animation Logic using Intersection Observer
export function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Trigger animation when element comes into view
        entry.target.classList.add('scroll-animate');
        // Unobserve to prevent re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-animate class
  const scrollElements = document.querySelectorAll('.scroll-animate');
  scrollElements.forEach((element) => {
    // Start with opacity 0
    element.classList.remove('scroll-animate');
    observer.observe(element);
  });
}

// Parallax effect for background on scroll
export function initParallaxEffect() {
  const bgCarousel = document.getElementById('background-carousel');
  if (!bgCarousel) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bgCarousel.style.backgroundPosition = `center ${scrollY * 0.5}px`;
  });
}

// Smooth scroll reveal animations for sections
export function initSectionAnimations() {
  const sections = document.querySelectorAll('section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
  });

  sections.forEach((section) => {
    section.style.opacity = '1'; // Already visible, no fade needed
    sectionObserver.observe(section);
  });
}
