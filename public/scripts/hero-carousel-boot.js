(function () {
  'use strict';

  var AUTOPLAY_MS = 5500;
  var SWIPE_THRESHOLD = 48;
  var controllers = new WeakMap();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function getRadios(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.hero-promo-nav-radio'));
  }

  function getActiveIndex(radios) {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return i;
    }
    return 0;
  }

  function restartDotProgress(root, index) {
    var dots = root.querySelectorAll('.hero-promo-carousel__dot');
    var progressBars = root.querySelectorAll('.hero-promo-carousel__dot-progress');

    progressBars.forEach(function (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
  }

  function goTo(root, index, options) {
    options = options || {};
    var radios = getRadios(root);
    var total = radios.length;
    if (!total) return;

    var next = ((index % total) + total) % total;
    var controller = controllers.get(root);

    if (controller && controller.timer) {
      clearTimeout(controller.timer);
      controller.timer = null;
    }

    radios[next].checked = true;
    root.setAttribute('data-active', String(next));
    root.style.setProperty('--hero-active', String(next));

    var counter = root.querySelector('[data-hero-counter-current]');
    if (counter) counter.textContent = pad(next + 1);

    var slides = root.querySelectorAll('.hero-promo-carousel__slide');
    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i === next ? 'false' : 'true');
      slide.classList.toggle('is-active', i === next);
    });

    restartDotProgress(root, next);

    if (!options.skipAutoplay && controller) {
      controller.timer = setTimeout(function () {
        goTo(root, next + 1);
      }, AUTOPLAY_MS);
    }
  }

  function unbindCarousel(root) {
    var controller = controllers.get(root);
    if (!controller) return;

    if (controller.timer) {
      clearTimeout(controller.timer);
    }

    controller.handlers.forEach(function (handler) {
      handler.el.removeEventListener(handler.type, handler.fn);
    });

    controllers.delete(root);
    root.classList.remove('hero-promo-carousel--js');
    root.removeAttribute('tabindex');
  }

  function bindCarousel(root) {
    unbindCarousel(root);

    var radios = getRadios(root);
    var total = radios.length;
    if (!total) return;

    var prevBtn = root.querySelector('.hero-promo-carousel__nav--prev');
    var nextBtn = root.querySelector('.hero-promo-carousel__nav--next');
    var viewport = root.querySelector('.hero-promo-carousel__viewport');

    var controller = { timer: null, handlers: [] };
    var touchStartX = null;
    var touchStartY = null;

    function onPrev() {
      goTo(root, getActiveIndex(radios) - 1);
    }

    function onNext() {
      goTo(root, getActiveIndex(radios) + 1);
    }

    function onRadioChange() {
      goTo(root, getActiveIndex(radios), { skipAutoplay: false });
    }

    function onKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (touchStartX === null || touchStartY === null) return;

      var touch = e.changedTouches[0];
      var deltaX = touch.clientX - touchStartX;
      var deltaY = touch.clientY - touchStartY;

      touchStartX = null;
      touchStartY = null;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;

      if (deltaX < 0) {
        onNext();
      } else {
        onPrev();
      }
    }

    function onTouchCancel() {
      touchStartX = null;
      touchStartY = null;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', onPrev);
      controller.handlers.push({ el: prevBtn, type: 'click', fn: onPrev });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', onNext);
      controller.handlers.push({ el: nextBtn, type: 'click', fn: onNext });
    }

    radios.forEach(function (radio) {
      radio.addEventListener('change', onRadioChange);
      controller.handlers.push({ el: radio, type: 'change', fn: onRadioChange });
    });

    root.addEventListener('keydown', onKeyDown);
    controller.handlers.push({ el: root, type: 'keydown', fn: onKeyDown });

    if (viewport) {
      viewport.addEventListener('touchstart', onTouchStart, { passive: true });
      controller.handlers.push({ el: viewport, type: 'touchstart', fn: onTouchStart });

      viewport.addEventListener('touchend', onTouchEnd, { passive: true });
      controller.handlers.push({ el: viewport, type: 'touchend', fn: onTouchEnd });

      viewport.addEventListener('touchcancel', onTouchCancel, { passive: true });
      controller.handlers.push({ el: viewport, type: 'touchcancel', fn: onTouchCancel });
    }

    root.classList.add('hero-promo-carousel--js');
    root.setAttribute('tabindex', '0');
    controllers.set(root, controller);

    goTo(root, getActiveIndex(radios));
  }

  function boot() {
    document.querySelectorAll('.hero-promo-carousel').forEach(bindCarousel);
  }

  window.__aveloraHeroCarouselBoot = boot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
