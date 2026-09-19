const STORAGE_KEY = 'herbuddy-theme';

export const THEMES = [
    { id: 'classic', name: 'Classic', colors: ['#7B2CBF', '#FF2E93'] },
    { id: 'teal', name: 'Midnight Teal', colors: ['#013A63', '#22D3EE'] },
    { id: 'coral', name: 'Sunset Coral', colors: ['#C2410C', '#F97316'] },
    { id: 'emerald', name: 'Forest Emerald', colors: ['#065F46', '#34D399'] },
    { id: 'ocean', name: 'Ocean Blue', colors: ['#1D4ED8', '#38BDF8'] },
    { id: 'bright', name: 'Bright Mode', colors: ['#F5F0FF', '#7B2CBF'] }
];

export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'classic';
}

export function applyTheme(themeId) {
    const valid = THEMES.some(t => t.id === themeId) ? themeId : 'classic';
    document.documentElement.setAttribute('data-theme', valid);
    try {
        localStorage.setItem(STORAGE_KEY, valid);
    } catch (err) {
        // localStorage unavailable — theme just won't persist across reloads.
    }
    window.dispatchEvent(new CustomEvent('herbuddy:theme-changed', { detail: { theme: valid } }));
    return valid;
}

export function initTheme() {
    let saved = 'classic';
    try {
        saved = localStorage.getItem(STORAGE_KEY) || 'classic';
    } catch (err) {
        // ignore
    }
    applyTheme(saved);
}

export function selectTheme(themeId) {
    applyTheme(themeId);
    highlightActiveSwatch();
}

export function highlightActiveSwatch() {
    const current = getCurrentTheme();
    document.querySelectorAll('.theme-swatch').forEach((btn) => {
        btn.classList.toggle('theme-swatch-active', btn.dataset.themeSwatch === current);
    });
}
