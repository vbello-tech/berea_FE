// Points at the Django backend. Set via .env.development / .env.production
// (see VITE_API_BASE), so dev and prod builds hit different origins without
// any code changes.
const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Performs a JSON fetch against the API, attaching the auth token when
 * present and throwing a readable Error on non-2xx responses.
 *
 * @param {string} path - path relative to API_BASE, e.g. '/passage/?...'
 * @param {RequestInit} options
 * @param {string|null} token - current auth token, or null if logged out
 */
export async function apiFetch(path, options = {}, token = null) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (token) headers['Authorization'] = `Token ${token}`;

  const res = await fetch(`${API_BASE}${path}`, Object.assign({}, options, { headers }));

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* no body */
  }

  if (!res.ok) {
    const detail = (data && (data.detail || JSON.stringify(data))) || res.statusText;
    throw new Error(detail);
  }

  return data;
}
