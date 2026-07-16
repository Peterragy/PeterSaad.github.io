/* ── NAV SCROLL EFFECT ── */
const desktopNav = document.getElementById('desktop-nav');
window.addEventListener('scroll', () => {
  desktopNav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── HAMBURGER ── */
function toggleMenu() {
  const icon = document.getElementById('hamburgerIcon');
  const links = document.getElementById('menuLinks');
  icon.classList.toggle('open');
  links.classList.toggle('open');
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── PROJECT SLIDER ── */
function scrollProjects(direction) {
  const slider = document.getElementById('projectsSlider');
  if (!slider) return;
  const card = slider.querySelector('.color-container');
  const cardWidth = card ? card.getBoundingClientRect().width + 20 : 310;
  slider.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}