# PSSS_BM_DEGREE_COLLEGE

This repository contains a school management prototype: an Express + MongoDB backend and a static frontend (HTML/CSS/JS).

## Quick setup

1. Backend dependencies

   ```bash
   cd backend
   npm install
   ```

2. Create environment file

   Copy or create `backend/.env` with the following keys:

   ```text
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/psss_bm_degree_college
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Start MongoDB and run server

   - Start local MongoDB (e.g., `mongod`) or run via Docker.
   - Start the server:

   ```bash
   node backend/server.js
   ```

4. Open frontend

   Serve the frontend directory as static files (e.g., open `index.html` in browser or use a static server).

## Notes & recent changes

- Environment variables are loaded in `backend/server.js` using `dotenv`.
- Database connection logic has been moved to `backend/config/db.js` (exports `connectDB()`), and `server.js` now calls it.
- `backend/middleware/checkPermission.js` now performs null-safe checks for `user` and `permissions`.
- Frontend currently stores JWT in `localStorage` and redirects based on `user.role`. For production, prefer HttpOnly cookies and server-side authorization checks.

## Recommended next steps

- Add `backend/.env.example` (without secrets) to repository for onboarding.
- Consolidate repeated dashboard pages (consider SPA or a shared template).
- Harden authentication flows (use HttpOnly cookies, token refresh, server-side role checks).
- Add `package.json` at repo root or ensure `backend/package.json` exists with required deps.
# PSSS_BM_DEGREE_COLLEGE
