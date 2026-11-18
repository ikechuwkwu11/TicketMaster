# TicketMaster

Premium dark-themed event ticketing web app (Ticketmaster-inspired) with a React frontend and Django REST Framework backend.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS v4 + React Router
- **Backend:** Django 5 + Django REST Framework + SimpleJWT
- **Auth:** JWT for the React admin console (`admin` / `admin123`)

## Project layout

```
TicketMaster/
  src/                 # React app (public site + /admin)
  backend/             # Django project
    config/            # settings, urls
    catalog/           # sections, events, images
    tickets/           # ticket orders + seats
    accounts/          # admin JWT login
```

## Quick start

### 1. Backend API

```bash
python -m pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py seed_catalog --reset
python backend/manage.py runserver 8000
```

API root: [http://localhost:8000/api/](http://localhost:8000/api/)  
Django admin: [http://localhost:8000/django-admin/](http://localhost:8000/django-admin/)

### 2. Frontend

```bash
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)  
React admin: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

Set `VITE_API_BASE_URL=http://localhost:8000/api` in `.env` (see `.env.example`).

## Main API endpoints

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/bootstrap/` | Public — full catalog payload for the app |
| GET | `/api/events/`, `/api/events/{slug}/` | Public read |
| POST/PUT/PATCH/DELETE | `/api/events/...` | Admin JWT |
| GET | `/api/tickets/catalog/` | Public |
| POST/PUT/DELETE | `/api/tickets/...` | Admin JWT |
| GET/POST/DELETE | `/api/images/` | Read public, write admin |
| GET/PATCH | `/api/sections/{key}/` | Read public, write admin |
| POST | `/api/auth/admin/login/` | Public — returns JWT |
| POST | `/api/catalog/reset/` | Admin — reseed sample data |

## Admin credentials

- Username: `admin`
- Password: `admin123`

## Progressive Web App (PWA)

The React app is installable as a PWA via `vite-plugin-pwa`.

- Manifest + icons in `public/`
- Custom service worker: `src/sw.js` (static caching; `/api` is NetworkOnly)
- Offline fallback: `public/offline.html`
- Install / update prompts in the UI
- Push subscription endpoints: `GET /api/push/vapid-public-key/`, `POST|DELETE /api/push/subscriptions/`

### Enable Web Push (optional)

1. Generate VAPID keys (keep the private key server-side only).
2. Add to `backend/.env`:

```env
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_ADMIN_EMAIL=mailto:admin@yourdomain.com
```

3. Users opt in from **Account → Enable notifications**.
4. Send messages from Django with `webpush.services.send_push_notification(...)`.

### Offline mode

After you open the app once while online:

- Events, tickets, search, and navigation keep working offline (saved catalog + cached app shell).
- Transfers, admin edits, uploads, and payments require a connection (they will not fake success offline).

For a real offline PWA test (service worker):

```bash
npm run preview:pwa
```

Then open the Network URL on your phone, Add to Home Screen, turn on Airplane Mode, and reopen the icon.

### Test install

- **Android Chrome:** open the site over HTTPS (or localhost) → Install / Add to Home Screen.
- **iPhone Safari:** Share → Add to Home Screen (iOS does not use `beforeinstallprompt`).
- Production PWAs require HTTPS.
