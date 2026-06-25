// Parent Focused Interactive Script (Testimonial Carousel & FAQ Accordion)

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Testimonial Carousel (Auto rolling & dots)
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0 && dots.length > 0) {
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    }

    function nextSlide() {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    // Set auto rolling
    slideInterval = setInterval(nextSlide, 5000);

    // Manual navigation click
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(nextSlide, 5000); // restart auto rolling
      });
    });
  }

  /* ==========================================================================
     2. Collapsible FAQ Accordion Panel
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other items (optional, but clean)
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
