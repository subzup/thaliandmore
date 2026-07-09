/*
 * Thali & More - client-side interactions.
 * Vanilla JS, no external runtime dependencies. Progressive enhancement:
 * forms still work via native POST if JS fails to load.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Page load progress bar ---------- */
  var loader = document.createElement('div');
  loader.id = 'pageLoader';
  document.body.appendChild(loader);
  requestAnimationFrame(function () { loader.style.width = '70%'; });
  window.addEventListener('load', function () {
    loader.style.width = '100%';
    setTimeout(function () { loader.style.opacity = '0'; }, 250);
  });

  /* ---------- Sticky navbar shadow ---------- */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal (lightweight AOS replacement) ---------- */
  var revealTargets = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('aos-animate'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = trigger.nextElementSibling;
      var expanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close sibling items within the same accordion for a clean single-open UX
      var accordion = trigger.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__trigger').forEach(function (other) {
          if (other !== trigger) {
            other.setAttribute('aria-expanded', 'false');
            other.nextElementSibling.style.maxHeight = null;
          }
        });
      }

      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = decimals ? (target + eased * 0.8).toFixed(decimals) : Math.floor(eased * target);
      el.textContent = Number(value).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  }

  /* ---------- Testimonial slider ---------- */
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var track = slider.querySelector('.testimonial-slider__track');
    var cards = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById('sliderDots');
    var perView = window.innerWidth >= 1024 ? 3 : 1;
    var index = 0;

    function slidesCount() { return Math.max(cards.length - perView + 1, 1); }

    function renderDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < slidesCount(); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dots__dot' + (i === index ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function (idx) { return function () { goTo(idx); }; }(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, slidesCount() - 1));
      var cardWidth = cards[0].getBoundingClientRect().width;
      var gap = 12;
      track.style.transform = 'translateX(-' + index * (cardWidth + gap) + 'px)';
      renderDots();
    }

    slider.querySelector('[data-slider-prev]').addEventListener('click', function () { goTo(index - 1 < 0 ? slidesCount() - 1 : index - 1); });
    slider.querySelector('[data-slider-next]').addEventListener('click', function () { goTo(index + 1 >= slidesCount() ? 0 : index + 1); });

    window.addEventListener('resize', function () {
      perView = window.innerWidth >= 1024 ? 3 : 1;
      goTo(0);
    });

    renderDots();

    // Gentle autoplay, pauses on hover/focus
    var autoplay = setInterval(function () { goTo(index + 1 >= slidesCount() ? 0 : index + 1); }, 6000);
    slider.addEventListener('mouseenter', function () { clearInterval(autoplay); });
  }

  /* ---------- Pricing toggle (monthly / quarterly) ---------- */
  var pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('click', function () {
      var isQuarterly = pricingToggle.getAttribute('aria-checked') !== 'true';
      pricingToggle.setAttribute('aria-checked', String(isQuarterly));
      document.querySelectorAll('[data-toggle-label]').forEach(function (label) {
        var match = (label.dataset.toggleLabel === 'quarterly') === isQuarterly;
        label.classList.toggle('is-active', match);
      });
      document.querySelectorAll('.plan-card__amount').forEach(function (amountEl) {
        var value = isQuarterly ? amountEl.dataset.quarterly : amountEl.dataset.monthly;
        amountEl.textContent = '₹' + Number(value).toLocaleString('en-IN');
      });
      document.querySelectorAll('[data-period-label]').forEach(function (periodEl) {
        periodEl.textContent = isQuarterly ? '/quarter' : '/month';
      });
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    document.addEventListener('scroll', function () {
      backToTop.hidden = window.scrollY < 500;
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Sticky mobile CTA: hide near footer / trial section ---------- */
  var stickyCta = document.getElementById('stickyCta');
  var trialSection = document.getElementById('trial');
  if (stickyCta) {
    var lastY = window.scrollY;
    document.addEventListener('scroll', function () {
      var footer = document.querySelector('.footer');
      var nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight;
      var inTrial = trialSection && (function () {
        var rect = trialSection.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
      })();
      stickyCta.classList.toggle('is-hidden', !!nearFooter || !!inTrial);
      lastY = window.scrollY;
    }, { passive: true });
  }

  /* ---------- Exit intent popup ---------- */
  var exitModal = document.getElementById('exitIntentModal');
  var EXIT_KEY = 'tam_exit_seen';
  function shouldShowExit() {
    try { return !sessionStorage.getItem(EXIT_KEY); } catch (e) { return true; }
  }
  function showExitModal() {
    if (!exitModal || !shouldShowExit()) return;
    exitModal.hidden = false;
    document.body.style.overflow = 'hidden';
    try { sessionStorage.setItem(EXIT_KEY, '1'); } catch (e) { /* ignore */ }
  }
  function closeExitModal() {
    if (!exitModal) return;
    exitModal.hidden = true;
    document.body.style.overflow = '';
  }
  if (exitModal) {
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY < 10) showExitModal();
    });
    // Mobile fallback: time-based trigger since there's no mouseleave
    if (window.innerWidth < 1024) {
      setTimeout(showExitModal, 25000);
    }
    exitModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeExitModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeExitModal();
    });
  }

  /* ---------- Lead form AJAX submission ---------- */
  function wireLeadForm(form) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = form.querySelector('.lead-form__status');
      var submitBtn = form.querySelector('button[type="submit"]');
      var endpoint = form.dataset.endpoint;
      var formData = new FormData(form);

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.originalText = submitBtn.textContent; submitBtn.textContent = 'Sending...'; }

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(formData),
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (statusEl) {
            statusEl.classList.remove('is-success', 'is-error');
            if (result.ok && result.data.success) {
              statusEl.textContent = result.data.message || 'Thank you!';
              statusEl.classList.add('is-success');
              form.reset();
              if (exitModal && !exitModal.hidden) setTimeout(closeExitModal, 1800);
            } else {
              var firstError = result.data.errors && result.data.errors[0] ? result.data.errors[0].msg : 'Something went wrong. Please try again.';
              statusEl.textContent = firstError;
              statusEl.classList.add('is-error');
            }
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = 'Network error. Please try again or WhatsApp us.';
            statusEl.classList.add('is-error');
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.originalText; }
        });
    });
  }

  ['trialForm', 'exitIntentForm', 'contactForm'].forEach(function (id) {
    wireLeadForm(document.getElementById(id));
  });

  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('newsletterStatus');
      var formData = new FormData(newsletterForm);
      fetch(newsletterForm.dataset.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(formData),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          statusEl.textContent = data.success ? (data.message || 'Subscribed!') : (data.errors && data.errors[0] ? data.errors[0].msg : 'Please try again.');
          if (data.success) newsletterForm.reset();
        })
        .catch(function () { statusEl.textContent = 'Network error. Please try again.'; });
    });
  }
})();
