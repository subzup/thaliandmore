/*
 * Corporate meal ordering: cafeteria -> cart -> details -> booking.
 * Single page, JS-driven steps (no reloads) for a fast, app-like flow.
 */
(function () {
  'use strict';

  var app = document.getElementById('orderApp');
  if (!app) return;

  var csrfToken = app.dataset.csrfToken;
  var cart = {}; // key: `${itemId}_${variantLabel}` -> { itemId, variantLabel, name, price, quantity }
  var selectedCafeteria = null; // { id, name }
  var idempotencyKey = makeIdempotencyKey();

  function makeIdempotencyKey() {
    return (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  }

  function formatRupees(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  /* ---------- Step navigation ---------- */
  var summaryEl = document.getElementById('orderSummary');

  // The sticky summary bar's height grows with the number of cart lines (up
  // to its own max-height/scroll cap), so the page's reserved bottom padding
  // has to track it, otherwise the bar ends up covering the Continue/Back
  // buttons once the cart has more than a couple of items.
  function syncSummaryPadding() {
    var h = summaryEl.hidden ? 0 : summaryEl.offsetHeight;
    document.documentElement.style.setProperty('--order-summary-h', h + 'px');
  }
  window.addEventListener('resize', syncSummaryPadding);

  function goToStep(step) {
    document.querySelectorAll('.order-panel[data-panel]').forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== String(step);
    });
    document.querySelectorAll('.order-step[data-step-indicator]').forEach(function (el) {
      var n = Number(el.dataset.stepIndicator);
      el.classList.toggle('is-active', n === step);
      el.classList.toggle('is-done', typeof step === 'number' && n < step);
    });
    summaryEl.hidden = !(step === 2 || step === 3);
    syncSummaryPadding();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Step 1: cafeteria selection ---------- */
  document.querySelectorAll('.cafeteria-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.cafeteria-card').forEach(function (c) { c.classList.remove('is-selected'); });
      card.classList.add('is-selected');
      selectedCafeteria = { id: card.dataset.cafeteriaId, name: card.dataset.cafeteriaName };
      document.getElementById('toStep2').disabled = false;
    });
  });
  document.getElementById('toStep2').addEventListener('click', function () { goToStep(2); });

  /* ---------- Step 2: cart quantity selectors ---------- */
  function renderSummary() {
    var itemsEl = document.getElementById('summaryItems');
    var totalEl = document.getElementById('summaryTotal');
    var keys = Object.keys(cart).filter(function (k) { return cart[k].quantity > 0; });

    itemsEl.innerHTML = keys.map(function (k) {
      var it = cart[k];
      return '<div class="order-summary__item"><span>' + it.name + ' x' + it.quantity + '</span><span>' + formatRupees(it.price * it.quantity) + '</span></div>';
    }).join('');

    var total = keys.reduce(function (sum, k) { return sum + cart[k].price * cart[k].quantity; }, 0);
    totalEl.textContent = formatRupees(total);

    var hasItems = keys.length > 0;
    var toStep3 = document.getElementById('toStep3');
    if (toStep3) toStep3.disabled = !hasItems;
    syncSummaryPadding();
    return total;
  }

  document.querySelectorAll('.food-card__variant').forEach(function (row) {
    var key = row.dataset.itemId + '_' + row.dataset.variantLabel;
    var qtyEl = row.querySelector('.qty-value');
    var decBtn = row.querySelector('[data-action="dec"]');
    var incBtn = row.querySelector('[data-action="inc"]');

    function setQuantity(qty) {
      qty = Math.max(0, Math.min(20, qty));
      qtyEl.textContent = qty;
      cart[key] = {
        itemId: row.dataset.itemId,
        variantLabel: row.dataset.variantLabel,
        name: row.dataset.name + (row.dataset.variantLabel !== 'Regular' ? ' (' + row.dataset.variantLabel + ')' : ''),
        price: Number(row.dataset.price),
        quantity: qty,
      };
      decBtn.disabled = qty === 0;
      renderSummary();
    }

    decBtn.addEventListener('click', function () { setQuantity((cart[key] ? cart[key].quantity : 0) - 1); });
    incBtn.addEventListener('click', function () { setQuantity((cart[key] ? cart[key].quantity : 0) + 1); });
    decBtn.disabled = true;
  });

  document.getElementById('backToStep1').addEventListener('click', function () { goToStep(1); });
  document.getElementById('toStep3').addEventListener('click', function () { goToStep(3); });
  document.getElementById('backToStep2').addEventListener('click', function () { goToStep(2); });

  /* ---------- Step 3: submit booking ---------- */
  var orderForm = document.getElementById('orderForm');
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var statusEl = document.getElementById('orderFormStatus');
    var submitBtn = document.getElementById('submitOrderBtn');
    var formData = new FormData(orderForm);

    var items = Object.keys(cart)
      .map(function (k) { return cart[k]; })
      .filter(function (it) { return it.quantity > 0; })
      .map(function (it) { return { menuItemId: it.itemId, variantLabel: it.variantLabel, quantity: it.quantity }; });

    var payload = {
      cafeteriaId: selectedCafeteria ? selectedCafeteria.id : null,
      items: items,
      name: formData.get('name'),
      phone: formData.get('phone'),
      requiredTime: formData.get('requiredTime'),
      specialInstructions: formData.get('specialInstructions'),
      idempotencyKey: idempotencyKey,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusEl.classList.remove('is-error');
    statusEl.textContent = '';

    fetch('/api/corporate-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'x-csrf-token': csrfToken },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok && result.data.success) {
          document.getElementById('bookingCodeDisplay').textContent = result.data.bookingCode;
          document.getElementById('orderSummary').hidden = true;
          goToStep('success');
        } else {
          var msg = (result.data.errors && result.data.errors[0] && result.data.errors[0].msg) || 'Something went wrong. Please try again.';
          statusEl.textContent = msg;
          statusEl.classList.add('is-error');
        }
      })
      .catch(function () {
        statusEl.textContent = 'Network error. Please try again.';
        statusEl.classList.add('is-error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Booking';
      });
  });

  /* ---------- Book another meal: reset everything ---------- */
  document.getElementById('bookAnotherBtn').addEventListener('click', function () {
    cart = {};
    selectedCafeteria = null;
    idempotencyKey = makeIdempotencyKey();
    document.querySelectorAll('.cafeteria-card').forEach(function (c) { c.classList.remove('is-selected'); });
    document.querySelectorAll('.qty-value').forEach(function (el) { el.textContent = '0'; });
    document.querySelectorAll('.qty-btn[data-action="dec"]').forEach(function (btn) { btn.disabled = true; });
    document.getElementById('toStep2').disabled = true;
    document.getElementById('toStep3').disabled = true;
    orderForm.reset();
    renderSummary();
    goToStep(1);
  });
})();
