customElements.define('hb-tab-chat', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-chat" class="tab-content space-y-4">
            <div class="pt-1 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-black text-white">Study Circle & Chat</h1>
                    <p class="text-xs text-slate-400">Verified women's campus walking & support circle</p>
                </div>
                <span class="px-2.5 py-1 bg-sky-500/20 border border-sky-500/40 text-sky-300 rounded-xl text-xs font-bold">Live</span>
            </div>

            <div id="conversation-list" class="hidden flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button onclick="switchToGroupChat()" class="flex flex-col items-center gap-1 flex-shrink-0">
                    <div class="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-lg">🌸</div>
                    <span class="text-[9px] font-bold text-slate-300">Group</span>
                </button>
            </div>

            <div class="gradient-card p-3.5 rounded-3xl flex flex-col h-[360px] border border-neonPink/30 shadow-neon-purple justify-between">
                <!-- Chat Messages Header -->
                <div class="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-sm" id="chat-header-avatar">🌸</div>
                        <div>
                            <h4 class="font-bold text-white" id="chat-header-name">Main Quad Evening Walkers</h4>
                            <span class="text-[9px] text-emerald-400" id="chat-header-status">4 members active</span>
                        </div>
                    </div>
                    <button id="chat-remove-btn" onclick="removeCurrentMatchedBuddy()" class="hidden text-[10px] bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold px-2 py-0.5 rounded-full hover:bg-rose-900/80 transition">Remove</button>
                    <span id="chat-encrypted-badge" class="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">Encrypted</span>
                </div>

                <!-- Message Feed -->
                <div id="chat-messages-container" class="flex-1 overflow-y-auto no-scrollbar py-2 space-y-3 text-xs">
                    <div class="flex items-start gap-2">
                        <div class="w-6 h-6 rounded-full bg-purple-900 border border-neonPink flex items-center justify-center text-xs flex-shrink-0">👩🏼</div>
                        <div class="bg-black/50 p-2.5 rounded-2xl rounded-tl-none border border-white/10 space-y-0.5 max-w-[80%]">
                            <span class="text-[9px] font-bold text-neonPink block">Jessica (Library)</span>
                            <p class="text-slate-200">Hey everyone! Leaving the Student Center in 5 minutes if anyone wants to walk together! 🌙</p>
                            <span class="text-[8px] text-slate-500 block text-right">3:28 PM</span>
                        </div>
                    </div>

                    <div class="flex items-start gap-2">
                        <div class="w-6 h-6 rounded-full bg-purple-900 border border-neonPink flex items-center justify-center text-xs flex-shrink-0">👩🏻</div>
                        <div class="bg-black/50 p-2.5 rounded-2xl rounded-tl-none border border-white/10 space-y-0.5 max-w-[80%]">
                            <span class="text-[9px] font-bold text-electricPurple block">Chloe (Science Hall)</span>
                            <p class="text-slate-200">I'm joining at the fountain plaza! See you all shortly.</p>
                            <span class="text-[8px] text-slate-500 block text-right">3:30 PM</span>
                        </div>
                    </div>
                </div>

                <!-- Chat Input form -->
                <form onsubmit="handleSendChatMessage(event)" class="pt-2 border-t border-white/10 flex gap-2">
                    <input type="text" id="chat-input-text" required placeholder="Type a message to your group..." class="flex-1 bg-black/50 border border-white/20 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-neonPink">
                    <button type="submit" class="gradient-brand text-white px-4 py-2 rounded-xl text-xs font-black shadow-neon-pink hover:opacity-95 transition flex items-center justify-center">
                        <i data-lucide="send" class="w-3.5 h-3.5"></i>
                    </button>
                </form>
            </div>
        </section>
        `;
    }
});
