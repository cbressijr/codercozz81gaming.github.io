document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Sticky nav
  window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('sticky', window.scrollY > 100);
  });

});
