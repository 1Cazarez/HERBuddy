customElements.define('hb-active-walk-banner', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="active-walk-banner" class="hidden z-20 px-4 pt-2 pb-1">
            <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-3.5 rounded-2xl shadow-lg border border-emerald-400/40 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-300 pulse-emerald"></span>
                        <span class="text-[10px] font-black uppercase tracking-wider text-emerald-100">🟢 WALK IN PROGRESS</span>
                    </div>
                    <span id="walk-timer" class="text-xs font-mono font-bold bg-black/30 px-2 py-0.5 rounded-md">23:14</span>
                </div>

                <div class="flex justify-between items-end flex-wrap gap-1.5">
                    <div>
                        <h4 id="active-walk-route-name" class="text-xs font-extrabold text-white">Student Center &rarr; Library</h4>
                        <p class="text-[10px] text-emerald-100"><span id="active-walk-distance">1.2 miles</span> &bull; <span id="active-walk-buddies">2 buddies walking along</span></p>
                    </div>
                    <div class="flex gap-1.5">
                        <button onclick="openCompanionModal()" class="bg-white/20 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md hover:bg-white/30 transition active:scale-95 flex items-center gap-1">
                            <i data-lucide="mic" class="w-3.5 h-3.5"></i> Companion
                        </button>
                        <button onclick="triggerArrivalCheckIn()" class="bg-white text-emerald-900 text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md hover:bg-emerald-50 transition active:scale-95 flex items-center gap-1">
                            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600"></i> [ I'VE ARRIVED ]
                        </button>
                        <a href="tel:4044133333" class="bg-red-700 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md hover:bg-red-800 transition active:scale-95 flex items-center gap-1">
                            <i data-lucide="phone-call" class="w-3.5 h-3.5"></i> POLICE
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
});
