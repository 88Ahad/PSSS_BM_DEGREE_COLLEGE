# Migration plan: Move auth to HttpOnly cookies

এই ডকুমেন্টটি ব্যাখ্যা করে কিভাবে প্রজেক্টের JWT-based auth কে ক্লায়েন্ট-side localStorage থেকে HttpOnly cookie-ভিত্তিক সিস্টেমে রূপান্তর করা যাবে।

## কেন এটা করা উচিত
- HttpOnly কুকি XSS-ভিত্তিক টোকেন চুরির বিরুদ্ধে প্রতিরোধ করে।
- সার্ভার-সাইডে cookie flags (`Secure`, `SameSite`) দিয়ে CSRF ঝুঁকি হ্রাস করা যায় (নির্দিষ্ট কনফিগ প্রয়োজন)।

## সাধারণ ধারণা
- সার্ভারের login এন্ডপয়েন্ট এখন টোকেন রেসপন্স বডির বদলে HttpOnly কুকি সেট করবে (Set-Cookie হেডার)।
- ক্লায়েন্ট-সাইডে localStorage থেকে টোকেন না রাখবে; ক্লায়েন্ট শুধুই redirect/UI হ্যান্ডেল করবে।
- Protected API-তে authorization header না পাঠালে সার্ভার cookie থেকে টোকেন পড়ে ভেরিফাই করবে (middleware)।

## পরিবর্তনযোগ্য ফাইল ও অংশ (high-level)
- `backend/controllers/authController.js` — login, register (optional) এবং logout: cookie সেট/ক্লিয়ার যুক্ত করা।
- `backend/middleware/authMiddleware.js` — Authorization header-এর পাশাপাশি Request Cookie থেকে টোকেন পড়ে ভেরিফাই করা।
- `backend/server.js` — CORS সেটিংসে `credentials: true` নিশ্চিত করা এবং cookie-parser (অপশনাল) ইনস্টল/ব্যবহার করা।
- `frontend/script.js` (login) — টোকেন localStorage-এ না রেখে, শুধু রিডাইরেক্ট বা success UI দেখানো; fetch এ credentials:true সেট করা লাগবে।
- Frontend dashboard HTML/JS — কুকি-ভিত্তিক অথোরাইজেশন ধরে নেয়া; পেজ লোডে server-side এক API হিট করে ইউজার/রোল যাচাই করা ভালো।

## Cookie config (recommended)
- Name: `psss_token` বা `token`
- HttpOnly: true
- Secure: true (production — HTTPS প্রয়োজন)
- SameSite: 'Lax' বা 'Strict' (depending on cross-site needs; Lax বেশিরভাগ ক্ষেত্রে কাজ করে)
- Path: `/` (সব সার্ভার API-তে পাঠানোর জন্য)
- Max-Age: token expiry (e.g., 7d in JWT) অথবা session cookie যদি আপনি চান

## CORS changes
- Backend CORS config: `origin` set to frontend origin, `credentials: true`।
- Frontend fetch requests that should include cookie must use `credentials: 'include'`.

## Step-by-step implementation plan
1. Prepare environment: ensure `.env` has `JWT_SECRET` and HTTPS in prod.
2. Add `cookie-parser` dependency (or use `res.cookie` directly).
3. Modify `authController.login`:
   - After successful auth, set cookie via `res.cookie('token', jwt, cookieOptions)` and return user data (no token in body).
4. Add `authController.logout` endpoint to clear cookie: `res.clearCookie('token', cookieOptions)`.
5. Update `authMiddleware.protect` to check `req.cookies.token` (or parse Cookie header) if Authorization header absent.
6. Update `server.js` to use `app.use(cookieParser())` and configure CORS with credentials.
7. Update frontend login fetch to use `credentials: 'include'` and stop storing token in localStorage; instead rely on server-set cookie.
8. Update dashboard pages to verify session by calling a protected `GET /api/auth/me` endpoint which returns user info using cookie.
9. Test end-to-end in dev (https via localhost with mkcert or skip Secure flag in dev), then deploy.

## Rollback plan
- Keep old token-in-body behaviour until frontend updated. Implement cookie AND token-in-body temporarily (dual-mode) and after frontend migration, remove token-in-body.

## Risks & Notes
- Local dev: Secure cookie requires HTTPS; for dev you can set `secure: false` but ensure to enable in production.
- CSRF: Cookies are vulnerable to CSRF; to mitigate use SameSite, and consider adding CSRF tokens for state-changing requests.

## Implemented in this repo
- Basic CSRF double-submit protection has been added: server now sets a non-HttpOnly `csrfToken` cookie at login and expects an `X-CSRF-Token` header matching that cookie for state-changing requests (logout, create role). See `backend/middleware/csrfProtection.js` and updated routes.

---
If you want, আমি এখন এই প্ল্যান অনুযায়ী ধাপে ধাপে ইমপ্লিমেন্ট করতে শুরু করি। প্রথম ধাপ হিসেবে আমি `cookie-parser` যুক্ত করে `authController.login` ও `logout` আপডেট করব এবং CORS/credentials সেট করব।

## Production hardening checklist

- Enforce HTTPS: deploy behind TLS (load balancer or CDN) so cookies with `secure: true` are usable.
- Confirm `secure: true` is enabled in code when `NODE_ENV === 'production'` (current code sets this).
- Review `SameSite` policy and set to `Strict` when possible; use `Lax` if you rely on cross-site GET navigations.
- Add HTTP security headers: `helmet` is already added to the backend to provide sane defaults.
- Rate-limit auth endpoints: `express-rate-limit` added with conservative defaults (15m / 20 requests).
- Enable audit logging for auth events and failed login attempts.
- Store `JWT_SECRET` in a secure secret store (environment, secrets manager) and rotate regularly.
- Monitor suspicious auth activity and set alerts for high failure rates or unknown IPs.
- Run penetration tests (or a focused security review) before enabling cookie `secure: true` in production.

---

If you'd like, আমি এখন সার্ভারে Helmet ও rate-limit কনফিগ ঠিক আছে কিনা final-review করব এবং একটি ছোট note নিয়ে commit করে push করব।
