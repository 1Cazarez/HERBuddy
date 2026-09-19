import { backendEnabled } from './api-config.js';
import { apiGet, apiPost, apiDelete } from './api.js';
import { appState } from './state.js';
import { showToast, escapeHtml } from './utils.js';
import { switchTab } from './navigation.js';
import { friendRoom, setActiveRoom } from './chat.js';

const POLL_INTERVAL_MS = 10000;
let pollHandle = null;
let friends = [];
let activeChatFriend = null;

export function subscribeToFriends() {
    if (!backendEnabled) return;
    if (pollHandle) clearInterval(pollHandle);

    refreshFriends();
    pollHandle = setInterval(refreshFriends, POLL_INTERVAL_MS);
}

async function refreshFriends() {
    try {
        friends = await apiGet('/friends');
        renderFriendsList();
    } catch (err) {
        console.warn('Herbuddy: failed to refresh friends from the API.', err);
    }
}

function friendStatus(friend) {
    if (!friend.expected_arrival_at || friend.arrived_at) {
        return { label: 'Not walking', tone: 'idle' };
    }
    const expected = new Date(friend.expected_arrival_at).getTime();
    const isOverdue = Date.now() > expected;
    return isOverdue
        ? { label: `⚠️ Overdue — heading to ${friend.destination}`, tone: 'overdue' }
        : { label: `🟢 Walking to ${friend.destination}`, tone: 'walking' };
}

export function switchMatchView(view) {
    const showFriends = view === 'friends';
    document.getElementById('match-view-discover').classList.toggle('hidden', showFriends);
    document.getElementById('match-view-friends').classList.toggle('hidden', !showFriends);

    const btnDiscover = document.getElementById('match-view-btn-discover');
    const btnFriends = document.getElementById('match-view-btn-friends');
    btnDiscover.classList.toggle('gradient-brand', !showFriends);
    btnDiscover.classList.toggle('text-white', !showFriends);
    btnDiscover.classList.toggle('text-slate-400', showFriends);
    btnFriends.classList.toggle('gradient-brand', showFriends);
    btnFriends.classList.toggle('text-white', showFriends);
    btnFriends.classList.toggle('text-slate-400', !showFriends);

    if (showFriends) renderFriendsList();
}

export function renderFriendsList() {
    const container = document.getElementById('friends-list-container');
    if (!container) return;

    if (!backendEnabled) {
        container.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">Friends need the backend connected — this stays local-demo-only otherwise.</p>`;
        return;
    }

    if (friends.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">No friends added yet. Add one by their Herbuddy email above.</p>`;
        return;
    }

    container.innerHTML = friends.map(f => {
        const { label, tone } = friendStatus(f);
        const toneClasses = tone === 'overdue'
            ? 'text-rose-300 bg-rose-950/60 border-rose-500/40'
            : tone === 'walking'
                ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                : 'text-slate-400 bg-black/40 border-white/10';

        return `
        <div class="gradient-card p-3 rounded-2xl flex items-center gap-3">
            <div class="w-10 h-10 rounded-full animal-avatar-box flex items-center justify-center text-lg flex-shrink-0">${f.avatar || '👩'}</div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-white truncate">${escapeHtml(f.name)}</p>
                <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${toneClasses}">${label}</span>
            </div>
            <div class="flex flex-col gap-1.5 flex-shrink-0">
                ${tone === 'overdue' ? `<button onclick="checkInOnFriend('${f.id}')" class="text-[10px] bg-rose-600 text-white font-black px-2.5 py-1 rounded-lg hover:bg-rose-500 transition">Check In</button>` : ''}
                <button onclick="openFriendChat('${f.id}')" class="text-[10px] bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold px-2.5 py-1 rounded-lg hover:bg-sky-500/30 transition">Message</button>
            </div>
        </div>
        `;
    }).join('');
}

export async function addFriendByEmail(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('add-friend-email');
    const email = input.value.trim();
    if (!email) return;

    if (!backendEnabled) {
        showToast("Not Connected", "Friends require the live backend, which isn't reachable right now.");
        return;
    }

    try {
        const friend = await apiPost('/friends', { email });
        input.value = '';
        showToast("Friend Added!", `You and ${friend.name} are now Herbuddy friends.`);
        refreshFriends();
    } catch (err) {
        console.warn('Herbuddy: failed to add friend.', err);
        showToast("Couldn't Add Friend", "No Herbuddy account found with that email.");
    }
}

export async function removeFriend(friendId) {
    if (!backendEnabled) return;
    try {
        await apiDelete(`/friends/${encodeURIComponent(friendId)}`);
        if (activeChatFriend && activeChatFriend.id === friendId) {
            activeChatFriend = null;
            switchTab('match');
        }
        showToast("Friend Removed", "");
        refreshFriends();
    } catch (err) {
        console.warn('Herbuddy: failed to remove friend.', err);
    }
}

export async function checkInOnFriend(friendId) {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    try {
        await apiPost('/chat/messages', {
            room: friendRoom(friendId),
            text: `🚨 Checking in — you're overdue on your walk to ${friend.destination}. Are you okay?`,
            name: appState.user.name.split(' ')[0],
            avatar: appState.user.avatar
        });
        showToast("Check-in Sent", `${friend.name} will see your message.`);
    } catch (err) {
        console.warn('Herbuddy: failed to send check-in message.', err);
    }
    openFriendChat(friendId);
}

export function openFriendChat(friendId) {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    activeChatFriend = friend;
    setActiveRoom(friendRoom(friendId));

    document.getElementById('chat-header-avatar').innerText = friend.avatar || '👩';
    document.getElementById('chat-header-name').innerText = friend.name;
    document.getElementById('chat-header-status').innerText = 'Friend';
    document.getElementById('chat-encrypted-badge').classList.add('hidden');

    const removeBtn = document.getElementById('chat-remove-btn');
    removeBtn.classList.remove('hidden');
    removeBtn.innerText = 'Unfriend';
    removeBtn.onclick = () => removeFriend(friend.id);

    switchTab('chat');
}
