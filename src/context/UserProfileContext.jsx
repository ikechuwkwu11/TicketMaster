import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'tm-user-profile-v1';

const defaults = {
  name: '',
  email: '',
  locationContent: true,
  notifications: true,
  inboxCount: 1,
};

function readProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

function writeProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* quota / private mode */
  }
}

function initialsFromName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
}

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => readProfile());

  const updateProfile = useCallback((patch) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      writeProfile(next);
      return next;
    });
  }, []);

  const saveDetails = useCallback((name, email) => {
    updateProfile({
      name: String(name || '').trim(),
      email: String(email || '').trim(),
    });
  }, [updateProfile]);

  const value = useMemo(
    () => ({
      ...profile,
      initials: initialsFromName(profile.name),
      hasDetails: Boolean(profile.name || profile.email),
      updateProfile,
      saveDetails,
    }),
    [profile, updateProfile, saveDetails],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return ctx;
}
