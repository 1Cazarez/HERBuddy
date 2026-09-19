// Bootstraps the app: registers all page/component custom elements, wires
// their inline onclick/onsubmit handlers onto window, and kicks off the
// initial render + Auth0 session check once the DOM is ready.
import './components/toast.js';
import './components/device-header.js';
import './components/active-walk-banner.js';
import './components/login-screen.js';
import './components/tab-home.js';
import './components/tab-find.js';
import './components/tab-wellness.js';
import './components/tab-chat.js';
import './components/tab-create.js';
import './components/tab-pickup.js';
import './components/tab-profile.js';
import './components/nav-bar.js';
import './components/edit-profile-modal.js';
import './components/errand-modal.js';

import { showToast, hideToast, updateClock } from './utils.js';
import { switchTab } from './navigation.js';
import { handleLoginSubmit, loginWithAuth0AndProceed, logoutToLoginScreen, initAuthListener } from './auth.js';
import { openEditProfileModal, closeEditProfileModal, selectEditAvatar, saveProfileEdits } from './profile.js';
import { handleSendChatMessage } from './chat.js';
import {
    renderWalkList,
    setFilter,
    joinWalkFromList,
    checkRouteMatches,
    handleCreateWalk,
    quickJoinSuggestedRoute,
    triggerArrivalCheckIn,
    simulateFindMapMove
} from './walks.js';
import {
    renderErrandList,
    acceptErrandRequest,
    openNewErrandModal,
    closeNewErrandModal,
    submitNewErrand
} from './errands.js';
import { triggerEmergencyCheckInTest } from './sos.js';

Object.assign(window, {
    switchTab,
    handleLoginSubmit, loginWithAuth0AndProceed, logoutToLoginScreen,
    openEditProfileModal, closeEditProfileModal, selectEditAvatar, saveProfileEdits,
    handleSendChatMessage,
    renderWalkList, setFilter, joinWalkFromList, checkRouteMatches, handleCreateWalk,
    quickJoinSuggestedRoute, triggerArrivalCheckIn, simulateFindMapMove,
    renderErrandList, acceptErrandRequest, openNewErrandModal, closeNewErrandModal, submitNewErrand,
    triggerEmergencyCheckInTest,
    showToast, hideToast
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
    renderWalkList();
    renderErrandList();
    updateClock();
    setInterval(updateClock, 30000);
    initAuthListener();
});
