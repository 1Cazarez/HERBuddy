customElements.define('hb-nav-bar', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav id="device-nav" class="hidden absolute bottom-0 left-0 right-0 bg-deepIndigo/95 backdrop-blur-md border-t border-white/10 px-4 py-2.5 justify-around items-center z-30">
            <button onclick="switchTab('home')" id="nav-home" class="nav-btn flex flex-col items-center gap-1 text-neonPink font-extrabold transition">
                <i data-lucide="home" class="w-5 h-5"></i>
                <span class="text-[10px]">Home</span>
            </button>
            <button onclick="switchTab('find')" id="nav-find" class="nav-btn flex flex-col items-center gap-1 text-slate-400 hover:text-neonPink transition">
                <i data-lucide="map" class="w-5 h-5"></i>
                <span class="text-[10px] font-bold">Find & Map</span>
            </button>
            <button onclick="switchTab('create')" id="nav-create" class="nav-btn flex flex-col items-center gap-1 text-slate-400 transition">
                <div class="gradient-brand text-white p-2.5 rounded-full -mt-6 shadow-neon-pink hover:scale-105 transition">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                </div>
                <span class="text-[10px] font-bold text-slate-400 mt-0.5">Walk</span>
            </button>
            <button onclick="switchTab('wellness')" id="nav-wellness" class="nav-btn flex flex-col items-center gap-1 text-slate-400 hover:text-neonPink transition">
                <i data-lucide="heart-pulse" class="w-5 h-5"></i>
                <span class="text-[10px] font-bold">Wellness</span>
            </button>
            <button onclick="switchTab('chat')" id="nav-chat" class="nav-btn flex flex-col items-center gap-1 text-slate-400 hover:text-neonPink transition">
                <i data-lucide="message-circle" class="w-5 h-5"></i>
                <span class="text-[10px] font-bold">Chat</span>
            </button>
        </nav>
        `;
    }
});
