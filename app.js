/**
 * app.js — Entry point: initialise storage, render list, wire up spin button.
 */

import { init, getAll } from './modules/storage.js';
import { spin } from './modules/roulette.js';
import { render } from './modules/list.js';

async function bootstrap() {
  // 1. Seed localStorage from resto.json on first visit
  await init();

  // 2. Render restaurant list and update count badge
  const restaurants = getAll();
  render(restaurants);
  const countEl = document.getElementById('resto-count');
  if (countEl) countEl.textContent = `${restaurants.length} places`;

  // 3. Wire Spin button
  const spinBtn = document.getElementById('spin-btn');
  spinBtn?.addEventListener('click', () => {
    const all = getAll();
    spin(all);

    // Smooth scroll to result on mobile
    document.getElementById('roulette-result')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  });
}

bootstrap();
