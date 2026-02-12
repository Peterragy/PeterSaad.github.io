function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }
  function scrollProjects(direction) {
    const slider = document.getElementById("projectsSlider");
    if (!slider) return;
  
    // Scroll by almost one card each click
    const card = slider.querySelector(".details-container");
    const cardWidth = card ? card.getBoundingClientRect().width : 340;
  
    slider.scrollBy({
      left: direction * (cardWidth + 32), // 32 ~ gap
      behavior: "smooth"
    });
  }
  