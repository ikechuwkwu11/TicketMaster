/* TicketMaster service worker — offline app shell + safe API caching */
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

const SAFE_GET_API =
  /^\/api\/(bootstrap\/?$|events\/|tickets\/catalog\/?$|tickets\/?$|sections\/|images\/?$)/

// Safe public GET catalog endpoints — network first, cache for offline browse
registerRoute(
  ({ url, request }) =>
    request.method === 'GET' && SAFE_GET_API.test(url.pathname),
  new NetworkFirst({
    cacheName: 'tm-api-catalog',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  }),
)

// Everything else under /api, /media, django-admin — never serve stale writes/auth
registerRoute(
  ({ url, request }) => {
    if (url.pathname.startsWith('/django-admin/')) return true
    if (url.pathname.startsWith('/media/')) return true
    if (!url.pathname.startsWith('/api/')) return false
    if (request.method !== 'GET') return true
    return !SAFE_GET_API.test(url.pathname)
  },
  new NetworkOnly(),
)

registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts-stylesheets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  }),
)

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  }),
)

registerRoute(
  ({ request, url }) =>
    request.destination === 'image' &&
    !url.pathname.startsWith('/api/') &&
    !url.pathname.startsWith('/media/'),
  new StaleWhileRevalidate({
    cacheName: 'app-images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  }),
)

async function spaShellFallback() {
  const candidates = ['/index.html', '/', '/offline.html']
  for (const path of candidates) {
    const hit = await caches.match(path, { ignoreSearch: true })
    if (hit) return hit
  }
  return new Response(
    '<!doctype html><title>TicketMaster</title><p>Offline. Reopen after visiting once online.</p>',
    { headers: { 'Content-Type': 'text/html' }, status: 200 },
  )
}

// Navigations: try network, else open the cached SPA so HashRouter still works offline
registerRoute(
  new NavigationRoute(
    async ({ event }) => {
      try {
        return await fetch(event.request)
      } catch {
        return spaShellFallback()
      }
    },
    {
      denylist: [/^\/api\//, /^\/media\//, /^\/django-admin\//],
    },
  ),
)

self.addEventListener('push', (event) => {
  let data = {
    title: 'TicketMaster',
    body: 'You have a new update.',
    url: '/',
  }
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() }
    }
  } catch {
    try {
      data.body = event.data?.text() || data.body
    } catch {
      /* ignore */
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TicketMaster', {
      body: data.body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data: { url: data.url || '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = event.notification?.data?.url || '/'
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      for (const client of all) {
        if ('focus' in client) {
          await client.focus()
          if ('navigate' in client) await client.navigate(target)
          return
        }
      }
      await self.clients.openWindow(target)
    })(),
  )
})
