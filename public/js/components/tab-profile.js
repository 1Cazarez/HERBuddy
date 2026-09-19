customElements.define('hb-tab-profile', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-profile" class="tab-content space-y-4">
            <div class="pt-1 flex justify-between items-center">
                <h1 class="text-2xl font-black text-white">Wellness & Profile</h1>
                <button onclick="openEditProfileModal()" class="text-xs bg-neonPink/20 text-neonPink border border-neonPink/40 font-bold px-3 py-1 rounded-xl flex items-center gap-1 hover:bg-neonPink/30 transition">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit Profile
                </button>
            </div>

            <div class="gradient-card p-4 rounded-3xl flex items-center gap-3.5 shadow-sm">
                <div class="w-14 h-14 rounded-2xl animal-avatar-box flex items-center justify-center text-3xl shadow-neon-pink">
                    <span id="profile-card-emoji">🦊</span>
                </div>
                <div class="flex-1">
                    <h3 class="text-base font-extrabold text-white" id="profile-card-name">Alex Rivera</h3>
                    <p class="text-xs text-slate-400" id="profile-card-role">Email: alex.r@univ.edu &bull; Main Quad</p>
                    <div class="flex items-center gap-2 mt-1 text-[11px] font-bold text-neonPink">
                        <i data-lucide="award" class="w-3.5 h-3.5"></i> <span id="profile-card-pref">Group Walk Preference &bull; Night Mode</span>
                    </div>
                </div>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-3 shadow-sm">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Wellness Dashboard</h3>
                    <span class="text-xs font-bold text-emerald-400" id="profile-weekly-pct">64% Goal Met</span>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-bold">
                        <span class="text-slate-200">Daily Step Goal</span>
                        <span class="text-neonPink" id="profile-step-val">6,420 / 10,000</span>
                    </div>
                    <div class="w-full bg-black/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div id="step-progress-bar" class="gradient-brand h-full rounded-full transition-all duration-500" style="width: 64%"></div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5 pt-1 text-center">
                    <div class="p-3 bg-black/40 rounded-2xl border border-white/10">
                        <span class="block text-[10px] text-slate-400 uppercase font-bold">Weekly Distance</span>
                        <span class="text-base font-black text-white" id="weekly-dist">14.8 mi</span>
                    </div>
                    <div class="p-3 bg-black/40 rounded-2xl border border-white/10">
                        <span class="block text-[10px] text-slate-400 uppercase font-bold">Errands Completed</span>
                        <span class="text-base font-black text-white" id="completed-errands-count">9</span>
                    </div>
                </div>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-3 shadow-sm">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Trusted Safety Contacts</h3>
                    <button onclick="triggerEmergencyCheckInTest()" class="text-xs text-rose-300 hover:text-rose-200 font-bold">Test SOS</button>
                </div>

                <div class="space-y-2 text-xs">
                    <div class="flex justify-between items-center p-2.5 bg-black/40 rounded-xl border border-white/5">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-purple-900 border border-neonPink/40 flex items-center justify-center text-xs">🦉</div>
                            <span class="font-bold text-white" id="profile-emergency-name">Sarah Rivera (Mom)</span>
                        </div>
                        <span class="text-[10px] text-slate-400">Primary Contact</span>
                    </div>
                    <div class="flex justify-between items-center p-2.5 bg-black/40 rounded-xl border border-white/5">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-purple-900 border border-neonPink/40 flex items-center justify-center text-xs">🐻</div>
                            <span class="font-bold text-white">Campus Escort Security</span>
                        </div>
                        <span class="text-[10px] text-slate-400">24/7 Security</span>
                    </div>
                </div>
            </div>

            <button onclick="logoutToLoginScreen()" class="w-full bg-white/10 border border-white/20 text-white font-bold text-xs py-3 rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2">
                <i data-lucide="log-out" class="w-4 h-4"></i> Log Out
            </button>
        </section>
        `;
    }
});
