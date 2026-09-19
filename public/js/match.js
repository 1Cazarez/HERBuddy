import { appState } from './state.js';
import { showToast } from './utils.js';
import { switchTab } from './navigation.js';
import { backendEnabled } from './api-config.js';
import { apiGet, apiPost, apiDelete } from './api.js';
import { buddyRoom, setActiveRoom, postAsBuddy } from './chat.js';

// Demo buddy pool — not real other users yet. A future version would swap
// this for a `/api/buddies` endpoint reading other users' profiles from
// TigerData (excluding yourself), with the same matching logic below.
const buddyProfiles = [
    { name: "Maya Chen", avatar: "🦉", year: "Sophomore", major: "Computer Information Systems", interests: ["Coffee", "Tech", "K-pop", "Gym"], clubs: ["ACM-W", "Women in Technology", "Data Science Club"], events: ["Career Fair", "HackHERS", "Women in Tech Mixer"], zone: "Library Area", lookingFor: ["Walking Buddy", "Study Buddy"], walkingStyle: "Social", likedYou: true },
    { name: "Sarah Kim", avatar: "🐰", year: "Sophomore", major: "Data Science", interests: ["Tech", "Coffee", "Yoga"], clubs: ["ACM-W"], events: ["Career Fair", "Women in Tech Mixer"], zone: "Student Center Area", lookingFor: ["Event Buddy"], walkingStyle: "Social", likedYou: true },
    { name: "Emily Torres", avatar: "🐱", year: "Junior", major: "Psychology", interests: ["Reading", "Art", "Coffee"], clubs: ["Psych Club"], events: ["HackHERS"], zone: "Aderhold Area", lookingFor: ["Study Buddy"], walkingStyle: "Casual", likedYou: true },
    { name: "Jasmine Lee", avatar: "🦊", year: "Freshman", major: "Business Administration", interests: ["Fitness", "Music", "Coffee"], clubs: ["Women in Business"], events: ["Career Fair"], zone: "Recreation Center Area", lookingFor: ["Walking Buddy"], walkingStyle: "Social", likedYou: true },
    { name: "Chloe Nguyen", avatar: "🦉", year: "Senior", major: "Computer Science", interests: ["Tech", "Gaming", "K-pop"], clubs: ["ACM-W", "Data Science Club"], events: ["HackHERS", "Career Fair"], zone: "Downtown Campus", lookingFor: ["Event Buddy", "Study Buddy"], walkingStyle: "Social", likedYou: true }
];

let currentMatchIndex = 0;
let matchedBuddies = []; // subset of buddyProfiles the user has matched with
let activeChatBuddy = null;

export function resetMatchIndex() {
    currentMatchIndex = 0;
}

// Loads persisted matches from the API — call once after login.
export async function initMatches() {
    if (!backendEnabled) return;
    try {
        const names = await apiGet('/matches');
        matchedBuddies = buddyProfiles.filter(b => names.includes(b.name));
        renderConversationList();
    } catch (err) {
        console.warn('Herbuddy: failed to load matched buddies from the API.', err);
    }
}

function calcBuddyMatch(user, buddy) {
    let score = 0;
    const reasons = [];

    if (user.year === buddy.year) { score += 10; reasons.push("Same year"); }
    if (user.major === buddy.major) { score += 15; reasons.push("Same major"); }
    else if (buddy.major.toLowerCase().includes("computer") || buddy.major.toLowerCase().includes("data")) { score += 8; reasons.push("Similar field of study"); }

    const sharedInterests = (user.interests || []).filter(i => buddy.interests.includes(i));
    sharedInterests.forEach(i => { score += 10; reasons.push(`Both like ${i}`); });

    const sharedClubs = (user.clubs || []).filter(c => buddy.clubs.includes(c));
    sharedClubs.forEach(c => { score += 15; reasons.push(`Both in ${c}`); });

    const sharedEvents = (user.events || []).filter(e => buddy.events.includes(e));
    sharedEvents.forEach(e => { score += 20; reasons.push(`Both interested in ${e}`); });

    if (user.zone === buddy.zone) { score += 15; reasons.push("Same campus zone"); }
    if (user.walkingStyle === buddy.walkingStyle) { score += 10; reasons.push(`Both prefer ${buddy.walkingStyle.toLowerCase()} walks`); }

    const percent = Math.min(98, Math.max(35, score));
    return { percent, reasons };
}

