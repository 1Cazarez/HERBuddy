customElements.define('hb-tab-home', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-home" class="tab-content space-y-4">
            <div class="flex justify-between items-center pt-1">
                <div>
                    <div class="flex items-center gap-1.5 text-neonPink font-bold text-xs">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                        <span id="home-campus-tag">Main Quad Campus</span>
                    </div>
                    <h1 class="text-2xl font-black text-white tracking-tight">
                        Hey, <span id="home-user-name">Alex</span>! <span id="home-user-avatar-emoji">🦊</span>
                    </h1>
                </div>
                <button onclick="openEditProfileModal()" class="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
                    <div class="w-11 h-11 rounded-2xl animal-avatar-box flex items-center justify-center text-2xl shadow-neon-pink">
                        <span id="home-user-avatar-icon">🦊</span>
                    </div>
                </button>
            </div>

            <div class="gradient-brand text-white p-5 rounded-3xl shadow-neon-pink relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="flex justify-between items-start mb-3">
                    <span class="bg-black/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <i data-lucide="users" class="w-3 h-3 text-pink-200"></i> Route Match Alert
                    </span>
                    <span class="text-xs bg-black/30 px-2.5 py-0.5 rounded-full font-semibold">3:30 PM Today</span>
                </div>

                <h3 class="text-lg font-black leading-tight">Student Center &rarr; Library</h3>
                <p class="text-xs text-white/90 mt-1">3 buddies are walking your saved route right now!</p>

                <div class="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                    <div class="flex -space-x-2">
                        <div class="w-7 h-7 rounded-full bg-purple-950 border-2 border-neonPink flex items-center justify-center text-sm">👩🏼</div>
                        <div class="w-7 h-7 rounded-full bg-purple-950 border-2 border-neonPink flex items-center justify-center text-sm">👩🏻</div>
                        <div class="w-7 h-7 rounded-full bg-purple-950 border-2 border-neonPink flex items-center justify-center text-sm">👩🏾</div>
                        <div class="w-7 h-7 rounded-full bg-black/40 border-2 border-neonPink flex items-center justify-center text-[9px] font-bold">+2</div>
                    </div>
                    <button onclick="quickJoinSuggestedRoute()" class="bg-white text-darkPurple hover:bg-softPinkBg font-black text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-95 flex items-center gap-1">
                        Join Walk <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-2">
                <button onclick="switchTab('create')" class="gradient-card p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-neonPink transition">
                    <div class="w-8 h-8 rounded-xl bg-neonPink/20 text-neonPink flex items-center justify-center">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-200">Start Walk</span>
                </button>
                <button onclick="switchTab('find')" class="gradient-card p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-neonPink transition">
                    <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <i data-lucide="map" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-200">Find & Map</span>
                </button>
                <button onclick="switchTab('pickup')" class="gradient-card p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-neonPink transition">
                    <div class="w-8 h-8 rounded-xl bg-radiantPink/20 text-radiantPink flex items-center justify-center">
                        <i data-lucide="package" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-200">Pickups</span>
                </button>
                <button onclick="triggerEmergencyCheckInTest()" class="gradient-card p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-rose-500 transition">
                    <div class="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <i data-lucide="shield-alert" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-200">Safety SOS</span>
                </button>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Daily Wellness Summary</h3>
                    <button onclick="switchTab('wellness')" class="text-xs font-bold text-neonPink hover:underline">Full Stats</button>
                </div>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="bg-black/40 p-2.5 rounded-2xl border border-white/10">
                        <i data-lucide="footprints" class="w-4 h-4 text-neonPink mx-auto mb-1"></i>
                        <span class="block text-sm font-black text-white" id="home-step-count">6,420</span>
                        <span class="text-[8px] text-slate-400">Steps</span>
                    </div>
                    <div class="bg-black/40 p-2.5 rounded-2xl border border-white/10">
                        <i data-lucide="timer" class="w-4 h-4 text-electricPurple mx-auto mb-1"></i>
                        <span class="block text-sm font-black text-white" id="home-mins-count">38</span>
                        <span class="text-[8px] text-slate-400">Active Mins</span>
                    </div>
                    <div class="bg-black/40 p-2.5 rounded-2xl border border-white/10">
                        <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400 mx-auto mb-1"></i>
                        <span class="block text-sm font-black text-white">100%</span>
                        <span class="text-[8px] text-slate-400">Safety Score</span>
                    </div>
                    <div class="bg-black/40 p-2.5 rounded-2xl border border-white/10">
                        <i data-lucide="package-check" class="w-4 h-4 text-radiantPink mx-auto mb-1"></i>
                        <span class="block text-sm font-black text-white" id="home-errand-count">9</span>
                        <span class="text-[8px] text-slate-400">Errands</span>
                    </div>
                </div>
            </div>

            <div class="gradient-card p-4 rounded-3xl space-y-2">
                <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Safety Check-in Protection</h3>
                    <span class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Active Guard
                    </span>
                </div>
                <div class="flex items-center justify-between pt-1">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-pink-950 border border-neonPink/50 flex items-center justify-center text-sm">🦉</div>
                        <div>
                            <span class="text-xs font-bold text-white block" id="home-emergency-contact-display">Sarah Rivera (Mom)</span>
                            <span class="text-[9px] text-slate-400">Trusted Emergency Contact</span>
                        </div>
                    </div>
                    <button onclick="triggerEmergencyCheckInTest()" class="text-[11px] bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold px-3 py-1.5 rounded-xl hover:bg-rose-900/80 transition">
                        Test SOS
                    </button>
                </div>
                <a href="tel:4044133333" class="mt-1 w-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs py-2.5 rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2">
                    <i data-lucide="phone-call" class="w-4 h-4"></i> CALL GSU POLICE (404-413-3333)
                </a>
                <button onclick="openFakeCallModal()" class="mt-1 w-full bg-white/10 border border-white/20 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2">
                    <i data-lucide="phone-incoming" class="w-4 h-4"></i> Fake Call (Exit a situation)
                </button>
            </div>
        </section>
        `;
    }
});
