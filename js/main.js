(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-navigation');

  const closeMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('.sr-only').textContent = 'Open menu';
    primaryNav.classList.remove('is-open');
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.querySelector('.sr-only').textContent = isOpen ? 'Open menu' : 'Close menu';
      primaryNav.classList.toggle('is-open', !isOpen);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (!primaryNav.classList.contains('is-open') || primaryNav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) closeMenu();
    });
  }

  const savedPlaces = JSON.parse(localStorage.getItem('discoverMadangSaved') || '[]');
  const saveButtons = document.querySelectorAll('[data-save-id]');

  const updateSaveButton = (button, isSaved) => {
    button.classList.toggle('is-saved', isSaved);
    button.setAttribute('aria-pressed', String(isSaved));
    button.querySelector('span:first-child').textContent = isSaved ? '♥' : '♡';
    button.querySelector('span:last-child').textContent = isSaved ? 'Saved' : 'Save';
  };

  saveButtons.forEach((button) => {
    const placeId = button.dataset.saveId;
    updateSaveButton(button, savedPlaces.includes(placeId));
    button.addEventListener('click', () => {
      const savedIndex = savedPlaces.indexOf(placeId);
      if (savedIndex === -1) savedPlaces.push(placeId);
      else savedPlaces.splice(savedIndex, 1);
      localStorage.setItem('discoverMadangSaved', JSON.stringify(savedPlaces));
      updateSaveButton(button, savedIndex === -1);
    });
  });

  const currentYear = document.querySelector('#current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
