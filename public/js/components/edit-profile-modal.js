import { THEMES } from '../theme.js';

const themeSwatches = THEMES.map(t => `
    <button type="button" onclick="selectTheme('${t.id}')" data-theme-swatch="${t.id}" title="${t.name}"
        class="theme-swatch w-9 h-9 rounded-full border border-white/20"
        style="background: linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})"></button>
`).join('');

customElements.define('hb-edit-profile-modal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="edit-profile-modal" class="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 flex items-center justify-center p-4">
            <div class="gradient-card p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-neon-purple border border-neonPink/50 max-h-[85dvh] overflow-y-auto no-scrollbar">
                <div class="flex justify-between items-center">
                    <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <i data-lucide="sliders" class="w-4 h-4 text-neonPink"></i> Profile Settings
                    </h3>
                    <button onclick="closeEditProfileModal()" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>

                <form onsubmit="saveProfileEdits(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Your Name</label>
                        <input type="text" id="edit-name" required class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Email / ID</label>
                        <input type="email" id="edit-email" required class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Campus Zone</label>
                        <input type="text" id="edit-campus" required class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Emergency Contact & Phone</label>
                        <input type="text" id="edit-contact" required class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Daily Step Goal</label>
                        <input type="number" id="edit-stepgoal" required class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>

                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Year</label>
                        <select id="edit-year" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                            <option>Freshman</option>
                            <option>Sophomore</option>
                            <option>Junior</option>
                            <option>Senior</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Major</label>
                        <input type="text" id="edit-major" placeholder="e.g. Computer Science" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Interests (comma separated)</label>
                        <input type="text" id="edit-interests" placeholder="e.g. Coffee, Tech, K-pop" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Clubs (comma separated)</label>
                        <input type="text" id="edit-clubs" placeholder="e.g. ACM-W, Honors College" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Events Interested In (comma separated)</label>
                        <input type="text" id="edit-events" placeholder="e.g. Career Fair, HackHERS" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Usually Around</label>
                        <select id="edit-zone" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                            <option>Library Area</option>
                            <option>Student Center Area</option>
                            <option>Aderhold Area</option>
                            <option>Recreation Center Area</option>
                            <option>Downtown Campus</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Walking Style</label>
                        <select id="edit-walkingstyle" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                            <option>Social</option>
                            <option>Casual</option>
                        </select>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Choose Companion Avatar</label>
                        <div class="flex gap-2 justify-center py-1">
                            <button type="button" onclick="selectEditAvatar('🦊')" class="p-2 bg-black/40 border border-white/20 rounded-xl text-xl hover:scale-110 transition">🦊</button>
                            <button type="button" onclick="selectEditAvatar('🦉')" class="p-2 bg-black/40 border border-white/20 rounded-xl text-xl hover:scale-110 transition">🦉</button>
                            <button type="button" onclick="selectEditAvatar('🐱')" class="p-2 bg-black/40 border border-white/20 rounded-xl text-xl hover:scale-110 transition">🐱</button>
                            <button type="button" onclick="selectEditAvatar('🐰')" class="p-2 bg-black/40 border border-white/20 rounded-xl text-xl hover:scale-110 transition">🐰</button>
                            <button type="button" onclick="selectEditAvatar('👩🏽')" class="p-2 bg-black/40 border border-white/20 rounded-xl text-xl hover:scale-110 transition">👩🏽</button>
                        </div>
                        <div class="text-center mt-1 text-[10px] text-slate-400">Selected: <span id="modal-avatar-preview" class="text-base">🦊</span></div>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-300 mb-1">App Theme</label>
                        <div class="flex gap-2 justify-center py-1">
                            ${themeSwatches}
                        </div>
                    </div>

                    <button type="submit" class="w-full gradient-brand text-white font-black py-3 rounded-xl shadow-neon-pink hover:opacity-95 transition mt-2">
                        SAVE PREFERENCES
                    </button>
                </form>
            </div>
        </div>
        `;
    }
});
