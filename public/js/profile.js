import { backendEnabled } from './api-config.js';
import { apiPut } from './api.js';
import { appState } from './state.js';
import { showToast } from './utils.js';
import { highlightActiveSwatch } from './theme.js';
import { resetMatches } from './match.js';

export function syncStateToUI() {
    const u = appState.user;

    document.getElementById('home-user-name').innerText = u.name.split(' ')[0];
    document.getElementById('home-campus-tag').innerText = u.campus;
    document.getElementById('home-user-avatar-emoji').innerText = u.avatar;
    document.getElementById('home-user-avatar-icon').innerText = u.avatar;
    document.getElementById('home-step-count').innerText = u.steps.toLocaleString();
    document.getElementById('home-mins-count').innerText = u.activeMinutes;
    document.getElementById('home-errand-count').innerText = u.completedErrands;
    document.getElementById('home-emergency-contact-display').innerText = u.contact.split('-')[0] || u.contact;

    // Wellness tab sync
    document.getElementById('wellness-steps-count').innerText = u.steps.toLocaleString();
    document.getElementById('wellness-mins-count').innerText = u.activeMinutes;
    document.getElementById('wellness-errands-count').innerText = u.completedErrands;
    document.getElementById('wellness-step-val').innerText = `${u.steps.toLocaleString()} / ${u.stepGoal.toLocaleString()}`;
    document.getElementById('wellness-emergency-name').innerText = u.contact;

    const wellnessPct = Math.min(100, Math.round((u.steps / u.stepGoal) * 100));
    document.getElementById('wellness-step-progress-bar').style.width = `${wellnessPct}%`;
    document.getElementById('wellness-weekly-pct').innerText = `${wellnessPct}% Goal Met`;

    document.getElementById('profile-card-emoji').innerText = u.avatar;
    document.getElementById('profile-card-name').innerText = u.name;
    document.getElementById('profile-card-role').innerText = `Email: ${u.email} • ${u.campus}`;
    document.getElementById('profile-step-val').innerText = `${u.steps.toLocaleString()} / ${u.stepGoal.toLocaleString()}`;
    document.getElementById('weekly-dist').innerText = `${u.weeklyDistance} mi`;
    document.getElementById('completed-errands-count').innerText = u.completedErrands;
    document.getElementById('profile-emergency-name').innerText = u.contact;

    const pct = Math.min(100, Math.round((u.steps / u.stepGoal) * 100));
    document.getElementById('step-progress-bar').style.width = `${pct}%`;
    document.getElementById('profile-weekly-pct').innerText = `${pct}% Goal Met`;

    document.getElementById('active-errand-carrier-emoji').innerText = u.avatar;
    document.getElementById('active-errand-carrier').innerText = u.name.split(' ')[0];

    const mapMarkerEmoji = document.getElementById('find-map-avatar-marker');
    if (mapMarkerEmoji) mapMarkerEmoji.innerText = u.avatar;
}

export function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');

    document.getElementById('edit-name').value = appState.user.name;
    document.getElementById('edit-email').value = appState.user.email;
    document.getElementById('edit-campus').value = appState.user.campus;
    document.getElementById('edit-contact').value = appState.user.contact;
    document.getElementById('edit-stepgoal').value = appState.user.stepGoal;
    document.getElementById('modal-avatar-preview').innerText = appState.user.avatar;

    document.getElementById('edit-year').value = appState.user.year || 'Freshman';
    document.getElementById('edit-major').value = appState.user.major || '';
    document.getElementById('edit-interests').value = (appState.user.interests || []).join(', ');
    document.getElementById('edit-clubs').value = (appState.user.clubs || []).join(', ');
    document.getElementById('edit-events').value = (appState.user.events || []).join(', ');
    document.getElementById('edit-zone').value = appState.user.zone || 'Library Area';
    document.getElementById('edit-walkingstyle').value = appState.user.walkingStyle || 'Social';

    highlightActiveSwatch();
}

export function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

export function selectEditAvatar(emoji) {
    appState.user.avatar = emoji;
    document.getElementById('modal-avatar-preview').innerText = emoji;
}

export async function saveProfileEdits(e) {
    if (e) e.preventDefault();
    appState.user.name = document.getElementById('edit-name').value;
    appState.user.email = document.getElementById('edit-email').value;
    appState.user.campus = document.getElementById('edit-campus').value;
    appState.user.contact = document.getElementById('edit-contact').value;
    appState.user.stepGoal = parseInt(document.getElementById('edit-stepgoal').value) || 10000;

    appState.user.year = document.getElementById('edit-year').value;
    appState.user.major = document.getElementById('edit-major').value;
    appState.user.interests = document.getElementById('edit-interests').value.split(',').map(s => s.trim()).filter(Boolean);
    appState.user.clubs = document.getElementById('edit-clubs').value.split(',').map(s => s.trim()).filter(Boolean);
    appState.user.events = document.getElementById('edit-events').value.split(',').map(s => s.trim()).filter(Boolean);
    appState.user.zone = document.getElementById('edit-zone').value;
    appState.user.walkingStyle = document.getElementById('edit-walkingstyle').value;

    syncStateToUI();
    resetMatches();
    closeEditProfileModal();
    showToast("Profile Updated!", "App profile details successfully saved.");

    if (backendEnabled && appState.userId) {
        try {
            await apiPut('/me', {
                name: appState.user.name,
                email: appState.user.email,
                campus: appState.user.campus,
                contact: appState.user.contact,
                step_goal: appState.user.stepGoal,
                avatar: appState.user.avatar,
                year: appState.user.year,
                major: appState.user.major,
                interests: appState.user.interests,
                clubs: appState.user.clubs,
                events: appState.user.events,
                zone: appState.user.zone,
                walking_style: appState.user.walkingStyle
            });
        } catch (err) {
            console.warn('Herbuddy: failed to sync profile to the API.', err);
        }
    }
}
