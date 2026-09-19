customElements.define('hb-tab-match', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-match" class="tab-content space-y-4">
            <div class="pt-1 flex justify-between items-start gap-3">
                <div>
                    <div class="flex items-center gap-1.5 text-neonPink font-bold text-xs">
                        <i data-lucide="sparkles" class="w-4 h-4"></i>
                        <span>Buddy Match</span>
                    </div>
                    <h1 class="text-2xl font-black text-white">Find a Buddy</h1>
                    <p class="text-xs text-slate-400">Not a dating app — find someone to walk, study, or go to events with.</p>
                </div>
                <button onclick="switchTab('chat')" class="bg-sky-500/20 border border-sky-500/40 text-sky-300 px-3 py-2.5 rounded-xl flex items-center gap-1.5 flex-shrink-0 font-bold text-xs hover:bg-sky-500/30 transition">
                    <i data-lucide="message-circle" class="w-4 h-4"></i> Messages
                </button>
            </div>

            <div class="flex gap-2 bg-black/40 border border-white/10 rounded-2xl p-1">
                <button onclick="switchMatchView('discover')" id="match-view-btn-discover" class="match-view-btn flex-1 py-2 rounded-xl text-xs font-bold gradient-brand text-white transition">
                    Find a Buddy
                </button>
                <button onclick="switchMatchView('friends')" id="match-view-btn-friends" class="match-view-btn flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 transition">
                    Friends
                </button>
            </div>

            <div id="match-view-discover">
                <div id="match-card-area" class="relative"></div>
            </div>

            <div id="match-view-friends" class="hidden space-y-3">
                <p class="text-xs text-slate-400">Add walking buddies you already know so you can check in on each other during walks.</p>
                <form onsubmit="addFriendByEmail(event)" class="flex gap-2">
                    <input type="email" id="add-friend-email" required placeholder="Friend's Herbuddy email" class="flex-1 bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-neonPink">
                    <button type="submit" class="gradient-brand text-white px-4 rounded-xl text-xs font-black shadow-neon-pink hover:opacity-95 transition">Add</button>
                </form>
                <div id="friends-list-container" class="space-y-2"></div>
            </div>
        </section>
        `;
    }
});
