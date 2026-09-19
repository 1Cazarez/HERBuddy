import { appState } from './state.js';

let ringInterval = null;
let timerInterval = null;
let seconds = 0;

function playRingTone() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
    } catch (err) {
        // AudioContext blocked/unsupported — silently skip the ring tone.
    }
}

export function openFakeCallModal() {
    const modal = document.getElementById('fake-call-modal');
    document.getElementById('fake-call-incoming').classList.remove('hidden');
    document.getElementById('fake-call-active').classList.add('hidden');
    document.getElementById('fake-call-name').innerText = appState.user.contact.split('(')[0].trim() || 'Mom';
    modal.classList.remove('opacity-0', 'pointer-events-none');
    if (window.lucide) lucide.createIcons();

    ringInterval = setInterval(playRingTone, 1800);
}

export function declineFakeCall() {
    clearInterval(ringInterval);
    document.getElementById('fake-call-modal').classList.add('opacity-0', 'pointer-events-none');
}

export function answerFakeCall() {
    clearInterval(ringInterval);
    document.getElementById('fake-call-incoming').classList.add('hidden');
    document.getElementById('fake-call-active').classList.remove('hidden');
    document.getElementById('fake-call-name-active').innerText = appState.user.contact.split('(')[0].trim() || 'Mom';

    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        document.getElementById('fake-call-timer').innerText = `${m}:${s}`;
    }, 1000);
}

export function endFakeCall() {
    clearInterval(timerInterval);
    document.getElementById('fake-call-modal').classList.add('opacity-0', 'pointer-events-none');
}
