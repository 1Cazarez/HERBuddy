customElements.define('hb-fake-call-modal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="fake-call-modal" class="absolute inset-0 z-[60] bg-black opacity-0 pointer-events-none transition-all duration-300 flex flex-col">
            <div id="fake-call-incoming" class="flex-1 flex flex-col items-center justify-between py-16 px-8 bg-gradient-to-b from-slate-900 to-black">
                <div class="text-center space-y-2 mt-8">
                    <p class="text-slate-400 text-sm">Incoming Call</p>
                    <div class="w-28 h-28 rounded-full gradient-brand mx-auto flex items-center justify-center text-5xl shadow-neon-pink mt-4">🦉</div>
                    <h2 class="text-2xl font-black text-white mt-4" id="fake-call-name">Mom</h2>
                    <p class="text-slate-400 text-xs">mobile</p>
                </div>
                <div class="flex items-center justify-between w-full max-w-xs">
                    <button onclick="declineFakeCall()" class="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center shadow-lg active:scale-95 transition">
                        <i data-lucide="phone-off" class="w-6 h-6 text-white"></i>
                    </button>
                    <button onclick="answerFakeCall()" class="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg active:scale-95 transition pulse-emerald">
                        <i data-lucide="phone" class="w-6 h-6 text-white"></i>
                    </button>
                </div>
            </div>

            <div id="fake-call-active" class="hidden flex-1 flex flex-col items-center justify-between py-16 px-8 bg-gradient-to-b from-slate-900 to-black">
                <div class="text-center space-y-2 mt-8">
                    <div class="w-28 h-28 rounded-full gradient-brand mx-auto flex items-center justify-center text-5xl shadow-neon-pink">🦉</div>
                    <h2 class="text-2xl font-black text-white mt-4" id="fake-call-name-active">Mom</h2>
                    <p class="text-emerald-400 text-xs font-mono" id="fake-call-timer">00:00</p>
                </div>
                <button onclick="endFakeCall()" class="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center shadow-lg active:scale-95 transition">
                    <i data-lucide="phone-off" class="w-6 h-6 text-white"></i>
                </button>
            </div>
        </div>
        `;
    }
});
