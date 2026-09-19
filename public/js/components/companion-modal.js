customElements.define('hb-companion-modal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="sos-voice-modal" class="absolute inset-0 z-[60] bg-black/95 opacity-0 pointer-events-none transition-all duration-300 flex flex-col items-center justify-center p-6">
            <button onclick="closeCompanionModal()" class="absolute top-6 right-6 text-slate-400 hover:text-white">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>

            <div id="companion-picker-screen" class="text-center space-y-5 w-full max-w-xs">
                <div>
                    <div class="w-20 h-20 rounded-full gradient-brand mx-auto flex items-center justify-center shadow-neon-pink pulse-pink mb-3">
                        <i data-lucide="mic" class="w-8 h-8 text-white"></i>
                    </div>
                    <h2 class="text-xl font-black text-white">Choose Your Companion</h2>
                    <p class="text-xs text-slate-400">Who do you want to talk to on this walk?</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="startCompanionCall('friend')" class="gradient-card p-4 rounded-2xl space-y-2 hover:border-neonPink border border-white/10 transition flex flex-col items-center">
                        <span class="text-3xl">🦊</span>
                        <span class="text-xs font-bold text-white">Friend</span>
                        <span class="text-[9px] text-slate-400">Casual & fun</span>
                    </button>
                    <button onclick="startCompanionCall('grandma')" class="gradient-card p-4 rounded-2xl space-y-2 hover:border-neonPink border border-white/10 transition flex flex-col items-center">
                        <span class="text-3xl">👵</span>
                        <span class="text-xs font-bold text-white">Grandma</span>
                        <span class="text-[9px] text-slate-400">Warm & caring</span>
                    </button>
                </div>
            </div>

            <div id="companion-call-screen" class="hidden text-center space-y-2 w-full max-w-xs">
                <div class="w-20 h-20 rounded-full gradient-brand mx-auto flex items-center justify-center shadow-neon-pink pulse-pink mb-3">
                    <span id="companion-call-emoji" class="text-3xl">🦊</span>
                </div>
                <h2 id="companion-call-title" class="text-xl font-black text-white">Friend</h2>
                <p class="text-xs text-slate-400">Talk to me while you walk — I'm keeping you company.</p>
                <div id="convai-widget-container" class="w-full mt-4"></div>
                <p class="text-[10px] text-slate-500 mt-6">This does not replace calling 911 in a life-threatening emergency.</p>
            </div>
        </div>
        `;
    }
});
