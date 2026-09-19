customElements.define('hb-tab-pickup', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-pickup" class="tab-content space-y-4">
            <div class="pt-1 flex justify-between items-center">
                <div>
                    <div class="flex items-center gap-1.5 text-neonPink font-bold text-xs">
                        <i data-lucide="package" class="w-4 h-4"></i>
                        <span>Community Errand Network</span>
                    </div>
                    <h1 class="text-2xl font-black text-white">Smart Pickups</h1>
                </div>
                <button onclick="openNewErrandModal()" class="bg-neonPink/20 text-neonPink text-xs font-black px-3 py-1.5 rounded-xl border border-neonPink/40 hover:bg-neonPink/30 transition">
                    + Request Errand
                </button>
            </div>

            <div class="gradient-card p-4 rounded-3xl shadow-lg border border-neonPink/40">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] uppercase font-extrabold text-neonPink tracking-wider">Active Community Errand</span>
                    <span class="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/10 text-white" id="errand-tracker-status">In Transit</span>
                </div>
                <h3 class="text-xs font-bold text-white" id="active-errand-title">Library Printouts Dropoff</h3>
                <p class="text-[11px] text-slate-300 mb-3 flex items-center gap-1">
                    Carrier: <span id="active-errand-carrier-emoji">🦊</span> <span id="active-errand-carrier">Alex</span> (Student Center &rarr; Library)
                </p>

                <div class="grid grid-cols-4 gap-1 text-center text-[9px] font-bold text-slate-400">
                    <div class="step-item text-neonPink">
                        <div class="h-1.5 bg-neonPink rounded-full mb-1"></div>
                        <span>Requested</span>
                    </div>
                    <div class="step-item text-neonPink">
                        <div class="h-1.5 bg-neonPink rounded-full mb-1"></div>
                        <span>Matched</span>
                    </div>
                    <div id="step-transit" class="step-item text-neonPink">
                        <div class="h-1.5 bg-neonPink rounded-full mb-1"></div>
                        <span>In Transit</span>
                    </div>
                    <div id="step-delivered" class="step-item">
                        <div class="h-1.5 bg-white/20 rounded-full mb-1"></div>
                        <span>Delivered</span>
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Nearby Pickup Opportunities</h3>
                <div id="errands-list" class="space-y-3">
                    <!-- Dynamic errands inserted via JS -->
                </div>
            </div>
        </section>
        `;
    }
});
