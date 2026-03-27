export function initWeddingDate() {
  const weddingDate = import.meta.env.VITE_WEDDING_DATE;
  
  if (!weddingDate) {
    console.error('Wedding date not configured in .env');
    return;
  }

  const date = new Date(weddingDate);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('en-US', options);
  const dateElement = document.getElementById('wedding-date');
  
  if (dateElement) {
    dateElement.textContent = formattedDate;
  }
}

export function initParentNames() {
  const groomParents = import.meta.env.VITE_GROOM_PARENTS;
  const brideParents = import.meta.env.VITE_BRIDE_PARENTS;
  
  const groomElement = document.getElementById('groom-parents');
  const brideElement = document.getElementById('bride-parents');
  
  if (groomElement && groomParents) {
    groomElement.textContent = groomParents;
  }
  
  if (brideElement && brideParents) {
    brideElement.textContent = brideParents;
  }
}

export function initBrideGroomNames() {
  const groomName = import.meta.env.VITE_GROOM_NAME;
  const brideName = import.meta.env.VITE_BRIDE_NAME;
  
  const groomElement = document.getElementById('groom-name');
  const brideElement = document.getElementById('bride-name');
  
  if (groomElement && groomName) {
    groomElement.textContent = groomName;
  }
  
  if (brideElement && brideName) {
    brideElement.textContent = brideName;
  }
}

export function getWeddingDate(): string {
  return import.meta.env.VITE_WEDDING_DATE;
}

export function getParentNames() {
  return {
    bride: import.meta.env.VITE_BRIDE_PARENTS,
    groom: import.meta.env.VITE_GROOM_PARENTS
  };
}
