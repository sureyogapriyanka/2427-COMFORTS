const API_PREFIX = '/2427-COMFORTS/api';
const RENDER_API_ORIGIN = 'https://two427-elan-client-preview.onrender.com';
const HOP_BY_HOP_HEADERS = [
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

interface PagesFunctionContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest({ request, next }: PagesFunctionContext): Promise<Response> {
  const incomingUrl = new URL(request.url);
  if (
    incomingUrl.pathname !== API_PREFIX &&
    !incomingUrl.pathname.startsWith(`${API_PREFIX}/`)
  ) {
    return next();
  }

  const apiPath = incomingUrl.pathname.slice('/2427-COMFORTS'.length);
  const upstreamUrl = new URL(`${apiPath}${incomingUrl.search}`, RENDER_API_ORIGIN);
  const headers = new Headers(request.headers);
  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);
  headers.delete('host');
  headers.delete('x-forwarded-for');
  headers.delete('x-forwarded-host');
  headers.delete('x-forwarded-proto');
  for (const header of headers.keys()) {
    if (header.startsWith('cf-')) headers.delete(header);
  }
  headers.set('cache-control', 'no-store');

  return fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : request.body,
    redirect: 'manual',
  });
}
