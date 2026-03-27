export function initCountdown() {
  const weddingDate = import.meta.env.VITE_WEDDING_DATE;
  
  if (!weddingDate) {
    console.error('Wedding date not configured in .env');
    return;
  }

  const targetDate = new Date(weddingDate).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countdown-days')!.textContent = '0';
      document.getElementById('countdown-hours')!.textContent = '0';
      document.getElementById('countdown-minutes')!.textContent = '0';
      document.getElementById('countdown-seconds')!.textContent = '0';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown-days')!.textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours')!.textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes')!.textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds')!.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
