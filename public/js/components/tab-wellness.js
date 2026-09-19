customElements.define('hb-tab-wellness', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-wellness" class="tab-content space-y-4">
            <div class="pt-1 flex justify-between items-center">
                <div>
                    <div class="flex items-center gap-1.5 text-neonPink font-bold text-xs">
                        <i data-lucide="heart-pulse" class="w-4 h-4"></i>
                        <span>Student Health & Activity Hub</span>
                    </div>
                    <h1 class="text-2xl font-black text-white">Wellness Dashboard</h1>
                </div>
                <button onclick="openEditProfileModal()" class="text-xs bg-neonPink/20 text-neonPink border border-neonPink/40 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-neonPink/30 transition">
                    <i data-lucide="sliders" class="w-3.5 h-3.5"></i> Goals
                </button>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-3 shadow-sm border border-neonPink/40">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Daily Step & Activity Goal</h3>
                    <span class="text-xs font-bold text-emerald-400" id="wellness-weekly-pct">64% Goal Met</span>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-bold">
                        <span class="text-slate-200">Daily Steps Progress</span>
                        <span class="text-neonPink" id="wellness-step-val">6,420 / 10,000</span>
                    </div>
                    <div class="w-full bg-black/50 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div id="wellness-step-progress-bar" class="gradient-brand h-full rounded-full transition-all duration-500" style="width: 64%"></div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div class="p-3 bg-black/40 rounded-2xl border border-white/10">
                        <i data-lucide="footprints" class="w-4 h-4 text-neonPink mx-auto mb-1"></i>
                        <span class="block text-[9px] text-slate-400 uppercase font-bold">Steps</span>
                        <span class="text-sm font-black text-white" id="wellness-steps-count">6,420</span>
                    </div>
                    <div class="p-3 bg-black/40 rounded-2xl border border-white/10">
                        <i data-lucide="timer" class="w-4 h-4 text-electricPurple mx-auto mb-1"></i>
                        <span class="block text-[9px] text-slate-400 uppercase font-bold">Active Mins</span>
                        <span class="text-sm font-black text-white" id="wellness-mins-count">38</span>
                    </div>
                    <div class="p-3 bg-black/40 rounded-2xl border border-white/10">
                        <i data-lucide="package-check" class="w-4 h-4 text-radiantPink mx-auto mb-1"></i>
                        <span class="block text-[9px] text-slate-400 uppercase font-bold">Errands</span>
                        <span class="text-sm font-black text-white" id="wellness-errands-count">9</span>
                    </div>
                </div>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-3 shadow-sm">
                <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Campus Mental & Physical Support</h3>
                <div class="space-y-2.5 text-xs">
                    <div class="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-purple-950 border border-neonPink/40 flex items-center justify-center text-base">🧘🏽‍♀️</div>
                            <div>
                                <span class="font-bold text-white block">Guided Campus Meditation Walk</span>
                                <span class="text-[10px] text-slate-400">Quiet evening trail near North Quad</span>
                            </div>
                        </div>
                        <button onclick="showToast('Meditation Walk', 'Audio guide loaded for your next walk.')" class="bg-white/10 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-white/20 transition">Start</button>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-pink-950 border border-neonPink/40 flex items-center justify-center text-base">🌿</div>
                            <div>
                                <span class="font-bold text-white block">Student Peer Support Circle</span>
                                <span class="text-[10px] text-slate-400">Weekly drop-in at Student Center</span>
                            </div>
                        </div>
                        <button onclick="showToast('Peer Circle', 'Joined upcoming session reminder.')" class="bg-white/10 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-white/20 transition">RSVP</button>
                    </div>
                </div>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-3 shadow-sm">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Emergency Safety Contact</h3>
                    <button onclick="triggerEmergencyCheckInTest()" class="text-xs text-rose-300 hover:text-rose-200 font-bold">Test SOS</button>
                </div>

                <div class="flex justify-between items-center p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-purple-900 border border-neonPink/40 flex items-center justify-center text-xs">🦉</div>
                        <span class="font-bold text-white" id="wellness-emergency-name">Sarah Rivera (Mom)</span>
                    </div>
                    <span class="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Active Guard</span>
                </div>
            </div>
        </section>
        `;
    }
});
