customElements.define('hb-tab-match', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="tab-match" class="tab-content space-y-4">
            <div class="pt-1">
                <div class="flex items-center gap-1.5 text-neonPink font-bold text-xs">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                    <span>Buddy Match</span>
                </div>
                <h1 class="text-2xl font-black text-white">Find a Buddy</h1>
                <p class="text-xs text-slate-400">Not a dating app — find someone to walk, study, or go to events with.</p>
            </div>

            <div id="match-card-area" class="relative"></div>
        </section>
        `;
    }
});
