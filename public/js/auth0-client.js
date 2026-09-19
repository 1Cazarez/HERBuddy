import { createAuth0Client } from "https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2.1.3/dist/auth0-spa-js.production.esm.js";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE, backendEnabled } from './api-config.js';

let clientPromise = null;

// Fixed at the root path rather than derived from window.location.pathname:
// this is a single-page app, but static-file servers (e.g. `serve`'s clean
// URLs) 301-redirect "/index.html" to "/" and drop the query string in the
// process — which would silently swallow Auth0's ?code=&state= callback
// params. "/" itself is never subject to that redirect, so anchoring here
// keeps the callback URL both stable and safe from that behavior.
function redirectUri() {
    return `${window.location.origin}/`;
}

function getClient() {
    if (!backendEnabled) return Promise.resolve(null);
    if (!clientPromise) {
        clientPromise = createAuth0Client({
            domain: AUTH0_DOMAIN,
            clientId: AUTH0_CLIENT_ID,
            authorizationParams: {
                redirect_uri: redirectUri(),
                audience: AUTH0_AUDIENCE
            },
            cacheLocation: 'localstorage'
        });
    }
    return clientPromise;
}

export async function loginWithAuth0() {
    const client = await getClient();
    if (!client) return;
    await client.loginWithRedirect();
}

export async function logoutAuth0() {
    const client = await getClient();
    if (!client) return;
    await client.logout({ logoutParams: { returnTo: redirectUri() } });
}

// Call once on page load. Returns true if this load is the browser landing
// back from the Auth0 login redirect (so the caller can react to it).
export async function handleAuthRedirect() {
    const client = await getClient();
    if (!client) return false;

    const params = new URLSearchParams(window.location.search);
    if (!params.has('code') || !params.has('state')) return false;

    try {
        await client.handleRedirectCallback();
    } finally {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    return true;
}

export async function getAuth0User() {
    const client = await getClient();
    if (!client) return null;
    const isAuthenticated = await client.isAuthenticated();
    if (!isAuthenticated) return null;
    return client.getUser();
}

export async function getAccessToken() {
    const client = await getClient();
    if (!client) return null;
    try {
        return await client.getTokenSilently();
    } catch (err) {
        console.warn('Herbuddy: could not get an Auth0 access token.', err);
        return null;
    }
}
