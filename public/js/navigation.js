import { appState } from './state.js';

export function switchTab(tabId) {
    if (!appState.isLoggedIn) return;

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn flex flex-col items-center gap-1 text-slate-400 hover:text-neonPink transition';
    });

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.className = 'nav-btn flex flex-col items-center gap-1 text-neonPink font-extrabold transition';
    }
}