export function renderMatchCard() {
    const area = document.getElementById('match-card-area');
    if (!area) return;

    if (currentMatchIndex >= buddyProfiles.length) {
        area.innerHTML = `
            <div class="gradient-card p-8 rounded-3xl text-center space-y-2">
                <i data-lucide="users" class="w-8 h-8 text-neonPink mx-auto"></i>
                <p class="text-sm font-bold text-white">No more profiles right now</p>
                <p class="text-xs text-slate-400">Check back later for more buddy matches!</p>
                <button onclick="resetMatches()" class="text-xs font-bold text-neonPink hover:underline mt-2">Start Over</button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    const buddy = buddyProfiles[currentMatchIndex];
    const { percent, reasons } = calcBuddyMatch(appState.user, buddy);

    area.innerHTML = `
        <div class="gradient-card p-5 rounded-3xl shadow-neon-purple border border-neonPink/30 space-y-4">
            <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-2xl animal-avatar-box flex items-center justify-center text-3xl">${buddy.avatar}</div>
                <div>
                    <h3 class="text-lg font-black text-white">${buddy.name}</h3>
                    <p class="text-xs text-slate-300">${buddy.year} • ${buddy.major}</p>
                    <span class="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><i data-lucide="badge-check" class="w-3 h-3"></i> GSU Verified</span>
                </div>
            </div>

            <div class="flex items-center gap-1.5 text-xs text-slate-300">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-neonPink"></i> Usually around ${buddy.zone}
            </div>

            <div class="flex flex-wrap gap-1.5">
                ${buddy.interests.map(i => `<span class="text-[10px] bg-black/40 border border-white/10 px-2 py-1 rounded-full text-slate-200">${i}</span>`).join('')}
            </div>

            <div class="text-xs text-slate-300">
                <span class="font-bold text-white block mb-1">Clubs</span>
                ${buddy.clubs.join(' • ')}
            </div>

            <div class="text-xs text-slate-300">
                <span class="font-bold text-white block mb-1">Interested in</span>
                ${buddy.events.join(' • ')}
            </div>

            <div class="text-xs text-slate-300">
                <span class="font-bold text-white block mb-1">Looking for</span>
                ${buddy.lookingFor.join(' • ')}
            </div>

            <div class="gradient-brand p-3 rounded-2xl space-y-1.5">
                <span class="text-sm font-black text-white">${percent}% Buddy Match</span>
                <div class="text-[11px] text-white/90 space-y-0.5">
                    ${reasons.map(r => `<div>✓ ${r}</div>`).join('')}
                </div>
            </div>

            <div class="flex gap-3 pt-1">
                <button onclick="skipBuddy()" class="flex-1 bg-white/10 border border-white/20 text-white font-black py-3 rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2">
                    <i data-lucide="x" class="w-4 h-4"></i> Skip
                </button>
                <button onclick="connectWithBuddy()" class="flex-1 gradient-brand text-white font-black py-3 rounded-2xl shadow-neon-pink hover:opacity-95 transition flex items-center justify-center gap-2">
                    <i data-lucide="heart" class="w-4 h-4"></i> Connect
                </button>
            </div>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}

export function skipBuddy() {
    currentMatchIndex++;
    renderMatchCard();
}

export function resetMatches() {
    currentMatchIndex = 0;
    renderMatchCard();
}

export async function connectWithBuddy() {
    const buddy = buddyProfiles[currentMatchIndex];
    if (!buddy) return;

    if (buddy.likedYou) {
        const alreadyMatched = matchedBuddies.find(b => b.name === buddy.name);
        if (!alreadyMatched && matchedBuddies.length >= 5) {
            showToast("Buddy Limit Reached", "You can only match with 5 buddies at once. Remove an old chat to match with someone new.");
            currentMatchIndex++;
            renderMatchCard();
            return;
        }

        if (!alreadyMatched) {
            matchedBuddies.push(buddy);
            renderConversationList();

            if (backendEnabled) {
                try {
                    const { created } = await apiPost('/matches', { buddy_name: buddy.name });
                    if (created) {
                        await postAsBuddy(buddyRoom(buddy.name), {
                            text: "Hey! Excited to be your buddy 😊",
                            name: buddy.name,
                            avatar: buddy.avatar
                        });
                    }
                } catch (err) {
                    console.warn('Herbuddy: failed to persist buddy match.', err);
                }
            }
        }

        const { reasons } = calcBuddyMatch(appState.user, buddy);
        document.getElementById('mutual-match-text').innerHTML = `You and ${buddy.name.split(' ')[0]} have a lot in common.<br><br>${reasons.slice(0, 3).map(r => `✓ ${r}`).join('<br>')}`;
        document.getElementById('mutual-match-modal').dataset.buddyName = buddy.name;
        openMutualMatchModal();
    } else {
        showToast("Buddy Request Sent!", `${buddy.name} will be notified. You'll see them here if they connect back.`);
        currentMatchIndex++;
        renderMatchCard();
    }
}

export function openMutualMatchModal() {
    document.getElementById('mutual-match-modal').classList.remove('opacity-0', 'pointer-events-none');
}

export function closeMutualMatchModal() {
    document.getElementById('mutual-match-modal').classList.add('opacity-0', 'pointer-events-none');
    currentMatchIndex++;
    renderMatchCard();
}

export function planWalkWithMatch() {
    closeMutualMatchModal();
    showToast("Let's Plan a Walk!", "Pick your route and meeting point below.");
    switchTab('create');
}

export function openChatWithMatchedBuddy() {
    const buddyName = document.getElementById('mutual-match-modal').dataset.buddyName;
    closeMutualMatchModal();
    switchToBuddyChat(buddyName);
    switchTab('chat');
}

export function switchToBuddyChat(buddyName) {
    const buddy = matchedBuddies.find(b => b.name === buddyName);
    if (!buddy) return;
    activeChatBuddy = buddy;
    setActiveRoom(buddyRoom(buddy.name));

    document.getElementById('chat-header-avatar').innerText = buddy.avatar;
    document.getElementById('chat-header-name').innerText = buddy.name;
    document.getElementById('chat-header-status').innerText = 'Active now';
    const removeBtn = document.getElementById('chat-remove-btn');
    removeBtn.classList.remove('hidden');
    removeBtn.innerText = 'Remove';
    removeBtn.onclick = removeCurrentMatchedBuddy;
    document.getElementById('chat-encrypted-badge').classList.add('hidden');

    renderConversationList();
}

export function switchToGroupChat() {
    activeChatBuddy = null;
    setActiveRoom('main-quad');

    document.getElementById('chat-header-avatar').innerText = '🌸';
    document.getElementById('chat-header-name').innerText = 'Main Quad Evening Walkers';
    document.getElementById('chat-header-status').innerText = '4 members active';
    document.getElementById('chat-remove-btn').classList.add('hidden');
    document.getElementById('chat-encrypted-badge').classList.remove('hidden');

    renderConversationList();
}

export async function removeCurrentMatchedBuddy() {
    if (!activeChatBuddy) return;
    const name = activeChatBuddy.name;

    matchedBuddies = matchedBuddies.filter(b => b.name !== name);

    if (backendEnabled) {
        try {
            await apiDelete(`/matches/${encodeURIComponent(name)}`);
        } catch (err) {
            console.warn('Herbuddy: failed to remove matched buddy.', err);
        }
    }

    if (matchedBuddies.length > 0) {
        switchToBuddyChat(matchedBuddies[0].name);
    } else {
        switchToGroupChat();
    }

    showToast("Chat Removed", `${name.split(' ')[0]} removed. You can match with someone new now.`);
}

function renderConversationList() {
    const listEl = document.getElementById('conversation-list');
    if (!listEl) return;

    if (matchedBuddies.length === 0) {
        listEl.classList.add('hidden');
        return;
    }
    listEl.classList.remove('hidden');

    listEl.innerHTML = matchedBuddies.map(b => `
        <button onclick="switchToBuddyChat('${b.name.replace(/'/g, "\\'")}')" class="flex flex-col items-center gap-1 flex-shrink-0 ${activeChatBuddy && activeChatBuddy.name === b.name ? 'opacity-100' : 'opacity-60'}">
            <div class="w-10 h-10 rounded-full animal-avatar-box flex items-center justify-center text-lg ${activeChatBuddy && activeChatBuddy.name === b.name ? 'ring-2 ring-neonPink' : ''}">${b.avatar}</div>
            <span class="text-[9px] font-bold text-slate-300">${b.name.split(' ')[0]}</span>
        </button>
    `).join('');
}
