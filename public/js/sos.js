import { appState } from './state.js';
import { showToast } from './utils.js';

export function triggerEmergencyCheckInTest() {
    playSnsAudioAlert();
    showToast("🛡️ SOS Ping Triggered", `Emergency alert sent to ${appState.user.contact}.`);
}

export function playSnsAudioAlert() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const now = ctx.currentTime;

        for (let i = 0; i < 3; i++) {
            const startTime = now + (i * 0.4);

            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'square';

            osc1.frequency.setValueAtTime(600, startTime);
            osc1.frequency.linearRampToValueAtTime(1200, startTime + 0.2);
            osc1.frequency.linearRampToValueAtTime(600, startTime + 0.4);

            osc2.frequency.setValueAtTime(605, startTime);
            osc2.frequency.linearRampToValueAtTime(1205, startTime + 0.2);
            osc2.frequency.linearRampToValueAtTime(605, startTime + 0.4);

            gain.gain.setValueAtTime(0.6, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.38);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + 0.38);
            osc2.stop(startTime + 0.38);
        }
    } catch (err) {
        console.warn("AudioContext note playback blocked or not supported", err);
    }
}
