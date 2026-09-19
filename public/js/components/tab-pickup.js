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
            </div>

            <div class="flex gap-2 mb-3">
                <button id="pickup-mode-request" onclick="setPickupMode('request')" class="flex-1 py-2 rounded-xl font-black text-xs border transition bg-neonPink/20 text-neonPink border-neonPink/40">
                    Request
                </button>
                <button id="pickup-mode-deliver" onclick="setPickupMode('deliver')" class="flex-1 py-2 rounded-xl font-black text-xs border transition bg-slate-900/60 text-slate-300 border-white/10">
                    Deliver
                </button>
            </div>

            <div id="pickup-request-panel" class="space-y-3">
                <div class="gradient-card p-4 rounded-3xl shadow-lg border border-neonPink/40 space-y-3">
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">Pickup request</label>
                        <textarea id="pickup-request-text" rows="3" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white text-xs" placeholder="Describe what you need picked up..."></textarea>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">Delivery location</label>
                        <input id="pickup-delivery-location" type="text" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white text-xs" placeholder="Library desk, Student Center, etc." value="Library Desk">
                    </div>
                    <div>
                        <label for="pickup-priority" class="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">Priority</label>
                        <select id="pickup-priority" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white text-xs">
                            <option value="normal">Normal</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                    <button onclick="submitPickupRequest()" class="w-full gradient-brand text-white font-black py-3 rounded-xl shadow-neon-pink hover:opacity-95 transition">
                        Submit Request
                    </button>
                </div>
            </div>

            <div id="pickup-deliver-panel" class="hidden space-y-3">
                <div class="space-y-3">
                    <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Open Requests</h3>
                    <div id="pickup-request-list" class="space-y-3">
                        <!-- Dynamic request list -->
                    </div>
                </div>

                <div id="pickup-status-panel" class="mt-3">
                    <div class="text-xs text-slate-300">No active accepted request.</div>
                </div>
            </div>
        </section>
        `;
    }
});
