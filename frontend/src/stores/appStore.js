// ============================================================
// AUTH STORE — nanostores
// Persists the current user's API key and username in localStorage.
// ============================================================

import { atom } from "nanostores";

const stored = JSON.parse(localStorage.getItem("mortgage-auth") || "null");

export const $auth = atom(stored); // { username, apiKey } | null

export function login(username, apiKey) {
    const user = { username, apiKey };
    $auth.set(user);
    localStorage.setItem("mortgage-auth", JSON.stringify(user));
}

export function logout() {
    $auth.set(null);
    localStorage.removeItem("mortgage-auth");
}

// ============================================================
// FAVOURITES STORE — nanostores
// Tracks which mortgage IDs the current user has favourited
// (kept in sync with backend, seeded on login).
// ============================================================

export const $favorites = atom(new Set());

export function setFavorites(mortgageIds) {
    $favorites.set(new Set(mortgageIds));
}

export function toggleFavoriteLocal(mortgageId, nowFavorited) {
    const current = new Set($favorites.get());
    if (nowFavorited) {
        current.add(mortgageId);
    } else {
        current.delete(mortgageId);
    }
    $favorites.set(current);
}
