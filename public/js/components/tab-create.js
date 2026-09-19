customElements.define('hb-tab-create', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-create" class="tab-content space-y-4">
            <div class="pt-1">
                <div class="flex items-center gap-1.5 text-neonPink font-bold text-xs">
                    <i data-lucide="shield-heart" class="w-4 h-4"></i>
                    <span>Health & Safety Scheduler</span>
                </div>
                <h1 class="text-2xl font-black text-white">Create a Safe Walk</h1>
                <p class="text-xs text-slate-400">Schedule a group walk or invite campus buddies</p>
            </div>

            <form id="create-walk-form" onsubmit="handleCreateWalk(event)" class="space-y-3.5">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">Route Name</label>
                    <input type="text" id="input-route-title" placeholder="Leave blank to auto-name from your route" oninput="checkRouteMatches()" class="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-neonPink">
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Origin</label>
                        <select id="input-origin" required onchange="updateRouteEstimate()" class="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white"></select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Destination</label>
                        <select id="input-destination" required onchange="updateRouteEstimate()" class="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white"></select>
                    </div>
                </div>

                <div id="route-match-alert" class="gradient-card p-3 rounded-2xl text-xs flex items-center gap-2.5">
                    <i data-lucide="sparkles" class="w-5 h-5 text-neonPink flex-shrink-0"></i>
                    <div>
                        <span class="font-extrabold text-neonPink block">3 women buddies already scheduled!</span>
                        <span class="text-[10px] text-slate-300">Creating this route will automatically match you with nearby walking companions.</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Departure Time</label>
                        <input type="time" id="input-time" value="15:30" required class="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Est. Distance</label>
                        <input type="text" id="input-distance" readonly class="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white" value="-- miles">
                    </div>
                </div>

                <div class="gradient-card p-3.5 rounded-2xl space-y-2.5">
                    <span class="text-xs font-bold text-neonPink flex items-center gap-1">
                        <i data-lucide="shield" class="w-3.5 h-3.5"></i> Safety Controls
                    </span>

                    <div class="flex justify-between items-center">
                        <span class="text-xs text-slate-300">Auto Check-in Timer & Ping</span>
                        <input type="checkbox" id="check-safety-ping" checked class="accent-neonPink rounded">
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-xs text-slate-300">Notify Emergency Contact on Departure</span>
                        <input type="checkbox" id="check-notify-contact" checked class="accent-neonPink rounded">
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-xs text-slate-300">Allow Errand Pickups Along Path</span>
                        <input type="checkbox" id="check-allow-errands" checked class="accent-neonPink rounded">
                    </div>
                </div>

                <button type="submit" class="w-full gradient-brand text-white font-black text-xs py-3.5 rounded-2xl shadow-neon-pink hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-2">
                    <i data-lucide="navigation" class="w-4 h-4"></i> START / SCHEDULE WALK NOW
                </button>
            </form>
        </section>
        `;
    }
});
