import { showToast } from './utils.js';

// Real GSU campus locations used for both the map markers and the
// origin/destination pickers on the Create Walk form.
export const GSU_CENTER = { lat: 33.7529, lng: -84.3856 };

export const gsuLocations = [
    { id: 1, name: "GSU Library", category: "study", emoji: "📚", lat: 33.7528152, lng: -84.3865632, floors: "4th Floor, 5th Floor, Study Commons (open till 2AM), private rooms (by reservation)", safetyNote: "Open till 11PM • 24/7 security" },
    { id: 2, name: "GSU Library South", category: "reading", emoji: "📖", lat: 33.7522861, lng: -84.3869648, floors: "Quiet reading floor", safetyNote: "Staffed help desk on-site" },
    { id: 3, name: "Student Center East", category: "social", emoji: "💬", lat: 33.7526653, lng: -84.3849037, floors: null, safetyNote: "High foot traffic • Campus police nearby" },
    { id: 4, name: "Piedmont Central Dining Hall", category: "food", emoji: "🍽️", lat: 33.7569173, lng: -84.3824292, floors: null, safetyNote: "Open 24/7 • Always staffed" },
    { id: 5, name: "55 Park Place (Andrew Young School)", category: "study", emoji: "📚", lat: 33.7560817, lng: -84.3874448, floors: "11th Floor, 12th Floor (nice view, quiet)", safetyNote: "Closes 5:15PM • Lobby security" },
    { id: 6, name: "Centennial Hall", category: "study", emoji: "📚", lat: 33.7558673, lng: -84.3837997, floors: "2nd Floor (Honors College)", safetyNote: "Closes 5PM • Central campus, busy area" },
    { id: 7, name: "Law Library", category: "study", emoji: "📚", lat: 33.7567693, lng: -84.3872065, floors: "3rd Floor, 5th Floor, 6th Floor", safetyNote: "Closes 5PM • ID required to enter" },
    { id: 8, name: "CMII (Creative Media Industries Institute)", category: "study", emoji: "📚", lat: 33.7547724, lng: -84.3881646, floors: "2nd Floor", safetyNote: "Open till 10PM • Staff on-site" },
    { id: 9, name: "Aderhold Learning Center", category: "study", emoji: "📚", lat: 33.7564148, lng: -84.388812, floors: "Concourse (Ground Floor)", safetyNote: "⚠️ Farther from central campus, near the park — go with a group at night" }
];

let googleMap = null;
let userMarker = null;
let walkRouteCoords = [];
let walkAnimationInterval = null;
let activeWalkPolyline = null;

export function calcDistanceMiles(a, b) {
    const R = 3958.8;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const d = 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return d.toFixed(1);
}

export function populateLocationSelects() {
    const originSelect = document.getElementById('input-origin');
    const destSelect = document.getElementById('input-destination');
    if (!originSelect || !destSelect) return;

    const optionsHtml = gsuLocations.map(loc => `<option value="${loc.id}">${loc.emoji} ${loc.name}</option>`).join('');
    originSelect.innerHTML = optionsHtml;
    destSelect.innerHTML = optionsHtml;

    originSelect.value = 3;
    destSelect.value = 1;
    updateRouteEstimate();
}

export function updateRouteEstimate() {
    const originId = parseInt(document.getElementById('input-origin').value, 10);
    const destId = parseInt(document.getElementById('input-destination').value, 10);
    const originLoc = gsuLocations.find(l => l.id === originId);
    const destLoc = gsuLocations.find(l => l.id === destId);
    if (!originLoc || !destLoc) return;

    const miles = calcDistanceMiles(originLoc, destLoc);
    const estMinutes = Math.max(3, Math.round(miles * 20));
    document.getElementById('input-distance').value = `${miles} miles (${estMinutes} min)`;

    const timeInput = document.getElementById('input-time');
    if (timeInput && !timeInput.dataset.userEdited) {
        const now = new Date();
        const hh = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        timeInput.value = `${hh}:${mm}`;
    }
}

