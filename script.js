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
/* ── SLIDER DOTS ── */
(function initSliderDots() {
  const slider = document.getElementById('projectsSlider');
  const dotsWrap = document.getElementById('sliderDots');
  if (!slider || !dotsWrap) return;
  const cards = [...slider.querySelectorAll('.project-card')];

  cards.forEach((card, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.tabIndex = -1;
    dot.addEventListener('click', () => {
      slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.children];
  function updateDots() {
    const center = slider.scrollLeft + slider.clientWidth / 2;
    let active = 0, best = Infinity;
    cards.forEach((card, i) => {
      const mid = card.offsetLeft - slider.offsetLeft + card.offsetWidth / 2;
      if (Math.abs(mid - center) < best) { best = Math.abs(mid - center); active = i; }
    });
    // at the far ends, highlight the first/last card
    if (slider.scrollLeft <= 2) active = 0;
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2) active = cards.length - 1;
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  }
  slider.addEventListener('scroll', updateDots, { passive: true });
  window.addEventListener('resize', updateDots);
  updateDots();
})();

/* ── PROJECT DETAILS MODAL ── */
(function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const panel = modal.querySelector('.pd-panel');
  const backdrop = modal.querySelector('.pd-backdrop');
  const img = document.getElementById('pdImg');
  const title = document.getElementById('pdTitle');
  const body = document.getElementById('pdBody');
  const tags = document.getElementById('pdTags');
  const actions = document.getElementById('pdActions');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  let activeCard = null;
  let closing = false;

  // Transform that makes the panel sit exactly over the card
  function cardTransform(card) {
    const c = card.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    return `translate(${c.left - p.left}px, ${c.top - p.top}px) scale(${c.width / p.width}, ${c.height / p.height})`;
  }

  function fill(card) {
    const cardImg = card.querySelector('.project-img');
    img.src = cardImg.getAttribute('src');
    img.alt = cardImg.alt;
    img.classList.toggle('is-logo', cardImg.classList.contains('project-img-placeholder'));
    title.textContent = card.querySelector('.project-title').textContent;

    body.replaceChildren(card.querySelector('template.project-details').content.cloneNode(true));
    tags.replaceChildren(...[...card.querySelectorAll('.project-tech-tags span')].map(s => s.cloneNode(true)));

    // Card buttons navigate via onclick; give the modal real links that open in a new tab
    actions.replaceChildren(...[...card.querySelectorAll('.project-btn')].map(btn => {
      const url = (btn.getAttribute('onclick') || '').match(/'([^']+)'/);
      const a = document.createElement('a');
      a.className = 'btn btn-color-1 project-btn';
      a.textContent = btn.textContent;
      a.href = url ? url[1] : '#';
      a.target = '_blank';
      a.rel = 'noopener';
      return a;
    }));
  }

  function open(card) {
    if (activeCard) return;
    activeCard = card;
    fill(card);
    modal.hidden = false;
    panel.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    modal.classList.add('is-open');

    if (!reduceMotion.matches) {
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
      panel.animate(
        [{ transform: cardTransform(card), opacity: 0.6, borderRadius: '16px' },
         { transform: 'none', opacity: 1 }],
        { duration: 480, easing: EASE }
      );
    }
    modal.querySelector('.pd-close').focus({ preventScroll: true });
  }

  function close() {
    if (!activeCard || closing) return;
    closing = true;
    const card = activeCard;
    const finish = () => {
      modal.hidden = true;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      activeCard = null;
      closing = false;
      card.focus({ preventScroll: true });
    };
    if (reduceMotion.matches) return finish();

    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: 'ease-in', fill: 'forwards' });
    const anim = panel.animate(
      [{ transform: 'none', opacity: 1 },
       { transform: cardTransform(card), opacity: 0 }],
      { duration: 340, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' }
    );
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      panel.getAnimations().forEach(a => a.cancel());
      backdrop.getAnimations().forEach(a => a.cancel());
      finish();
    };
    anim.finished.then(cleanup, cleanup);
    setTimeout(cleanup, 450); // in case the browser pauses animations (background tab)
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.project-btn')) return; // let the card's own link work
      open(card);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
