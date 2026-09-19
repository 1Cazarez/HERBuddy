customElements.define('hb-report-modal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="report-modal" class="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 flex items-center justify-center p-4">
            <div class="gradient-card p-6 rounded-3xl w-full max-w-xs space-y-4 shadow-neon-purple border border-amber-500/50">
                <div class="flex justify-between items-center">
                    <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <i data-lucide="flag" class="w-4 h-4 text-amber-400"></i> Report Unsafe Area
                    </h3>
                    <button onclick="closeReportModal()" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>

                <div class="space-y-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Location</label>
                        <select id="report-location" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white"></select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">What happened?</label>
                        <select id="report-category" class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white">
                            <option>Poor Lighting</option>
                            <option>Catcalling / Harassment</option>
                            <option>Suspicious Person</option>
                            <option>Broken Emergency Phone</option>
                            <option>Isolated / No Foot Traffic</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-300 mb-1">Details (optional)</label>
                        <textarea id="report-notes" rows="2" placeholder="Anything else other women should know..." class="w-full bg-black/50 border border-white/20 px-3 py-2.5 rounded-xl text-white resize-none"></textarea>
                    </div>
                    <p class="text-[10px] text-slate-400">Your report is anonymous and helps other women stay safe on campus.</p>

                    <button onclick="submitSafetyReport()" class="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black py-3 rounded-xl shadow-lg hover:opacity-95 transition mt-2">
                        SUBMIT REPORT
                    </button>
                </div>
            </div>
        </div>
        `;
    }
});
