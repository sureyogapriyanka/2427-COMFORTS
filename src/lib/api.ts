const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const API_PREFIX = API_BASE_URL
  ? '/api'
  : `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api`;

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${normalizedPath}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(`The API returned an unexpected response (${response.status}).`);
  }
  const payload = await response.json() as {
    success?: boolean;
    message?: string;
    data?: T;
  };
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `The API request failed (${response.status}).`);
  }
  return (payload.data ?? payload) as T;
}
