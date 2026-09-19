customElements.define('hb-tab-find', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-find" class="tab-content space-y-4">
            <div class="pt-1 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-black text-white">Find & Campus Map</h1>
                    <p class="text-xs text-slate-400">Explore lighting paths, active buddy radar & walk routes</p>
                </div>
                <span class="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald"></span> Secure Zone
                </span>
            </div>

            <!-- Interactive Campus Map embedded in Find Routes -->
            <div class="gradient-card p-3 rounded-3xl relative overflow-hidden h-[240px] flex flex-col justify-between border border-neonPink/30 shadow-neon-purple">
                <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#7B2CBF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                <div class="flex justify-between items-center z-10 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 text-xs">
                    <span class="font-bold text-neonPink flex items-center gap-1">
                        <i data-lucide="navigation-2" class="w-3.5 h-3.5"></i> Live Campus Radar & Lit Walkways
                    </span>
                    <span class="text-emerald-400 font-mono text-[10px]">3 Active Groups</span>
                </div>

                <div id="find-map-canvas" class="relative flex-1 my-2 rounded-2xl overflow-hidden border border-white/10">
                    <div id="google-map" style="width:100%; height:100%;"></div>
                </div>

                <div class="flex gap-2 z-10">
                    <button onclick="simulateFindMapMove()" class="flex-1 gradient-brand text-white font-black text-[11px] py-1.5 rounded-xl shadow-neon-pink hover:opacity-95 transition flex items-center justify-center gap-1">
                        <i data-lucide="play" class="w-3.5 h-3.5"></i> Simulate Walk on Radar
                    </button>
                    <button onclick="triggerEmergencyCheckInTest()" class="bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold px-3 py-1.5 rounded-xl text-[11px] hover:bg-rose-900/80 transition">
                        SOS Guard
                    </button>
                </div>
            </div>

            <div class="relative">
                <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400"></i>
                <input type="text" id="find-search-input" onkeyup="renderWalkList()" placeholder="Search routes (e.g., Library, Quad)..." class="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-neonPink">
            </div>

            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                <button onclick="setFilter('all', event)" class="filter-btn active gradient-brand text-white px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap">All Walks</button>
                <button onclick="setFilter('popular', event)" class="filter-btn bg-black/40 text-slate-300 border border-white/10 px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap">🔥 Group Walks</button>
                <button onclick="setFilter('night', event)" class="filter-btn bg-black/40 text-slate-300 border border-white/10 px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap">🌙 Safe Night Route</button>
            </div>

            <div id="walks-container" class="space-y-3">
                <!-- Dynamic walk cards inserted via JS -->
            </div>

            <button onclick="openReportModal()" class="w-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-xs py-2.5 rounded-2xl hover:bg-amber-900/60 transition flex items-center justify-center gap-2">
                <i data-lucide="flag" class="w-4 h-4"></i> Report an Unsafe Area
            </button>

            <div id="safety-reports-container" class="space-y-2"></div>
        </section>
        `;
    }
});
