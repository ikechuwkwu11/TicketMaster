import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  api,
  clearTokens,
  getAccessToken,
  setTokens,
} from '../api/client';

const AdminAuthContext = createContext(null);

const DEMO_USER = 'admin';
const DEMO_PASS = 'admin123';
const DEMO_SESSION_KEY = 'tm-admin-demo-session';

function readDemoSession() {
  try {
    return localStorage.getItem(DEMO_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDemoSession(on) {
  try {
    if (on) localStorage.setItem(DEMO_SESSION_KEY, '1');
    else localStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

const DEMO_USER_PROFILE = {
  id: 0,
  username: DEMO_USER,
  is_staff: true,
  is_superuser: true,
  demo: true,
};

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const authed = Boolean(user);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (readDemoSession()) {
        if (!cancelled) {
          setUser(DEMO_USER_PROFILE);
          setChecking(false);
        }
        return;
      }

      const token = getAccessToken();
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setChecking(false);
        }
        return;
      }
      try {
        const me = await api.me();
        if (!cancelled) setUser(me);
      } catch {
        clearTokens();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const u = username.trim();
    const p = password;

    // Prefer live Django API when available
    try {
      const data = await api.login(u, p);
      writeDemoSession(false);
      setTokens({ access: data.access, refresh: data.refresh });
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const status = err?.status;
      const isCreds =
        status === 400 || status === 401 || status === 403;
      // Wrong password against a live API
      if (isCreds) {
        return { ok: false, reason: 'credentials' };
      }

      // Static host / no backend: allow demo credentials locally
      if (u === DEMO_USER && p === DEMO_PASS) {
        clearTokens();
        writeDemoSession(true);
        setUser(DEMO_USER_PROFILE);
        return { ok: true, demo: true };
      }

      return { ok: false, reason: 'offline' };
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    writeDemoSession(false);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      authed,
      user,
      checking,
      login,
      logout,
      isDemo: Boolean(user?.demo),
      ADMIN_USER: DEMO_USER,
    }),
    [authed, user, checking, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
