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

  const writeSavedPlaces = (places) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(places));
    } catch {
      // Ignore storage failures in privacy-restricted environments.
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

      writeSavedPlaces(savedPlaces);
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

      if (field.type === 'checkbox') return field.checked;
      if (field.tagName === 'SELECT') return field.value.trim() !== '';
      if (field.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

      return field.value.trim().length > 0;
    };

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach((field) => {
        const isValid = validateField(field);
        field.setAttribute('aria-invalid', String(!isValid));
        if (!isValid) valid = false;
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
  const categoryButtons = document.querySelectorAll('.filter-buttons .button[data-category]');
  const resultCount = document.getElementById('result-count');
  const detailsPanel = document.getElementById('details-panel');
  const attractionMap = document.getElementById('attraction-map');
  const mapSelection = document.getElementById('map-selection');
  const mapDirections = document.getElementById('map-directions');
  const madangMap = attractionMap && window.L
    ? window.L.map(attractionMap, { scrollWheelZoom: true }).setView([-5.217, 145.79], 11)
    : null;
  const mapMarkers = new Map();

  if (madangMap) {
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
    }).addTo(madangMap);
  } else if (attractionMap && mapSelection) {
    mapSelection.textContent = 'The interactive map could not load. Use Open directions to view Madang in Google Maps.';
  }

  const updateMapLocationText = (title, latitude, longitude) => {
    if (mapSelection) {
      mapSelection.textContent = `Showing ${title} at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}. Drag the map to explore nearby.`;
    }
    if (mapDirections) {
      const destination = `${latitude},${longitude}`;
      const directionsQuery = new URLSearchParams({ api: '1', destination });
      mapDirections.href = `https://www.google.com/maps/dir/?${directionsQuery.toString()}`;
    }
  };

  const showMapLocation = (title, latitude, longitude, zoom = 15) => {
    if (!madangMap) return;

    const location = window.L.latLng(latitude, longitude);
    madangMap.flyTo(location, zoom);
    const marker = mapMarkers.get(`${latitude},${longitude}`);
    if (marker) marker.openPopup();
    updateMapLocationText(title, latitude, longitude);
  };

  if (attractionCards.length) {
    if (madangMap) {
      attractionCards.forEach((card) => {
        const title = card.dataset.mapTitle || card.querySelector('h3')?.textContent?.trim();
        const cardCoordinates = card.dataset.mapQuery;
        const locationButtons = cardCoordinates
          ? [{ title, coordinates: cardCoordinates }]
          : Array.from(card.querySelectorAll('.show-on-map[data-map-query]'), (button) => ({
              title: button.dataset.mapTitle || title,
              coordinates: button.dataset.mapQuery
            }));

        locationButtons.forEach(({ title: locationTitle, coordinates }) => {
          const parsedCoordinates = coordinates?.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
          if (!locationTitle || !parsedCoordinates) return;

          const latitude = Number(parsedCoordinates[1]);
          const longitude = Number(parsedCoordinates[2]);
          const marker = window.L.marker([latitude, longitude])
            .addTo(madangMap)
            .bindPopup(`<strong>${locationTitle}</strong><br>${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          marker.on('click', () => updateMapLocationText(locationTitle, latitude, longitude));
          mapMarkers.set(`${coordinates}`, marker);
        });
      });

      const markerBounds = window.L.featureGroup(Array.from(mapMarkers.values())).getBounds();
      if (markerBounds.isValid()) madangMap.fitBounds(markerBounds, { padding: [28, 28], maxZoom: 12 });
      window.setTimeout(() => madangMap.invalidateSize(), 0);
    }

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
        const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
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

    document.querySelectorAll('.map-location-trigger, .show-on-map').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.attraction-card');
        const title = card?.querySelector('h3')?.textContent?.trim();
        if (!title || !attractionMap) return;

        const mapTitle = button.dataset.mapTitle || card.dataset.mapTitle || title;
        const exactLocation = button.dataset.mapQuery || card.dataset.mapQuery;
        const coordinates = exactLocation?.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
        if (coordinates) {
          const latitude = Number(coordinates[1]);
          const longitude = Number(coordinates[2]);
          showMapLocation(mapTitle, latitude, longitude, mapTitle.toLowerCase().includes('planet rock') ? 11 : 15);
        } else if (mapSelection) {
          mapSelection.textContent = `Map coordinates are not available for ${mapTitle}.`;
        }

        document.getElementById('attraction-map-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    document.querySelectorAll('.view-details').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.attraction-card');
        const title = card ? card.querySelector('h3')?.textContent : 'Attraction details';
        const text = button.dataset.details || 'No extra details are available yet.';

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

  document.querySelectorAll('.accordion-header, .about-acc-header').forEach((button) => {
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      const group = button.closest('.accordion') || button.closest('.about-accordion');

      if (group) {
        group.querySelectorAll('.accordion-header, .about-acc-header').forEach((otherButton) => {
          if (otherButton === button) return;
          otherButton.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherButton.getAttribute('aria-controls');
          const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
          if (otherPanel) otherPanel.classList.remove('is-open');
        });
      }

      button.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-open', !isOpen);
    });
  });

  const currentYear = document.querySelector('#current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
