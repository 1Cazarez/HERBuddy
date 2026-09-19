customElements.define('hb-errand-modal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="errand-modal" class="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 flex items-center justify-center p-4">
            <div class="gradient-card p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-neon-purple border border-neonPink/50">
                <div class="flex justify-between items-center">
                    <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <i data-lucide="package-plus" class="w-4 h-4 text-neonPink"></i> Request Campus Errand
                    </h3>
                    <button onclick="closeNewErrandModal()" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>

                <div class="space-y-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Item / Task Description</label>
                        <input type="text" id="modal-errand-item" placeholder="e.g. Science Notes Dropoff" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Pickup Location</label>
                        <input type="text" id="modal-errand-from" value="Student Center" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Dropoff Location</label>
                        <input type="text" id="modal-errand-to" value="Library" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                    </div>

                    <button onclick="submitNewErrand()" class="w-full gradient-brand text-white font-black py-3 rounded-xl shadow-neon-pink hover:opacity-95 transition mt-2">
                        BROADCAST TO WALKERS
                    </button>
                </div>
            </div>
        </div>
        `;
    }
});
