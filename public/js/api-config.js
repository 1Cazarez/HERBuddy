// Frontend configuration for the Herbuddy API (Express + TigerData/Postgres)
// and Auth0 login. Fill these in once you've set up both — see README.md.
//
// Until you do, the app keeps running on local mock data (see state.js) and
// the name-only login screen, exactly like before.

export const API_BASE_URL = "http://localhost:4000/api";

export const AUTH0_DOMAIN = "dev-zkihg5tmwlk8og2v.us.auth0.com";
export const AUTH0_CLIENT_ID = "NwGUkTAOiQZqrZEQNffJPnUoO5LNI3y3";
export const AUTH0_AUDIENCE = "https://herbuddy-api";

export const backendEnabled =
    AUTH0_DOMAIN !== "YOUR_AUTH0_DOMAIN" &&
    AUTH0_CLIENT_ID !== "YOUR_AUTH0_CLIENT_ID";

if (!backendEnabled) {
    console.info("Herbuddy: Auth0/TigerData config not set yet in public/js/api-config.js — running in local demo mode.");
}
