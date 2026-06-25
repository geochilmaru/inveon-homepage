// Apple Style Minimal JS (Intersection Observer Text Highlights)

document.addEventListener('DOMContentLoaded', () => {
  const revealTexts = document.querySelectorAll('.reveal-text');

  if (revealTexts.length > 0) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-20% 0px -20% 0px', // Trigger trigger when elements reach 20% from top and bottom
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('highlight');
        } else {
          entry.target.classList.remove('highlight');
        }
      });
    }, observerOptions);

    revealTexts.forEach(el => observer.observe(el));
  }
});
