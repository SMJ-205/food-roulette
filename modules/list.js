/**
 * list.js — Restaurant list rendering
 */

/**
 * Build a ★ display from a numeric rating.
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
 * Render all restaurant cards into #restaurant-list.
 * @param {Array} restaurants
 */
export function render(restaurants) {
  const container = document.getElementById('restaurant-list');
  if (!container) return;

  if (!restaurants || restaurants.length === 0) {
    container.innerHTML = `
      <div class="list-empty">
        <p>No restaurants in the list yet. Add some!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = restaurants.map(r => `
    <article class="resto-card" data-id="${r.id}">
      <div class="card-header">
        <h3 class="card-name">${r.name}</h3>
        <div class="card-rating">
          <span class="stars">${buildStars(r.rating)}</span>
          <span class="rating-num">${r.rating.toFixed(1)}</span>
        </div>
      </div>
      <p class="card-address"><span class="icon">📍</span> ${r.address}</p>
      <div class="card-tags">
        ${r.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}
