import { backendEnabled } from './api-config.js';
import { apiGet, apiPost, apiPatch, apiPut } from './api.js';
import { appState } from './state.js';
import { showToast } from './utils.js';
import { switchTab } from './navigation.js';
import { syncStateToUI } from './profile.js';

const POLL_INTERVAL_MS = 4000;
let pollHandle = null;

function mapWalkRow(row) {
    const avatars = row.avatars || [];
    return {
        id: row.id,
        title: row.title,
        from: row.from_location,
        to: row.to_location,
        time: row.time,
        distance: row.distance,
        buddies: row.buddies,
        nightSafe: row.night_safe,
        avatars,
        joined: avatars.includes(appState.user.avatar)
    };
}

export function subscribeToWalks() {
    if (!backendEnabled) return;
    if (pollHandle) clearInterval(pollHandle);

    refreshWalks();
    pollHandle = setInterval(refreshWalks, POLL_INTERVAL_MS);
}

async function refreshWalks() {
    try {
        const rows = await apiGet('/walks');
        appState.walks = rows.map(mapWalkRow);
        renderWalkList();
    } catch (err) {
        console.warn('Herbuddy: failed to refresh walks from the API.', err);
    }
}

export function renderWalkList() {
    const container = document.getElementById('walks-container');
    if (!container) return;

    const searchInput = document.getElementById('find-search-input');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = appState.walks.filter(w => {
        const matchesSearch = w.title.toLowerCase().includes(query) || w.from.toLowerCase().includes(query) || w.to.toLowerCase().includes(query);
        if (appState.activeFilter === 'night') return matchesSearch && w.nightSafe;
        if (appState.activeFilter === 'popular') return matchesSearch && w.buddies >= 3;
        return matchesSearch;
    });

    const countBadge = document.getElementById('routes-count-badge');
    if (countBadge) countBadge.innerText = `${filtered.length} Available`;

    container.innerHTML = filtered.map(w => `
        <div class="gradient-card p-4 rounded-3xl space-y-3">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-[10px] font-extrabold text-neonPink bg-neonPink/20 border border-neonPink/40 px-2 py-0.5 rounded-md">
                        ${w.nightSafe ? '🌙 Safe Night Route' : '☀️ Day Route'}
                    </span>
                    <h3 class="text-sm font-black text-white mt-1.5">${w.title}</h3>
                </div>
                <span class="text-xs font-mono font-bold text-slate-400">${w.time}</span>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-300">
                <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-neonPink"></i> ${w.from} → ${w.to}</span>
                <span class="font-bold text-white">${w.distance}</span>
            </div>

            <div class="pt-2 border-t border-white/10 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="flex -space-x-2">
                        ${w.avatars.map(a => `<div class="w-6 h-6 rounded-full bg-purple-950 border border-neonPink flex items-center justify-center text-xs">${a}</div>`).join('')}
                    </div>
                    <span class="text-[11px] font-bold text-slate-300">${w.buddies} buddies walking</span>
                </div>
                <button onclick="joinWalkFromList(${w.id})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${w.joined ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'gradient-brand text-white shadow-md'}">
                    ${w.joined ? 'Joined ✓' : 'Join Group'}
                </button>
            </div>
        </div>
    `).join('');

    if (window.lucide) {
        lucide.createIcons();
    }
}

export function setFilter(filterType, e) {
    appState.activeFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = "filter-btn bg-black/40 text-slate-300 border border-white/10 px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap";
    });
    if (e && e.target) {
        e.target.className = "filter-btn active gradient-brand text-white px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap";
    }
    renderWalkList();
}

