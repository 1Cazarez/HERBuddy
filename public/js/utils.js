export function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export function showToast(title, msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-message').innerText = msg;

    toast.classList.remove('-translate-y-28', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => { hideToast(); }, 3500);
}

export function hideToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-28', 'opacity-0');
}

export function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes}`;
    const timeEl = document.getElementById('home-screen-time');
    if (timeEl) timeEl.innerText = timeStr;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const dateEl = document.getElementById('home-screen-date');
    if (dateEl) dateEl.innerText = dateStr;
}
