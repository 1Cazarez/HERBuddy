import { backendEnabled } from './api-config.js';
import { apiGet, apiPost, apiPatch } from './api.js';
import { appState } from './state.js';
import { showToast } from './utils.js';
import { switchTab } from './navigation.js';
import { syncStateToUI } from './profile.js';

const POLL_INTERVAL_MS = 4000;
let pollHandle = null;

function mapErrandRow(row) {
    return {
        id: row.id,
        title: row.title,
        from: row.from_location,
        to: row.to_location,
        requesterEmoji: row.requester_emoji,
        requester: row.requester,
        reward: row.reward,
        status: row.status
    };
}

export function subscribeToErrands() {
    if (!backendEnabled) return;
    if (pollHandle) clearInterval(pollHandle);

    refreshErrands();
    pollHandle = setInterval(refreshErrands, POLL_INTERVAL_MS);
}

async function refreshErrands() {
    try {
        const rows = await apiGet('/errands');
        appState.errands = rows.map(mapErrandRow);
        renderErrandList();
    } catch (err) {
        console.warn('Herbuddy: failed to refresh errands from the API.', err);
    }
}

export function renderErrandList() {
    const container = document.getElementById('errands-list');
    if (!container) return;

    container.innerHTML = appState.errands.map(e => `
        <div class="gradient-card p-3.5 rounded-2xl flex items-center justify-between">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-white">${e.title}</span>
                    <span class="text-[9px] bg-neonPink/20 text-neonPink font-bold px-1.5 py-0.5 rounded border border-neonPink/30">${e.reward}</span>
                </div>
                <p class="text-[10px] text-slate-400 flex items-center gap-1">
                    Path: ${e.from} → ${e.to} • ${e.requesterEmoji} ${e.requester}
                </p>
            </div>
            <button onclick="acceptErrandRequest(${e.id})" class="text-xs font-extrabold text-white gradient-brand px-3 py-1.5 rounded-xl shadow-md hover:opacity-90 transition">
                Accept
            </button>
        </div>
    `).join('');

    if (window.lucide) {
        lucide.createIcons();
    }
}

export async function acceptErrandRequest(id) {
    appState.user.completedErrands++;
    syncStateToUI();

    const transitStep = document.getElementById('step-transit');
    if (transitStep) {
        transitStep.className = 'step-item text-neonPink font-bold';
    }
    document.getElementById('errand-tracker-status').innerText = 'In Transit';

    showToast("📦 Pickup Accepted!", `${appState.user.avatar} ${appState.user.name.split(' ')[0]} attached to carry errand.`);
    switchTab('pickup');

    if (backendEnabled) {
        try {
            await apiPatch(`/errands/${id}`, { status: 'In Transit' });
        } catch (err) {
            console.warn('Herbuddy: failed to sync errand acceptance to the API.', err);
        }
    }
}

export function openNewErrandModal() {
    const modal = document.getElementById('errand-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

export function closeNewErrandModal() {
    const modal = document.getElementById('errand-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

export async function submitNewErrand() {
    const item = document.getElementById('modal-errand-item').value || 'Package Dropoff';
    const from = document.getElementById('modal-errand-from').value;
    const to = document.getElementById('modal-errand-to').value;

    const newErrand = {
        title: item,
        from_location: from,
        to_location: to,
        requester_emoji: appState.user.avatar,
        requester: `${appState.user.name} (${appState.user.avatar})`,
        reward: "+50 pts"
    };

    let savedRemotely = false;
    if (backendEnabled) {
        try {
            await apiPost('/errands', newErrand);
            savedRemotely = true;
            refreshErrands(); // don't wait for the next poll tick
        } catch (err) {
            console.warn('Herbuddy: failed to save errand to the API, keeping it local.', err);
        }
    }

    if (!savedRemotely) {
        appState.errands.unshift({
            id: Date.now(),
            title: item,
            from,
            to,
            requesterEmoji: appState.user.avatar,
            requester: `${appState.user.name} (${appState.user.avatar})`,
            reward: "+50 pts",
            status: "Pending"
        });
        renderErrandList();
    }

    closeNewErrandModal();
    showToast("Errand Live!", "Walkers along this route have been notified.");
}
