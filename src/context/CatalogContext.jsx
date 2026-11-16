import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../api/client';

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

function emptySections() {
  return Object.fromEntries(SECTION_META.map((s) => [s.key, []]));
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
  const [sections, setSections] = useState(emptySections);
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);
  const [categoryLabels, setCategoryLabels] = useState(() =>
    Object.fromEntries(SECTION_META.map((s) => [s.path, s.label])),
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyBootstrap = useCallback((data) => {
    setSections({ ...emptySections(), ...(data.sections || {}) });
    setUpcomingTickets(data.upcomingTickets || []);
    setPastTickets(data.pastTickets || []);
    setImages(data.images || []);
    if (data.categoryLabels) {
      setCategoryLabels((prev) => ({ ...prev, ...data.categoryLabels }));
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.bootstrap();
      applyBootstrap(data);
    } catch (err) {
      setError(err.message || 'Failed to load catalog from API');
    } finally {
      setLoading(false);
    }
  }, [applyBootstrap]);

  useEffect(() => {
    refresh();
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
      const event = (sections[sectionKey] || []).find((e) => e.id === eventId);
      await api.deleteEvent(event?.slug || eventId);
      await refresh();
    },
    [sections, refresh],
  );

  const moveEvent = useCallback(
    async (fromKey, toKey, eventId) => {
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
        bucket,
        slug:
          ticket.slug ||
          slugify(ticket.displayTitle || ticket.title) ||
          uid('ticket'),
        quantity: ticket.seats?.length || ticket.quantity || 0,
      };
      if (ticket.id || ticket.slug) {
        await api.updateTicket(ticket.slug || ticket.id, payload);
      } else {
        await api.createTicket(payload);
      }
      await refresh();
      return payload;
    },
    [refresh],
  );

  const deleteTicket = useCallback(
    async (ticketId) => {
      const ticket = allTickets.find((t) => t.id === ticketId);
      await api.deleteTicket(ticket?.slug || ticketId);
      await refresh();
    },
    [allTickets, refresh],
  );

  const updateCategoryLabel = useCallback(
    async (path, label) => {
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
      if (fileOrData instanceof File) {
        const form = new FormData();
        form.append('name', fileOrData.name);
        form.append('file', fileOrData);
        const created = await api.createImage(form);
        await refresh();
        return created;
      }
      if (typeof fileOrData === 'object' && fileOrData.url) {
        const created = await api.createImage({
          name: fileOrData.name || 'Image',
          url: fileOrData.url,
        });
        await refresh();
        return created;
      }
      if (typeof fileOrData === 'string') {
        const created = await api.createImage({
          name: 'Image',
          url: fileOrData,
        });
        await refresh();
        return created;
      }
      return null;
    },
    [refresh],
  );

  const deleteImage = useCallback(
    async (imageId) => {
      await api.deleteImage(imageId);
      await refresh();
    },
    [refresh],
  );

  const resetCatalog = useCallback(async () => {
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
