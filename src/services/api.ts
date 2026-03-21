// Backend API client for browser-side requests
// Base path is driven by VITE_BACKEND_PATH in .env — no hardcoded URLs
const API_BASE = `${import.meta.env.VITE_BACKEND_PATH}/api`;

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string, opts?: RequestInit) => apiFetch<T>(path, { method: 'GET', ...opts }),

  post: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),

  put: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),

  delete: <T>(path: string, opts?: RequestInit) => apiFetch<T>(path, { method: 'DELETE', ...opts }),
};