export function startRealWalkTracking(originLoc, destLoc) {
    if (!googleMap) return;

    walkRouteCoords = [
        { lat: originLoc.lat, lng: originLoc.lng },
        { lat: destLoc.lat, lng: destLoc.lng }
    ];

    if (activeWalkPolyline) activeWalkPolyline.setMap(null);
    activeWalkPolyline = new google.maps.Polyline({
        path: walkRouteCoords,
        geodesic: true,
        strokeColor: "#FF2E93",
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map: googleMap
    });

    if (userMarker) userMarker.setMap(null);
    userMarker = new google.maps.Marker({
        position: walkRouteCoords[0],
        map: googleMap,
        label: { text: "🦊", fontSize: "18px" },
        title: "You"
    });

    if (walkAnimationInterval) clearInterval(walkAnimationInterval);
    const distMiles = parseFloat(calcDistanceMiles(originLoc, destLoc));
    let step = 0;
    const totalSteps = Math.max(60, Math.round(distMiles * 400));

    walkAnimationInterval = setInterval(() => {
        step++;
        const progress = step / totalSteps;

        if (progress >= 1) {
            userMarker.setPosition(walkRouteCoords[1]);
            googleMap.panTo(walkRouteCoords[1]);
            clearInterval(walkAnimationInterval);
            walkAnimationInterval = null;
            return;
        }

        const lat = walkRouteCoords[0].lat + (walkRouteCoords[1].lat - walkRouteCoords[0].lat) * progress;
        const lng = walkRouteCoords[0].lng + (walkRouteCoords[1].lng - walkRouteCoords[0].lng) * progress;
        userMarker.setPosition({ lat, lng });
        googleMap.panTo({ lat, lng });
    }, 150);
}

export function stopWalkTracking() {
    if (walkAnimationInterval) {
        clearInterval(walkAnimationInterval);
        walkAnimationInterval = null;
    }
}

export function simulateFindMapMove() {
    if (!userMarker || !walkRouteCoords.length) {
        showToast("No Active Walk", "Start a walk from the Create tab first, then simulate it here.");
        return;
    }
    if (walkAnimationInterval) clearInterval(walkAnimationInterval);

    let step = 0;
    const totalSteps = 60;
    const segments = walkRouteCoords.length - 1;

    showToast("Navigation Active", "Moving along lit campus route on radar...");

    walkAnimationInterval = setInterval(() => {
        step++;
        const progress = step / totalSteps;

        if (progress >= 1) {
            const last = walkRouteCoords[walkRouteCoords.length - 1];
            userMarker.setPosition(last);
            googleMap.panTo(last);
            clearInterval(walkAnimationInterval);
            showToast("Safe Arrival Near!", "You are approaching the destination.");
            return;
        }

        const segFloat = progress * segments;
        const segIndex = Math.floor(segFloat);
        const segProgress = segFloat - segIndex;
        const start = walkRouteCoords[segIndex];
        const end = walkRouteCoords[Math.min(segIndex + 1, walkRouteCoords.length - 1)];

        const lat = start.lat + (end.lat - start.lat) * segProgress;
        const lng = start.lng + (end.lng - start.lng) * segProgress;

        userMarker.setPosition({ lat, lng });
        googleMap.panTo({ lat, lng });
    }, 100);
}

function realInitMap() {
    googleMap = new google.maps.Map(document.getElementById("google-map"), {
        center: GSU_CENTER,
        zoom: 16,
        disableDefaultUI: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#1a0533" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a0533" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#e0d7ff" }] }
        ]
    });

    gsuLocations.forEach(loc => {
        const marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: googleMap,
            label: { text: loc.emoji, fontSize: "16px" },
            title: loc.name
        });

        const floorsLine = loc.floors ? `<div style="font-size:11px; margin-top:2px;">${loc.floors}</div>` : "";
        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="color:#1a0533; font-family: sans-serif; max-width:200px;">
                <strong>${loc.emoji} ${loc.name}</strong>
                ${floorsLine}
                <div style="font-size:11px; color:#7B2CBF; margin-top:4px;">${loc.safetyNote}</div>
            </div>`
        });

        marker.addListener("click", () => infoWindow.open(googleMap, marker));
    });

    populateLocationSelects();
}

// The Google Maps script tag calls window.initMap via its `callback=initMap`
// param, and can finish loading before or after this module does. A tiny
// placeholder in index.html's <head> covers the "Maps loads first" case by
// setting window.__gmapsReady; this covers "our module loads first".
if (window.__gmapsReady) {
    realInitMap();
} else {
    window.initMap = realInitMap;
}
