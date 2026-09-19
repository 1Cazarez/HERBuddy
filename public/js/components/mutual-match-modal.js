customElements.define('hb-mutual-match-modal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="mutual-match-modal" class="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 flex items-center justify-center p-4">
            <div class="gradient-card p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-neon-purple border border-neonPink/50 text-center">
                <div class="text-4xl">✨</div>
                <h3 class="text-lg font-black text-white">It's a Buddy Match!</h3>
                <p class="text-xs text-slate-300" id="mutual-match-text">You and Maya have a lot in common.</p>
                <div class="flex flex-col gap-2 pt-2">
                    <button onclick="planWalkWithMatch()" class="w-full gradient-brand text-white font-black py-3 rounded-xl shadow-neon-pink hover:opacity-95 transition">Plan a Walk</button>
                    <button onclick="openChatWithMatchedBuddy()" class="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition">Message Now</button>
                </div>
            </div>
        </div>
        `;
    }
});
