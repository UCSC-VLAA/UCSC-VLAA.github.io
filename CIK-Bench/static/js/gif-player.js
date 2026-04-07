// =============================================================================
// GIF Player — autoplay loop, step indicator sync, click to lightbox
// =============================================================================
(function () {
  'use strict';

  // ── Initialize all gif-players ──
  document.querySelectorAll('.gif-player').forEach(function (player) {
    var img = player.querySelector('.gif-img');
    var gifSrc = player.dataset.gif;
    var stepItems = player.querySelectorAll('.step-item');
    var durations = (player.dataset.durations || '')
      .split(',').map(Number).filter(Boolean);

    // Autoplay: set GIF src directly
    if (img && gifSrc) {
      img.src = gifSrc;
    }
    player.classList.add('playing');

    // Start step indicator loop
    if (stepItems.length && durations.length) {
      startSteps(stepItems, durations, player);
    }

    // Click → lightbox
    player.addEventListener('click', function () {
      openLightbox(gifSrc);
    });
  });

  // ── Step indicator (loops forever) ──
  function startSteps(steps, durations, player) {
    var total = durations.reduce(function (a, b) { return a + b; }, 0);

    function runCycle() {
      activate(steps, 0, player);
      var elapsed = 0;
      for (var i = 0; i < durations.length; i++) {
        elapsed += durations[i];
        (function (idx, t) {
          setTimeout(function () { activate(steps, idx + 1, player); }, t);
        })(i, elapsed);
      }
      setTimeout(runCycle, total + 800);
    }

    runCycle();
  }

  function activate(steps, upTo, player) {
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.toggle('active', i <= upTo);
    }
    var connectors = steps[0].parentElement.querySelectorAll('.step-connector');
    for (var j = 0; j < connectors.length; j++) {
      connectors[j].classList.toggle('active', j < upTo);
    }
    if (player) {
      player.dataset.activeStep = upTo;
    }
  }

  // ── Lightbox ──
  var lightbox = null;

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'gif-lightbox';
    lightbox.innerHTML =
      '<div class="gif-lightbox-backdrop"></div>' +
      '<div class="gif-lightbox-content">' +
      '  <img src="" alt="Enlarged view">' +
      '  <button class="gif-lightbox-close" aria-label="Close">&times;</button>' +
      '</div>';
    document.body.appendChild(lightbox);

    lightbox.querySelector('.gif-lightbox-backdrop')
      .addEventListener('click', closeLightbox);
    lightbox.querySelector('.gif-lightbox-close')
      .addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  function openLightbox(src) {
    if (!src) return;
    if (!lightbox) createLightbox();
    var img = lightbox.querySelector('img');
    img.src = '';
    img.offsetHeight;
    img.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (lightbox) lightbox.querySelector('img').src = '';
    }, 300);
  }

  // ── Carousel ──
  document.querySelectorAll('.gif-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var prev = carousel.querySelector('.carousel-prev');
    var next = carousel.querySelector('.carousel-next');
    var slideWidth = 436; // 420 + 16 gap

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -slideWidth * 2, behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: slideWidth * 2, behavior: 'smooth' });
    });
  });
})();
