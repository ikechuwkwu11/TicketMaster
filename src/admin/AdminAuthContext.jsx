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

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const authed = Boolean(user);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
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
    try {
      const data = await api.login(username, password);
      setTokens({ access: data.access, refresh: data.refresh });
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      authed,
      user,
      checking,
      login,
      logout,
      ADMIN_USER: 'admin',
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
