import { gsuLocations, getGoogleMap } from './map.js';
import { showToast } from './utils.js';
import { escapeHtml } from './utils.js';

// Local-only for now (not persisted to TigerData) — resets on reload. A
// future version could add a `safety_reports` table + API route like
// walks/errands if this needs to be shared across users/devices.
const safetyReports = [
    { id: 1, locationName: "Aderhold Learning Center", category: "Poor Lighting", notes: "Very dark path near the park entrance at night.", time: "2 days ago" },
    { id: 2, locationName: "Piedmont Central Dining Hall", category: "Isolated / No Foot Traffic", notes: "Quiet after 9PM, few people around.", time: "5 days ago" }
];

export function openReportModal() {
    const select = document.getElementById('report-location');
    select.innerHTML = gsuLocations.map(loc => `<option value="${loc.id}">${loc.emoji} ${loc.name}</option>`).join('');
    document.getElementById('report-modal').classList.remove('opacity-0', 'pointer-events-none');
}

export function closeReportModal() {
    document.getElementById('report-modal').classList.add('opacity-0', 'pointer-events-none');
}

export function submitSafetyReport() {
    const locId = parseInt(document.getElementById('report-location').value, 10);
    const loc = gsuLocations.find(l => l.id === locId);
    const category = document.getElementById('report-category').value;
    const notes = document.getElementById('report-notes').value.trim();

    if (!loc) return;

    safetyReports.unshift({
        id: Date.now(),
        locationName: loc.name,
        category,
        notes: notes || "No additional details.",
        time: "Just now"
    });

    const googleMap = getGoogleMap();
    if (googleMap && window.google) {
        new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: googleMap,
            label: { text: "⚠️", fontSize: "14px" },
            title: `${category} — ${loc.name}`
        });
    }

    renderSafetyReports();
    document.getElementById('report-notes').value = '';
    closeReportModal();
    showToast("Report Submitted", "Thank you for helping keep the community safe.");
}

export function renderSafetyReports() {
    const container = document.getElementById('safety-reports-container');
    if (!container) return;
    if (safetyReports.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider pt-1">Community Safety Reports</h3>
    ` + safetyReports.slice(0, 5).map(r => `
        <div class="bg-amber-950/30 border border-amber-500/20 p-3 rounded-2xl text-xs space-y-1">
            <div class="flex justify-between items-center">
                <span class="font-bold text-amber-300">⚠️ ${r.category}</span>
                <span class="text-[10px] text-slate-500">${r.time}</span>
            </div>
            <p class="text-slate-300">${r.locationName}</p>
            <p class="text-[11px] text-slate-400">${escapeHtml(r.notes)}</p>
        </div>
    `).join('');
}
