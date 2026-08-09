# Security Hardening Notes — Meridian (Django/React)

This document summarises the security fixes applied to the existing
`meridian-revised` application. These changes **do not alter application
behaviour/features**; they only close identified security gaps.

## Backend (Django)

### 1. Secret key no longer committed
- `SECRET_KEY` was hardcoded in `settings.py` and committed to git.
- Now read from the `DJANGO_SECRET_KEY` environment variable (with a clearly
  marked development-only fallback).
- **Action:** set `DJANGO_SECRET_KEY` in production (see `.env.example`).

### 2. Environment-driven host / CORS / CSRF configuration
- `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` were
  hardcoded with a private LAN IP (`10.208.14.243`).
- Now parsed from comma-separated environment variables with safe localhost
  defaults.

### 3. HTTPS / cookie hardening settings
- Added `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_SSL_REDIRECT`,
  `SECURE_HSTS_SECONDS`, `SECURE_CONTENT_TYPE_NOSNIFF`, `SECURE_REFERRER_POLICY`,
  and `X_FRAME_OPTIONS = 'DENY'`.
- HTTPS-related flags are env-gated and should be enabled behind a
  TLS-terminating reverse proxy in production.

### 4. Fixed broken access control (authorization)
- `OrderViewSet` and `TransactionViewSet` previously had no explicit
  `permission_classes`, so they fell back to the global `IsAuthenticated` only —
  meaning any authenticated user (including `customer` accounts) could read
  and modify **all** orders and **all** payment transactions.
- Fixes:
  - `OrderViewSet.get_permissions()` — list/retrieve requires `IsAuthenticated`
    (still scoped by role in `get_queryset`); create/update/delete requires a
    **waiter or manager**.
  - `TransactionViewSet.permission_classes = [IsCashierOrManager]` — payment
    records are now cashier/manager only.
- Added role permission classes in `restaurant/permissions.py`:
  `IsWaiter`, `IsCashier`, `IsWaiterOrManager`, `IsCashierOrManager`.

### 5. Login rate limiting
- Added an anonymous rate limit (`AnonRateThrottle`, `anon` scope) to
  `/api/auth/login/` to mitigate brute-force credential guessing. The rate is
  configured in `REST_FRAMEWORK.DEFAULT_THROTTLE_RATES`.

### 6. Static/media serving
- `urls.py` serves static/media via Django's `serve()` view in "production"
  mode. This is acceptable for local testing only; production should serve
  these files from a real web server / object storage.

## Frontend (React)

- `axiosClient.js` hardcoded the backend to a private IP
  (`http://10.208.14.243:8000/api`).
- Now reads `REACT_APP_API_BASE_URL` from the environment, defaulting to
  `http://localhost:8000/api`.

## Remaining recommendations (not in scope of this pass)
- Serve the app over HTTPS (or behind a TLS reverse proxy) before any real
  deployment.
- Consider migrating from SQLite to PostgreSQL/MySQL for production.
- Add MFA / account lockout for staff accounts.
- Add automated tests for the new permission rules.