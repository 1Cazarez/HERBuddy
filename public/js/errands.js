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

export function setPickupMode(mode) {
    appState.pickupMode = mode;
    const requestPanel = document.getElementById('pickup-request-panel');
    const deliverPanel = document.getElementById('pickup-deliver-panel');
    const requestButton = document.getElementById('pickup-mode-request');
    const deliverButton = document.getElementById('pickup-mode-deliver');

    if (!requestPanel || !deliverPanel || !requestButton || !deliverButton) return;

    const isRequest = mode === 'request';
    requestPanel.classList.toggle('hidden', !isRequest);
    deliverPanel.classList.toggle('hidden', isRequest);
    requestButton.className = isRequest
        ? 'flex-1 py-2 rounded-xl font-black text-xs border transition bg-neonPink/20 text-neonPink border-neonPink/40'
        : 'flex-1 py-2 rounded-xl font-black text-xs border transition bg-slate-900/60 text-slate-300 border-white/10';
    deliverButton.className = !isRequest
        ? 'flex-1 py-2 rounded-xl font-black text-xs border transition bg-neonPink/20 text-neonPink border-neonPink/40'
        : 'flex-1 py-2 rounded-xl font-black text-xs border transition bg-slate-900/60 text-slate-300 border-white/10';
}

export function renderPickupRequestList() {
    const container = document.getElementById('pickup-request-list');
    if (!container) return;

    container.innerHTML = appState.pickupRequests.map((request) => `
        <div class="gradient-card p-3 rounded-2xl border ${request.emergency ? 'border-red-500/60' : 'border-white/10'}">
            <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] font-black uppercase tracking-wider ${request.emergency ? 'text-red-300' : 'text-slate-300'}">
                            ${request.emergency ? 'Emergency' : 'Normal'}
                        </span>
                        <span class="text-[9px] text-slate-400">by ${request.requester}</span>
                    </div>
                    <p class="text-[11px] text-slate-200">${request.request}</p>
                    <p class="mt-1 text-[10px] text-slate-400">Delivery: ${request.deliveryLocation}</p>
                </div>
                <button onclick="acceptPickupRequest(${request.id})" class="text-[10px] font-black text-white gradient-brand px-2.5 py-1.5 rounded-xl shadow-md hover:opacity-90 transition">
                    Accept
                </button>
            </div>
        </div>
    `).join('');
}

export function submitPickupRequest() {
    const requestText = document.getElementById('pickup-request-text').value.trim();
    const deliveryLocation = document.getElementById('pickup-delivery-location').value.trim();
    const prioritySelect = document.getElementById('pickup-priority');
    const emergency = prioritySelect ? prioritySelect.value === 'emergency' : false;

    if (!requestText || !deliveryLocation) {
        showToast('Missing details', 'Add your pickup request and delivery location first.');
        return;
    }

    appState.pickupRequests.unshift({
        id: Date.now(),
        request: requestText,
        deliveryLocation,
        emergency,
        requester: appState.user.name,
        status: 'open'
    });

    appState.pickupMode = 'deliver';
    renderPickupRequestList();
    setPickupMode('deliver');

    document.getElementById('pickup-request-text').value = '';
    document.getElementById('pickup-delivery-location').value = 'Library Desk';
    if (prioritySelect) prioritySelect.value = 'normal';
    showToast('Request submitted', 'Your pickup request is now visible to deliverers.');
}

export function acceptPickupRequest(id) {
    const request = appState.pickupRequests.find(item => item.id === id);
    if (!request) return;

    request.status = 'accepted';
    appState.activePickupRequestId = id;
    renderPickupRequestList();
    renderAcceptedPickupStatus(request);
    showToast('Pickup accepted', `You are now handling ${request.requester}'s request.`);
}

function renderAcceptedPickupStatus(request) {
    const status = document.getElementById('pickup-status-panel');
    if (!status) return;

    status.innerHTML = `
        <div class="gradient-card p-4 rounded-3xl shadow-lg border border-neonPink/40 space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-wider text-neonPink">Accepted request</span>
                <span class="text-[9px] px-2 py-1 rounded-full ${request.emergency ? 'bg-red-500/20 text-red-200' : 'bg-white/10 text-slate-200'}">
                    ${request.emergency ? 'Emergency' : 'Normal'}
                </span>
            </div>
            <p class="text-[11px] text-slate-200">${request.request}</p>
            <p class="text-[10px] text-slate-400">Delivery area: ${request.deliveryLocation}</p>
            <div class="flex gap-2 mt-2">
                <button onclick="markPickupCollected(${request.id})" class="flex-1 text-[10px] font-black text-white bg-amber-500/80 px-2 py-2 rounded-xl">Picked Up</button>
                <button onclick="markPickupDelivered(${request.id})" class="flex-1 text-[10px] font-black text-white bg-green-500/80 px-2 py-2 rounded-xl">Delivered</button>
            </div>
        </div>
    `;
}

export function markPickupCollected(id) {
    const request = appState.pickupRequests.find(item => item.id === id);
    if (!request) return;
    request.status = 'collected';
    renderAcceptedPickupStatus(request);
    showToast('Item picked up', 'This request is now in the delivery stage.');
}

export function markPickupDelivered(id) {
    const request = appState.pickupRequests.find(item => item.id === id);
    if (!request) return;
    request.status = 'delivered';
    appState.pickupRequests = appState.pickupRequests.filter(item => item.id !== id);
    const status = document.getElementById('pickup-status-panel');
    if (status) status.innerHTML = '<div class="text-xs text-slate-300">No active accepted request.</div>';
    renderPickupRequestList();
    showToast('Delivered', 'The item has been marked as delivered.');
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
