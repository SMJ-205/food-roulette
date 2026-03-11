/**
 * roulette.js — Spin logic + slot-machine animation
 */

const SPIN_DURATION_MS = 2200; // total animation time
const SLOT_TICK_MS = 80;       // how fast names flash during spin

let isSpinning = false;

/**
 * Pick a random item from an array.
 * @param {Array} arr
 * @returns {*}
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Star string from numeric rating.
 * @param {number} rating
 * @returns {string}
 */
function buildStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/**
 * Render the result card inside #roulette-result.
 * @param {Object} restaurant
 */
function showResult(restaurant) {
  const el = document.getElementById('roulette-result');
  el.innerHTML = `
    <div class="result-card animate-in">
      <div class="result-tag">🎯 Today's pick</div>
      <h2 class="result-name">${restaurant.name}</h2>
      <div class="result-rating">
        <span class="stars">${buildStars(restaurant.rating)}</span>
        <span class="rating-num">${restaurant.rating.toFixed(1)}</span>
      </div>
      <div class="result-address">
        <span class="icon">📍</span> ${restaurant.address}
      </div>
      <div class="result-tags">
        ${restaurant.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
      </div>
    </div>
  `;
}

/**
 * Show empty-state message in result area.
 */
function showEmpty() {
  const el = document.getElementById('roulette-result');
  el.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🍽️</div>
      <p class="empty-title">No restaurants available</p>
      <p class="empty-subtitle">Add some restaurants to get started!</p>
    </div>
  `;
}

/**
 * Run the slot-machine flicker effect, cycling through names.
 * @param {Array} restaurants
 * @param {Function} onDone  called with final pick
 */
function runSlotAnimation(restaurants, onDone) {
  const el = document.getElementById('roulette-result');
  let ticks = Math.floor(SPIN_DURATION_MS / SLOT_TICK_MS);
  let i = 0;

  el.innerHTML = `<div class="slot-machine"><span class="slot-text"></span></div>`;
  const slotText = el.querySelector('.slot-text');

  const interval = setInterval(() => {
    const current = restaurants[i % restaurants.length];
    slotText.textContent = current.name;
    slotText.classList.toggle('slot-flash', i % 2 === 0);
    i++;
    ticks--;

    if (ticks <= 0) {
      clearInterval(interval);
      const winner = pickRandom(restaurants);
      onDone(winner);
    }
  }, SLOT_TICK_MS);
}

/**
 * Main spin function. Call with the list of eligible restaurants.
 * @param {Array} restaurants
 * @param {Function} [onResult]  optional callback with chosen restaurant
 */
export function spin(restaurants, onResult) {
  if (isSpinning) return;

  if (!restaurants || restaurants.length === 0) {
    showEmpty();
    return;
  }

  isSpinning = true;
  const btn = document.getElementById('spin-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('spinning');
  }

  runSlotAnimation(restaurants, (winner) => {
    showResult(winner);
    isSpinning = false;
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('spinning');
    }
    if (onResult) onResult(winner);
  });
}
