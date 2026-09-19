import { backendEnabled } from './api-config.js';
import { apiGet, apiPost } from './api.js';
import { appState } from './state.js';
import { escapeHtml } from './utils.js';

const POLL_INTERVAL_MS = 3000;
let pollHandle = null;

export function subscribeToChat() {
    if (!backendEnabled) return;
    if (pollHandle) clearInterval(pollHandle);

    refreshChat();
    pollHandle = setInterval(refreshChat, POLL_INTERVAL_MS);
}

async function refreshChat() {
    try {
        const messages = await apiGet('/chat/messages');
        renderChatMessages(messages);
    } catch (err) {
        console.warn('Herbuddy: failed to refresh chat from the API.', err);
    }
}

function renderChatMessages(messages) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = messages.map(m => {
        const timeStr = m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';
        return m.uid === appState.userId ? outgoingBubble(m, timeStr) : incomingBubble(m, timeStr);
    }).join('');

    container.scrollTop = container.scrollHeight;
}

function incomingBubble(m, timeStr) {
    return `
        <div class="flex items-start gap-2">
            <div class="w-6 h-6 rounded-full bg-purple-900 border border-neonPink flex items-center justify-center text-xs flex-shrink-0">${m.avatar || '👩'}</div>
            <div class="bg-black/50 p-2.5 rounded-2xl rounded-tl-none border border-white/10 space-y-0.5 max-w-[80%]">
                <span class="text-[9px] font-bold text-neonPink block">${escapeHtml(m.name || 'Campus Buddy')}</span>
                <p class="text-slate-200">${escapeHtml(m.text || '')}</p>
                <span class="text-[8px] text-slate-500 block text-right">${timeStr}</span>
            </div>
        </div>
    `;
}

function outgoingBubble(m, timeStr) {
    return `
        <div class="flex items-start gap-2 justify-end">
            <div class="gradient-brand p-2.5 rounded-2xl rounded-tr-none text-white space-y-0.5 max-w-[80%] shadow-neon-pink">
                <span class="text-[9px] font-bold text-pink-200 block">You (${escapeHtml(m.name || '')} ${m.avatar || ''})</span>
                <p class="text-white">${escapeHtml(m.text || '')}</p>
                <span class="text-[8px] text-white/70 block text-right">${timeStr}</span>
            </div>
            <div class="w-6 h-6 rounded-full animal-avatar-box flex items-center justify-center text-xs flex-shrink-0 shadow">${m.avatar || ''}</div>
        </div>
    `;
}

function appendLocalMessage(msg) {
    const container = document.getElementById('chat-messages-container');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    container.innerHTML += outgoingBubble({ name: appState.user.name.split(' ')[0], avatar: appState.user.avatar, text: msg }, timeStr);
    container.scrollTop = container.scrollHeight;
}

export async function handleSendChatMessage(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chat-input-text');
    const msg = input.value.trim();
    if (!msg) return;

    if (backendEnabled) {
        try {
            await apiPost('/chat/messages', {
                text: msg,
                name: appState.user.name.split(' ')[0],
                avatar: appState.user.avatar
            });
            input.value = '';
            refreshChat(); // don't wait for the next poll tick
            return;
        } catch (err) {
            console.warn('Herbuddy: failed to send message to the API, appending locally.', err);
        }
    }

    appendLocalMessage(msg);
    input.value = '';
}