export async function joinWalkFromList(id) {
    const walk = appState.walks.find(w => w.id === id);
    if (!walk) return;

    walk.joined = !walk.joined;
    if (walk.joined) {
        walk.buddies++;
        walk.avatars.push(appState.user.avatar);
    } else {
        walk.buddies--;
        const idx = walk.avatars.indexOf(appState.user.avatar);
        if (idx > -1) walk.avatars.splice(idx, 1);
    }
    renderWalkList();
    showToast(walk.joined ? "Group Joined!" : "Left Group", `${walk.title}`);

    if (backendEnabled) {
        try {
            await apiPatch(`/walks/${walk.id}`, {
                buddies: walk.buddies,
                avatars: walk.avatars
            });
        } catch (err) {
            console.warn('Herbuddy: failed to sync walk join to the API.', err);
        }
    }
}

export function checkRouteMatches() {
    const title = document.getElementById('input-route-title').value.toLowerCase();
    const alertBox = document.getElementById('route-match-alert');
    if (title.includes('library') || title.includes('student center')) {
        alertBox.classList.remove('hidden');
    }
}

export async function handleCreateWalk(e) {
    if (e) e.preventDefault();
    const title = document.getElementById('input-route-title').value;
    const from = document.getElementById('input-origin').value;
    const to = document.getElementById('input-destination').value;
    const time = document.getElementById('input-time').value;
    const distance = document.getElementById('input-distance').value;

    appState.activeWalk = { title, from, to, distance: `${distance} miles`, buddies: 3 };

    if (backendEnabled) {
        try {
            await apiPost('/walks', {
                title,
                from_location: from,
                to_location: to,
                time,
                distance: `${distance} mi`,
                night_safe: false,
                avatars: [appState.user.avatar]
            });
            refreshWalks(); // don't wait for the next poll tick
        } catch (err) {
            console.warn('Herbuddy: failed to save walk to the API.', err);
        }
    }

    showActiveWalkBanner();
    showToast("🟢 Walk Scheduled!", `Walking safely to ${to}. Safety check-in active.`);
    switchTab('home');
}

export function quickJoinSuggestedRoute() {
    appState.activeWalk = { title: "Student Center → Library", from: "Student Center", to: "Library", distance: "1.2 miles", buddies: 3 };
    showActiveWalkBanner();
    showToast("Joined Walk Group!", "3 campus buddies notified. Safety check-in initiated.");
}

export function showActiveWalkBanner() {
    const banner = document.getElementById('active-walk-banner');
    banner.classList.remove('hidden');
    document.getElementById('active-walk-route-name').innerText = appState.activeWalk.title;
    document.getElementById('active-walk-distance').innerText = appState.activeWalk.distance;

    if (!appState.timerInterval) {
        appState.timerInterval = setInterval(() => {
            appState.secondsElapsed++;
            const mins = Math.floor(appState.secondsElapsed / 60);
            const secs = appState.secondsElapsed % 60;
            document.getElementById('walk-timer').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

export async function triggerArrivalCheckIn() {
    clearInterval(appState.timerInterval);
    appState.timerInterval = null;
    document.getElementById('active-walk-banner').classList.add('hidden');

    appState.user.steps += 2400;
    appState.user.activeMinutes += 23;
    appState.user.weeklyDistance = (parseFloat(appState.user.weeklyDistance) + 1.2).toFixed(1);

    syncStateToUI();
    showToast("🎉 Safe Arrival Confirmed!", `Trusted contact notified & +2,400 steps added for ${appState.user.name.split(' ')[0]} ${appState.user.avatar}!`);

    if (backendEnabled && appState.userId) {
        try {
            await apiPut('/me', {
                steps: appState.user.steps,
                active_minutes: appState.user.activeMinutes,
                weekly_distance: appState.user.weeklyDistance
            });
        } catch (err) {
            console.warn('Herbuddy: failed to sync arrival stats to the API.', err);
        }
    }
}

export function simulateFindMapMove() {
    const pin = document.getElementById('find-map-user-pin');
    if (!pin) return;

    pin.style.top = '28%';
    pin.style.left = '65%';
    showToast("Navigation Active", "Moving along lit campus route on radar...");

    setTimeout(() => {
        pin.style.top = '15%';
        pin.style.left = '82%';
        showToast("Safe Arrival Near!", "You are approaching the Library destination.");
    }, 2500);
}
