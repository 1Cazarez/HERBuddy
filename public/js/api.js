import { API_BASE_URL } from './api-config.js';
import { getAccessToken } from './auth0-client.js';

async function request(path, options = {}) {
    const token = await getAccessToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API ${options.method || 'GET'} ${path} failed: ${res.status} ${body}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiPatch = (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) });
export const apiDelete = (path) => request(path, { method: 'DELETE' });
