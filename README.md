# TicketMaster

Premium dark-themed event ticketing web app (Ticketmaster-inspired), built with React + Tailwind CSS.

## Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router
- **Backend-ready:** API client stub for Django REST Framework + PostgreSQL

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- Mobile-first homepage matching Ticketmaster-style sections
- Horizontal card carousels (For You, Last Minute, Popular, Just Announced, Concerts, Sports, Arts, Family, Festivals)
- Search across events / artists / venues
- Watchlist (heart toggle, persisted in `localStorage`)
- Event detail pages, category View All listings
- Fixed mobile bottom nav + responsive desktop header

## Django REST preparation

Set `VITE_API_BASE_URL` (see `.env.example`). The client in `src/api/client.js` expects endpoints like:

- `GET /api/events/`
- `GET /api/events/:slug/`
- `GET /api/events/?search=`
- `GET|POST|DELETE /api/watchlist/`

Sample event shapes in `src/data/events.js` mirror typical DRF serializer fields.
