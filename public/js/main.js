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
import './components/tab-match.js';
import './components/mutual-match-modal.js';
import './components/fake-call-modal.js';
import './components/report-modal.js';

import { showToast, hideToast, updateClock } from './utils.js';
import { switchTab } from './navigation.js';
import { handleLoginSubmit, loginWithAuth0AndProceed, completeProfileSetup, logoutToLoginScreen, initAuthListener } from './auth.js';
import { openEditProfileModal, closeEditProfileModal, selectEditAvatar, saveProfileEdits } from './profile.js';
import { handleSendChatMessage } from './chat.js';
import {
    renderWalkList,
    setFilter,
    joinWalkFromList,
    checkRouteMatches,
    handleCreateWalk,
    quickJoinSuggestedRoute,
    triggerArrivalCheckIn
} from './walks.js';
import {
    renderErrandList,
    acceptErrandRequest,
    openNewErrandModal,
    closeNewErrandModal,
    submitNewErrand,
    setPickupMode,
    submitPickupRequest,
    acceptPickupRequest,
    markPickupCollected,
    markPickupDelivered,
    renderPickupRequestList
} from './errands.js';
import { triggerEmergencyCheckInTest } from './sos.js';
import { initTheme, selectTheme } from './theme.js';
import { updateRouteEstimate, simulateFindMapMove } from './map.js';
import {
    renderMatchCard,
    skipBuddy,
    resetMatches,
    connectWithBuddy,
    closeMutualMatchModal,
    planWalkWithMatch,
    openChatWithMatchedBuddy,
    switchToBuddyChat,
    switchToGroupChat,
    removeCurrentMatchedBuddy
} from './match.js';
import { openFakeCallModal, declineFakeCall, answerFakeCall, endFakeCall } from './fakecall.js';
import { openReportModal, closeReportModal, submitSafetyReport, renderSafetyReports } from './reports.js';

Object.assign(window, {
    switchTab,
    handleLoginSubmit, loginWithAuth0AndProceed, completeProfileSetup, logoutToLoginScreen,
    openEditProfileModal, closeEditProfileModal, selectEditAvatar, saveProfileEdits,
    handleSendChatMessage,
    renderWalkList, setFilter, joinWalkFromList, checkRouteMatches, handleCreateWalk,
    quickJoinSuggestedRoute, triggerArrivalCheckIn,
    renderErrandList, acceptErrandRequest, openNewErrandModal, closeNewErrandModal, submitNewErrand,
    setPickupMode, submitPickupRequest, acceptPickupRequest, markPickupCollected, markPickupDelivered,
    renderPickupRequestList,
    triggerEmergencyCheckInTest,
    showToast, hideToast,
    selectTheme,
    updateRouteEstimate, simulateFindMapMove,
    skipBuddy, resetMatches, connectWithBuddy, closeMutualMatchModal, planWalkWithMatch,
    openChatWithMatchedBuddy, switchToBuddyChat, switchToGroupChat, removeCurrentMatchedBuddy,
    openFakeCallModal, declineFakeCall, answerFakeCall, endFakeCall,
    openReportModal, closeReportModal, submitSafetyReport
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
    initTheme();
    renderWalkList();
    renderErrandList();
    renderPickupRequestList();
    setPickupMode('request');
    renderMatchCard();
    renderSafetyReports();
    updateClock();
    setInterval(updateClock, 30000);
    initAuthListener();
});
