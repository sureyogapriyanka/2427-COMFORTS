# Cloudflare Pages Free preparation

## What this setup does

- Builds the existing React/Vite storefront with `npm run build`.
- Places the built files under `/2427-COMFORTS/`, matching the existing Vite base path, generated asset URLs, and HashRouter entry URL.
- Redirects the site root to `/2427-COMFORTS/`.
- Serves the storefront and its images as static Pages assets; loading the shell does not wait for Render or MongoDB.
- Uses a narrowly routed Pages Function only for `/2427-COMFORTS/api/*`. The function forwards API requests to the existing Render preview API, preserving request method, query string, body, browser `Origin`, and session cookie. It uses a fixed upstream rather than accepting a client-supplied host and disables API caching.
- Leaves checkout and real purchases unchanged and disabled.

The existing catalog provider already renders local catalog content and a loading state while the API is pending, then shows the local catalog with a clear status if the API fails. The home page shell, navigation, and static content can render independently of that API request.

## Cloudflare Pages project settings

After approving a deployment, connect the existing repository and select the `preview/elan-render-client` branch. In the Pages setup, use:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build:cloudflare` |
| Build output directory | `dist` |
| Root directory | `/` (repository root) |
| Build environment variables | None required; leave `VITE_API_BASE_URL` unset |

`build:cloudflare` runs the normal production build and then stages the generated files under `dist/2427-COMFORTS/`, with Pages routing metadata at the output root. No Wrangler package, paid Worker, secret, or database setting is required. Do not copy backend credentials or JWT/payment secrets into Pages settings.

## Backend origin, CORS, and sessions

The function proxies to the current backend at `https://two427-elan-client-preview.onrender.com`; it does not change or replace that Render service. Browser requests remain same-origin to the Pages site, and the proxy forwards the existing `HttpOnly; Secure; SameSite=Lax; Path=/` session cookie and the request `Origin` to the backend. The backend returns session cookies through the proxy to the Pages origin.

Before using a Pages URL, the owner must add that exact origin (scheme plus hostname only) to `CLIENT_ORIGINS` on the existing Render service, retaining its current allowed origins. The server also checks request origins on cookie-authenticated writes. Do not use a wildcard or weaken CORS, CSRF, or cookie settings. Keep the existing Render URL available as a fallback.

## Cloudflare Free limits and Render cold starts

Cloudflare documents static asset requests as free and unlimited. Pages Functions are billed as Workers; the Free plan currently includes 100,000 Worker/Pages Function requests per day and 10 ms CPU time per invocation. Confirm current account limits before launch.

The static homepage and assets will not wait for the Render service to wake. Product/catalog and other API calls still depend on Render and MongoDB, so those requests can be slow during a Render cold start and may fail if the upstream or proxy times out. The loading/fallback UI remains available while that happens. A Pages proxy does not keep Render warm or remove backend cold starts. Verify cold-start API behavior on an authorized Pages preview before making it the client-facing URL.

## Safe activation and verification

1. Owner authorizes connecting the repository and `preview/elan-render-client` to Cloudflare Pages Free.
2. Set the build values above and create a Pages preview deployment only when authorized.
3. Add the assigned Pages origin to the existing Render `CLIENT_ORIGINS` setting with owner approval; retain current origins and redeploy/restart the backend only after that change.
4. Verify the Pages URL serves `/2427-COMFORTS/`, CSS, JavaScript, and product images without a Render request. Verify `/2427-COMFORTS/api/health`, catalog endpoints, and product details through the Pages origin.
5. Test login/session behavior only with an owner-approved test account. Do not create customers or change database data for this validation.
6. Observe one Render cold start and confirm the API proxy and the UI's loading/error states behave acceptably. Keep Render's public preview URL as the fallback.

No Pages project or deployment has been created by this preparation. The Cloudflare custom domain or `pages.dev` URL should not replace the existing client URL until the owner approves and accepts the verification results.

## References

- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare Workers pricing and Free limits](https://developers.cloudflare.com/workers/platform/pricing/)
