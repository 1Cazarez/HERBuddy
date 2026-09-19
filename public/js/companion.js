import { API_BASE_URL } from './api-config.js';

// Agent IDs live only in the backend's env vars (same pattern as the Google
// Maps key in map.js) — fetched once here rather than hardcoded in source.
let companionAgents = { friend: null, grandma: null };
let widgetScriptLoaded = false;

fetch(`${API_BASE_URL}/config`)
    .then(res => res.json())
    .then(({ companionAgents: agents }) => {
        if (agents) companionAgents = agents;
    })
    .catch(err => console.warn('Herbuddy: failed to load Walking Companion config from the API.', err));

function ensureWidgetScriptLoaded() {
    if (widgetScriptLoaded) return;
    widgetScriptLoaded = true;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    document.head.appendChild(script);
}

const personaMeta = {
    friend: { label: 'Friend', emoji: '🦊' },
    grandma: { label: 'Grandma', emoji: '👵' }
};

export function openCompanionModal() {
    const modal = document.getElementById('sos-voice-modal');
    document.getElementById('companion-picker-screen').classList.remove('hidden');
    document.getElementById('companion-call-screen').classList.add('hidden');
    document.getElementById('convai-widget-container').innerHTML = '';
    modal.classList.remove('opacity-0', 'pointer-events-none');
    if (window.lucide) lucide.createIcons();
}

export function closeCompanionModal() {
    const modal = document.getElementById('sos-voice-modal');
    document.getElementById('convai-widget-container').innerHTML = '';
    modal.classList.add('opacity-0', 'pointer-events-none');
}

export function startCompanionCall(personaKey) {
    const agentId = companionAgents[personaKey];
    const meta = personaMeta[personaKey];
    if (!agentId) {
        console.warn(`Herbuddy: no ElevenLabs agent ID configured for "${personaKey}" — Walking Companion will stay blank.`);
    }

    ensureWidgetScriptLoaded();

    document.getElementById('companion-picker-screen').classList.add('hidden');
    document.getElementById('companion-call-screen').classList.remove('hidden');
    document.getElementById('companion-call-emoji').innerText = meta.emoji;
    document.getElementById('companion-call-title').innerText = meta.label;

    const container = document.getElementById('convai-widget-container');
    container.innerHTML = agentId
        ? `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`
        : '<p class="text-xs text-slate-500 text-center">Walking Companion isn\'t set up yet — ask your team to add the ElevenLabs agent IDs.</p>';
}
