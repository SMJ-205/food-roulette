/**
 * storage.js — localStorage helpers + seed from resto.json
 */

const STORAGE_KEY = 'foodRoulette_restaurants';

/**
 * Load seed data from resto.json if localStorage is empty.
 */
export async function init() {
  if (localStorage.getItem(STORAGE_KEY)) return; // already seeded

  try {
    const response = await fetch('./resto.json');
    if (!response.ok) throw new Error('Failed to fetch resto.json');
    const data = await response.json();
    // Assign a unique id to each restaurant
    const withIds = data.map((r, i) => ({ id: Date.now() + i, ...r }));
    save(withIds);
  } catch (err) {
    console.error('[storage] Seed error:', err);
    save([]); // start empty so the app still works
  }
}

/**
 * Return all restaurants from localStorage.
 * @returns {Array}
 */
export function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

/**
 * Overwrite existing restaurant list.
 * @param {Array} list
 */
export function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Clear all data (used in tests / dev).
 */
export function clear() {
  localStorage.removeItem(STORAGE_KEY);
}
