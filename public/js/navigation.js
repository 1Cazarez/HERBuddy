import { appState } from './state.js';

export function switchTab(tabId) {
    if (!appState.isLoggedIn) return;

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-neonPink', 'font-extrabold');
        btn.classList.add('text-slate-400');
    });

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('text-neonPink', 'font-extrabold');
    }
}
