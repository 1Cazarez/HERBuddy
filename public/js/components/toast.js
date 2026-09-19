customElements.define('hb-toast', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="toast" class="absolute top-12 left-4 right-4 z-50 transform -translate-y-28 opacity-0 transition-all duration-300 pointer-events-none">
            <div class="gradient-brand text-white px-4 py-3 rounded-2xl shadow-neon-pink flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-xl">
                        <i data-lucide="bell" class="w-4 h-4 text-white"></i>
                    </div>
                    <div>
                        <p class="text-xs font-extrabold" id="toast-title">Notification</p>
                        <p class="text-[11px] text-white/90" id="toast-message">Action completed!</p>
                    </div>
                </div>
                <button onclick="hideToast()" class="text-white/80 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
        </div>
        `;
    }
});
