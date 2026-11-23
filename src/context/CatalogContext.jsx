import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../api/client';
import { getOfflineBootstrap } from '../data/offlineBootstrap';

export const SECTION_META = [
  { key: 'forYou', label: 'For You', path: 'for-you', card: 'forYou' },
  { key: 'lastMinute', label: 'Last Minute', path: 'last-minute', card: 'event' },
  {
    key: 'popularWeekend',
    label: 'Popular This Weekend',
    path: 'popular-weekend',
    card: 'event',
  },
  {
    key: 'justAnnounced',
    label: 'Just Announced',
    path: 'just-announced',
    card: 'justAnnounced',
  },
  { key: 'concerts', label: 'Concerts', path: 'concerts', card: 'category' },
  { key: 'sports', label: 'Sports', path: 'sports', card: 'category' },
  { key: 'arts', label: 'Arts, Theater & Comedy', path: 'arts', card: 'category' },
  { key: 'family', label: 'Family', path: 'family', card: 'category' },
  { key: 'festivals', label: 'Festivals', path: 'festivals', card: 'category' },
];

const CACHE_KEY = 'tm-catalog-cache-v5';

function emptySections() {
  return Object.fromEntries(SECTION_META.map((s) => [s.key, []]));
}

function readCachedBootstrap() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCachedBootstrap(data) {
  try {
    const payload = {
      ...data,
      _cachedAt: new Date().toISOString(),
      _source: 'api',
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

function requireOnline(actionLabel = 'This action') {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error(
      `${actionLabel} needs an internet connection. Browse events and tickets still work offline.`,
    );
  }
}

const CatalogContext = createContext(null);

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CatalogProvider({ children }) {
  const cached = typeof window !== 'undefined' ? readCachedBootstrap() : null;
  const initial = cached || getOfflineBootstrap();

  const [sections, setSections] = useState(() => ({
    ...emptySections(),
    ...(initial.sections || {}),
  }));
  const [upcomingTickets, setUpcomingTickets] = useState(
    () => initial.upcomingTickets || [],
  );
  const [pastTickets, setPastTickets] = useState(() => initial.pastTickets || []);
  const [categoryLabels, setCategoryLabels] = useState(() => ({
    ...Object.fromEntries(SECTION_META.map((s) => [s.path, s.label])),
    ...(initial.categoryLabels || {}),
  }));
  const [images, setImages] = useState(() => initial.images || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(
    () => typeof navigator !== 'undefined' && !navigator.onLine,
  );
  const [dataSource, setDataSource] = useState(() =>
    cached ? 'cache' : 'seed',
  );

  const applyBootstrap = useCallback((data, source = 'api') => {
    setSections({ ...emptySections(), ...(data.sections || {}) });
    setUpcomingTickets(data.upcomingTickets || []);
    setPastTickets(data.pastTickets || []);
    setImages(data.images || []);
    if (data.categoryLabels) {
      setCategoryLabels((prev) => ({ ...prev, ...data.categoryLabels }));
    }
    setDataSource(source);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.bootstrap();
      applyBootstrap(data, 'api');
      writeCachedBootstrap(data);
      setOfflineMode(false);
    } catch (err) {
      const fallback = readCachedBootstrap() || getOfflineBootstrap();
      applyBootstrap(fallback, fallback._source === 'seed' ? 'seed' : 'cache');
      // Only mark offline when the device has no network — static hosts have no API.
      setOfflineMode(typeof navigator !== 'undefined' && !navigator.onLine);
      setError(
        typeof navigator !== 'undefined' && !navigator.onLine
          ? err.message ||
              'Server unavailable — showing saved TicketMaster data offline.'
          : null,
      );
    } finally {
      setLoading(false);
    }
  }, [applyBootstrap]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onOffline = () => setOfflineMode(true);
    const onOnline = () => {
      setOfflineMode(false);
      refresh();
    };
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [refresh]);

  const allEvents = useMemo(
    () => Object.values(sections).flat(),
    [sections],
  );

  const allTickets = useMemo(
    () => [...upcomingTickets, ...pastTickets],
    [upcomingTickets, pastTickets],
  );

  const getEventsBySection = useCallback(
    (key) => sections[key] || [],
    [sections],
  );

  const getEventsByCategory = useCallback(
    (category) => {
      const meta = SECTION_META.find((s) => s.path === category);
      if (meta) return sections[meta.key] || [];
      return allEvents.filter((e) => e.category === category);
    },
    [sections, allEvents],
  );

  const getEventBySlug = useCallback(
    (slug) => allEvents.find((e) => e.slug === slug),
    [allEvents],
  );

  const getTicketBySlug = useCallback(
    (slug) => allTickets.find((t) => t.slug === slug),
    [allTickets],
  );

  const searchEvents = useCallback(
    (query) => {
      if (!query?.trim()) return [];
      const q = query.toLowerCase().trim();
      return allEvents.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q),
      );
    },
    [allEvents],
  );

  const saveEvent = useCallback(
    async (sectionKey, event) => {
      requireOnline('Saving events');
      const payload = {
        ...event,
        sectionKey,
        slug: event.slug || slugify(event.title) || uid('event'),
        eventCount:
          event.eventCount === '' || event.eventCount == null
            ? null
            : Number(event.eventCount),
      };
      if (event.id || event.slug) {
        await api.updateEvent(event.slug || event.id, payload);
      } else {
        await api.createEvent(payload);
      }
      await refresh();
      return payload;
    },
    [refresh],
  );

  const deleteEvent = useCallback(
    async (sectionKey, eventId) => {
      requireOnline('Deleting events');
      const event = (sections[sectionKey] || []).find((e) => e.id === eventId);
      await api.deleteEvent(event?.slug || eventId);
      await refresh();
    },
    [sections, refresh],
  );

  const moveEvent = useCallback(
    async (fromKey, toKey, eventId) => {
      requireOnline('Moving events');
      if (fromKey === toKey) return;
      const event = (sections[fromKey] || []).find((e) => e.id === eventId);
      if (!event) return;
      const meta = SECTION_META.find((s) => s.key === toKey);
      await api.updateEvent(event.slug || event.id, {
        ...event,
        sectionKey: toKey,
        category: meta?.path || event.category,
      });
      await refresh();
    },
    [sections, refresh],
  );

  const saveTicket = useCallback(
    async (ticket, { bucket = 'upcoming' } = {}) => {
      const payload = {
        ...ticket,
        id: ticket.id || uid('t'),
        bucket,
        slug:
          ticket.slug ||
          slugify(ticket.displayTitle || ticket.title) ||
          uid('ticket'),
        quantity: ticket.seats?.length || ticket.quantity || 0,
      };

      const match = (t) =>
        (payload.id && t.id === payload.id) ||
        (payload.slug && t.slug === payload.slug);

      const upsert = (list, include) => {
        const without = list.filter((t) => !match(t));
        if (!include) return without;
        const idx = list.findIndex(match);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = { ...list[idx], ...payload };
          return next;
        }
        return [...without, payload];
      };

      const nextUpcoming = upsert(upcomingTickets, bucket === 'upcoming');
      const nextPast = upsert(pastTickets, bucket === 'past');

      // Update React state immediately so My Tickets / Ticket Details refresh now.
      setUpcomingTickets(nextUpcoming);
      setPastTickets(nextPast);
      writeCachedBootstrap({
        sections,
        upcomingTickets: nextUpcoming,
        pastTickets: nextPast,
        images,
        categoryLabels,
      });

      try {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          if (ticket.id || ticket.slug) {
            await api.updateTicket(ticket.slug || ticket.id, payload);
          } else {
            await api.createTicket(payload);
          }
          await refresh();
        }
      } catch {
        // Static host / API down — local catalog already updated.
      }

      return payload;
    },
    [
      refresh,
      sections,
      images,
      categoryLabels,
      upcomingTickets,
      pastTickets,
    ],
  );

  const deleteTicket = useCallback(
    async (ticketId) => {
      requireOnline('Deleting tickets');
      const ticket = allTickets.find((t) => t.id === ticketId);
      await api.deleteTicket(ticket?.slug || ticketId);
      await refresh();
    },
    [allTickets, refresh],
  );

  const updateCategoryLabel = useCallback(
    async (path, label) => {
      requireOnline('Updating sections');
      const meta = SECTION_META.find((s) => s.path === path);
      if (!meta) return;
      setCategoryLabels((prev) => ({ ...prev, [path]: label }));
      await api.updateSection(meta.key, { label });
      await refresh();
    },
    [refresh],
  );

  const addImage = useCallback(
    async (fileOrData) => {
      let localEntry = null;

      if (fileOrData instanceof File) {
        const dataUrl = await readImageAsDataUrl(fileOrData);
        localEntry = {
          id: uid('img'),
          name: fileOrData.name || 'Upload',
          url: dataUrl,
        };

        // Prefer Django when it is reachable; otherwise keep the local data URL.
        try {
          if (typeof navigator !== 'undefined' && navigator.onLine) {
            const form = new FormData();
            form.append('name', fileOrData.name);
            form.append('file', fileOrData);
            const created = await api.createImage(form);
            if (created?.url) {
              localEntry = {
                id: created.id || localEntry.id,
                name: created.name || localEntry.name,
                url: created.url,
              };
            }
          }
        } catch {
          // Static host returns 405 for POST /api/images — local upload still works.
        }
      } else if (typeof fileOrData === 'object' && fileOrData?.url) {
        localEntry = {
          id: uid('img'),
          name: fileOrData.name || 'Image',
          url: fileOrData.url,
        };
        try {
          if (typeof navigator !== 'undefined' && navigator.onLine) {
            const created = await api.createImage({
              name: localEntry.name,
              url: localEntry.url,
            });
            if (created?.url) localEntry = { ...localEntry, ...created };
          }
        } catch {
          /* keep local */
        }
      } else if (typeof fileOrData === 'string') {
        localEntry = { id: uid('img'), name: 'Image', url: fileOrData };
        try {
          if (typeof navigator !== 'undefined' && navigator.onLine) {
            const created = await api.createImage({
              name: 'Image',
              url: fileOrData,
            });
            if (created?.url) localEntry = { ...localEntry, ...created };
          }
        } catch {
          /* keep local */
        }
      }

      if (!localEntry?.url) return null;

      setImages((prev) => {
        const next = [localEntry, ...prev.filter((img) => img.url !== localEntry.url)];
        writeCachedBootstrap({
          sections,
          upcomingTickets,
          pastTickets,
          images: next,
          categoryLabels,
        });
        return next;
      });

      return localEntry;
    },
    [sections, upcomingTickets, pastTickets, categoryLabels],
  );

  const deleteImage = useCallback(
    async (imageId) => {
      setImages((prev) => {
        const next = prev.filter((img) => img.id !== imageId);
        writeCachedBootstrap({
          sections,
          upcomingTickets,
          pastTickets,
          images: next,
          categoryLabels,
        });
        return next;
      });
      try {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          await api.deleteImage(imageId);
        }
      } catch {
        /* local delete already applied */
      }
    },
    [sections, upcomingTickets, pastTickets, categoryLabels],
  );

  const resetCatalog = useCallback(async () => {
    requireOnline('Resetting catalog');
    await api.resetCatalog();
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      sections,
      upcomingTickets,
      pastTickets,
      categoryLabels,
      images,
      loading,
      error,
      offlineMode,
      dataSource,
      refresh,
      allEvents,
      allTickets,
      getEventsBySection,
      getEventsByCategory,
      getEventBySlug,
      getTicketBySlug,
      searchEvents,
      saveEvent,
      deleteEvent,
      moveEvent,
      saveTicket,
      deleteTicket,
      updateCategoryLabel,
      addImage,
      deleteImage,
      resetCatalog,
      slugify,
      uid,
    }),
    [
      sections,
      upcomingTickets,
      pastTickets,
      categoryLabels,
      images,
      loading,
      error,
      offlineMode,
      dataSource,
      refresh,
      allEvents,
      allTickets,
      getEventsBySection,
      getEventsByCategory,
      getEventBySlug,
      getTicketBySlug,
      searchEvents,
      saveEvent,
      deleteEvent,
      moveEvent,
      saveTicket,
      deleteTicket,
      updateCategoryLabel,
      addImage,
      deleteImage,
      resetCatalog,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
