import { backendEnabled } from '../api-config.js';

const localLoginForm = `
    <form onsubmit="handleLoginSubmit(event)" class="gradient-card p-6 rounded-3xl space-y-4 w-full max-w-xs shadow-neon-purple border border-neonPink/40 text-left">
        <div>
            <label class="block text-xs font-bold text-neonPink mb-1.5 uppercase tracking-wider">Enter Your Name</label>
            <input type="text" id="login-name" required value="Alex Rivera" placeholder="e.g. Alex Rivera" class="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-neonPink">
        </div>

        <button type="submit" class="w-full gradient-brand text-white font-black text-xs py-3.5 rounded-2xl shadow-neon-pink hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-2">
            <span>PROCEED TO APP</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
    </form>
`;

const auth0LoginButton = `
    <div class="gradient-card p-6 rounded-3xl space-y-4 w-full max-w-xs shadow-neon-purple border border-neonPink/40 text-left">
        <p class="text-xs text-slate-300">Sign in with your campus account to sync your profile, chat, and walks across devices.</p>
        <button onclick="loginWithAuth0AndProceed()" class="w-full gradient-brand text-white font-black text-xs py-3.5 rounded-2xl shadow-neon-pink hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-2">
            <span>LOG IN WITH AUTH0</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
    </div>
`;

customElements.define('hb-login-screen', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="screen-login" class="min-h-full flex flex-col justify-center items-center py-6 text-center space-y-6">
            <div class="w-24 h-24 gradient-brand rounded-3xl mx-auto flex items-center justify-center shadow-neon-pink pulse-pink p-3">
                <svg viewBox="0 0 64 64" class="w-16 h-16 drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 6C18 6 12 12 12 26C12 42 32 58 32 58C32 58 52 42 52 26C52 12 46 6 32 6Z" fill="url(#login-logo-grad)" stroke="#FFF" stroke-width="2.5"/>
                    <circle cx="32" cy="22" r="7.5" stroke="#FFF" stroke-width="3" fill="none"/>
                    <path d="M32 29.5V42M25 35.5H39" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
                    <path d="M22 20C22 14.4772 26.4772 10 32 10" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="login-logo-grad" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FF2E93"/>
                            <stop offset="1" stop-color="#3A0CA3"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div class="space-y-2 max-w-xs mx-auto">
                <h1 class="text-3xl font-black text-white tracking-tight">Herbuddy</h1>
                <p class="text-xs text-slate-300">Your safe campus walking & women's community companion.</p>
            </div>

            ${backendEnabled ? auth0LoginButton : localLoginForm}
        </section>
        `;
    }
});
