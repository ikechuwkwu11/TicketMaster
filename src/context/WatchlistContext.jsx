import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useCatalog } from './CatalogContext';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { allEvents } = useCatalog();
  const [ids, setIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tm-watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((next) => {
    setIds(next);
    localStorage.setItem('tm-watchlist', JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (id) => {
      persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
    },
    [ids, persist],
  );

  const isWatched = useCallback((id) => ids.includes(id), [ids]);

  const items = useMemo(
    () => allEvents.filter((e) => ids.includes(e.id)),
    [ids, allEvents],
  );

  const value = useMemo(
    () => ({ ids, items, toggle, isWatched }),
    [ids, items, toggle, isWatched],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
