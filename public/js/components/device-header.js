customElements.define('hb-device-header', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="device-header" class="hidden px-6 pt-3 pb-2 justify-between items-center text-xs font-semibold text-slate-300 z-40 bg-deepIndigo/90 backdrop-blur-md border-b border-white/10">
            <button onclick="switchTab('home')" title="Go to Home" class="font-black tracking-tight text-neonPink flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer">
                <svg viewBox="0 0 64 64" class="w-5 h-5 drop-shadow" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 6C18 6 12 12 12 26C12 42 32 58 32 58C32 58 52 42 52 26C52 12 46 6 32 6Z" fill="url(#hdr-logo-grad)" stroke="#FFF" stroke-width="2"/>
                    <circle cx="32" cy="22" r="7" stroke="#FFF" stroke-width="2.5" fill="none"/>
                    <path d="M32 29V41M26 35H38" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="hdr-logo-grad" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FF2E93"/>
                            <stop offset="1" stop-color="#7B2CBF"/>
                        </linearGradient>
                    </defs>
                </svg>
                Herbuddy
            </button>
            <div class="flex items-center gap-2">
                <button onclick="openEditProfileModal()" title="Profile Preferences" class="p-1 rounded-full text-slate-300 hover:text-neonPink hover:bg-white/10 transition">
                    <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>
        `;
    }
});
