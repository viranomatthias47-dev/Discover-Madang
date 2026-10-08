(() => {
  'use strict';

  const storageKey = 'discoverMadangSaved';

  const readSavedPlaces = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const savePlaces = (places) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(places));
    } catch {
      // Ignore storage issues in privacy-restricted browsers.
    }
  };

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-navigation');

  const closeMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    const srOnlyText = menuToggle.querySelector('.sr-only');
    if (srOnlyText) srOnlyText.textContent = 'Open menu';
    primaryNav.classList.remove('is-open');
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      const srOnlyText = menuToggle.querySelector('.sr-only');
      if (srOnlyText) srOnlyText.textContent = isOpen ? 'Open menu' : 'Close menu';
      primaryNav.classList.toggle('is-open', !isOpen);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!primaryNav.classList.contains('is-open') || primaryNav.contains(target) || menuToggle.contains(target)) return;
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

  let savedPlaces = readSavedPlaces();
  const saveButtons = document.querySelectorAll('[data-save-id]');

  const updateSaveButton = (button, isSaved) => {
    if (!button) return;
    button.classList.toggle('is-saved', isSaved);
    button.setAttribute('aria-pressed', String(isSaved));
    const icon = button.querySelector('span:first-child');
    const label = button.querySelector('span:last-child');
    if (icon) icon.textContent = isSaved ? '♥' : '♡';
    if (label) label.textContent = isSaved ? 'Saved' : 'Save';
  };

  saveButtons.forEach((button) => {
    const placeId = button.dataset.saveId;
    if (!placeId) return;
    updateSaveButton(button, savedPlaces.includes(placeId));
    button.addEventListener('click', () => {
      const savedIndex = savedPlaces.indexOf(placeId);
      if (savedIndex === -1) savedPlaces.push(placeId);
      else savedPlaces.splice(savedIndex, 1);
      savePlaces(savedPlaces);
      updateSaveButton(button, savedIndex === -1);
    });
  });

  const contactForm = document.getElementById('enquiry-form');
  if (contactForm) {
    const statusBox = document.getElementById('form-status');

    const setStatus = (message, type) => {
      if (!statusBox) return;
      statusBox.hidden = false;
      statusBox.textContent = message;
      statusBox.className = `form-status ${type}`;
    };

    const validateField = (field) => {
      if (!field) return true;
      const value = field.value.trim();

      if (field.type === 'checkbox') return field.checked;
      if (field.tagName === 'SELECT') return value !== '';
      if (field.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return value.length > 0;
    };

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach((field) => {
        const isValid = validateField(field);
        if (!isValid) valid = false;
        field.setAttribute('aria-invalid', String(!isValid));
      });

      if (!valid) {
        setStatus('Please complete all required fields before sending your enquiry.', 'error');
        return;
      }

      const emailField = contactForm.querySelector('#email');
      if (emailField && !validateField(emailField)) {
        setStatus('Please enter a valid email address.', 'error');
        return;
      }

      setStatus('Your enquiry has been sent successfully. We will be in touch soon.', 'success');
      contactForm.reset();
      requiredFields.forEach((field) => field.removeAttribute('aria-invalid'));
    });
  }

  const attractionCards = document.querySelectorAll('.attraction-card');
  const searchField = document.getElementById('search-attractions');
  const savedOnlyToggle = document.getElementById('saved-only');
  const categoryButtons = document.querySelectorAll('[data-category]');
  const resultCount = document.getElementById('result-count');
  const detailsPanel = document.getElementById('details-panel');

  if (attractionCards.length) {
    let activeCategory = 'all';

    const updateCategoryButtons = () => {
      categoryButtons.forEach((button) => {
        const isActive = button.dataset.category === activeCategory;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const applyFilters = () => {
      const query = searchField ? searchField.value.trim().toLowerCase() : '';
      const showSavedOnly = savedOnlyToggle ? savedOnlyToggle.checked : false;
      let visibleCount = 0;

      attractionCards.forEach((card) => {
        const cardId = card.dataset.saveId || '';
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const cardText = card.textContent.toLowerCase();
        const matchesSearch = !query || cardText.includes(query);
        const matchesSaved = !showSavedOnly || savedPlaces.includes(cardId);
        const isVisible = matchesCategory && matchesSearch && matchesSaved;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (resultCount) {
        resultCount.textContent = `${visibleCount} attraction${visibleCount === 1 ? '' : 's'} found`;
      }
    };

    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.category || 'all';
        updateCategoryButtons();
        applyFilters();
      });
    });

    if (searchField) {
      searchField.addEventListener('input', applyFilters);
    }

    if (savedOnlyToggle) {
      savedOnlyToggle.addEventListener('change', applyFilters);
    }

    document.querySelectorAll('.view-details').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.attraction-card');
        const title = card ? card.querySelector('h3')?.textContent : 'Attraction details';
        const text = button.dataset.details || 'No additional details available yet.';

        if (!detailsPanel) return;
        detailsPanel.hidden = false;
        detailsPanel.innerHTML = `
          <h3>${title}</h3>
          <p>${text}</p>
        `;
      });
    });

    updateCategoryButtons();
    applyFilters();
  }

  const currentYear = document.querySelector('#current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
