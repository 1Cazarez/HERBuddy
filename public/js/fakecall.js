let ringInterval = null;
let timerInterval = null;
let seconds = 0;
let audioCtx = null;

// Browsers only allow audio to actually play if the AudioContext is
// created/resumed synchronously inside a user-gesture handler (the button
// click) — one created later inside a setInterval callback stays
// "suspended" and produces no sound at all on a real deployed site (even
// though it can seem to work locally with devtools' autoplay override).
// So we create/resume it once here, then just reuse it for every ring.
function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
}

function playRingTone() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
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
    document.getElementById('fake-call-name').innerText = 'MOM';
    modal.classList.remove('opacity-0', 'pointer-events-none');
    if (window.lucide) lucide.createIcons();

    getAudioContext(); // created/resumed here, inside the click's user gesture
    playRingTone();
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
    document.getElementById('fake-call-name-active').innerText = 'MOM';

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
