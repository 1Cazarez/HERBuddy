import { backendEnabled } from './api-config.js';
import { loginWithAuth0, logoutAuth0, handleAuthRedirect, getAuth0User } from './auth0-client.js';
import { apiGet, apiPut } from './api.js';
import { appState } from './state.js';
import { syncStateToUI } from './profile.js';
import { switchTab } from './navigation.js';
import { showToast } from './utils.js';
import { subscribeToChat } from './chat.js';
import { subscribeToWalks } from './walks.js';
import { subscribeToErrands } from './errands.js';
import { initMatches } from './match.js';

// Local demo-mode login — used only when Auth0/TigerData aren't configured.
export function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const enteredName = document.getElementById('login-name').value.trim();
    if (enteredName) {
        appState.user.name = enteredName;
    }
    appState.isLoggedIn = true;
    completeLogin();
}

// Real login — redirects the whole page to Auth0's Universal Login.
export async function loginWithAuth0AndProceed() {
    await loginWithAuth0();
}

function completeLogin() {
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('device-header').classList.remove('hidden');
    document.getElementById('device-header').classList.add('flex');
    document.getElementById('device-nav').classList.remove('hidden');
    document.getElementById('device-nav').classList.add('flex');

    syncStateToUI();
    switchTab('home');
    showToast("Welcome to Herbuddy!", `Logged in as ${appState.user.name}!`);

    if (backendEnabled) {
        subscribeToChat();
        subscribeToWalks();
        subscribeToErrands();
        initMatches();
    }
}

export async function logoutToLoginScreen() {
    appState.isLoggedIn = false;
    document.getElementById('device-header').classList.add('hidden');
    document.getElementById('device-header').classList.remove('flex');
    document.getElementById('device-nav').classList.add('hidden');
    document.getElementById('device-nav').classList.remove('flex');

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById('screen-login').classList.remove('hidden');
    showToast("Logged Out", "Returned to login popup screen.");

    if (backendEnabled) {
        await logoutAuth0(); // redirects away
    }
}

function applyProfile(profile) {
    Object.assign(appState.user, {
        name: profile.name,
        email: profile.email,
        campus: profile.campus,
        contact: profile.contact,
        stepGoal: profile.step_goal,
        avatar: profile.avatar,
        steps: profile.steps,
        activeMinutes: profile.active_minutes,
        weeklyDistance: profile.weekly_distance,
        completedErrands: profile.completed_errands,
        year: profile.year || appState.user.year,
        major: profile.major || appState.user.major,
        interests: profile.interests || appState.user.interests,
        clubs: profile.clubs || appState.user.clubs,
        events: profile.events || appState.user.events,
        zone: profile.zone || appState.user.zone,
        walkingStyle: profile.walking_style || appState.user.walkingStyle
    });
}

function showProfileSetupStep(email) {
    const signinStep = document.getElementById('auth-step-signin');
    const profileStep = document.getElementById('auth-step-profile');
    if (signinStep) signinStep.classList.add('hidden');
    if (profileStep) profileStep.classList.remove('hidden');
    const verifiedEl = document.getElementById('auth-verified-email');
    if (verifiedEl) verifiedEl.innerText = `Verified: ${email}`;
    if (window.lucide) lucide.createIcons();
}

// Submits the Year/Major onboarding step shown after a verified Auth0
// sign-in whose profile doesn't have them yet, then enters the app.
export async function completeProfileSetup(e) {
    if (e) e.preventDefault();
    appState.user.year = document.getElementById('login-year').value;
    appState.user.major = document.getElementById('login-major').value;

    if (backendEnabled && appState.userId) {
        try {
            await apiPut('/me', { year: appState.user.year, major: appState.user.major });
        } catch (err) {
            console.warn('Herbuddy: failed to save onboarding profile fields.', err);
        }
    }

    appState.isLoggedIn = true;
    completeLogin();
}

// Called once on page load. If Auth0/TigerData are configured and the user
// is already signed in (or just landed back from the login redirect), skips
// straight past the login screen into the app.
export async function initAuthListener() {
    if (!backendEnabled) return;

    await handleAuthRedirect();
    const user = await getAuth0User();
    if (!user) return;

    appState.userId = user.sub;
    appState.user.name = user.name || user.nickname || appState.user.name;
    appState.user.email = user.email || appState.user.email;

    let profile = null;
    try {
        profile = await apiGet('/me'); // backend creates the row on first call
        applyProfile(profile);

        // The access token used to authenticate that call doesn't carry
        // profile claims (only the ID token, which stays client-side), so a
        // brand-new row comes back with placeholder name/email. Backfill it
        // once from what Auth0 told us directly.
        if (!profile.email && user.email) {
            profile = await apiPut('/me', { name: user.name || user.nickname, email: user.email });
            applyProfile(profile);
        }
    } catch (err) {
        console.warn('Herbuddy: failed to load profile from the API, using Auth0 profile only.', err);
    }

    // First-time sign-ins (or ones from before this field existed) still
    // need Year/Major before entering the app.
    if (profile && (!profile.year || !profile.major)) {
        showProfileSetupStep(user.email || appState.user.email);
        return;
    }

    appState.isLoggedIn = true;
    completeLogin();
}
