import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sriseta_auth_token';
const USER_KEY = 'sriseta_auth_user';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getStoredAuth() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const clearAllUserData = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('sriseta_user_horoscope');
      localStorage.removeItem('sriseta_registered_users');

      // Remove any user-keyed horoscope cache
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sriseta_horoscope_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Storage cleanup error:', e);
    }
  }, []);

  const login = useCallback((token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
    setAuth({ token, user });
  }, []);

  const logout = useCallback(() => {
    clearAllUserData();
    setAuth({ token: null, user: null });
  }, [clearAllUserData]);

  const updateUser = useCallback((updatedUser) => {
    setAuth((prev) => {
      const merged = { ...prev.user, ...updatedUser };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(merged));
      } catch {}
      return { ...prev, user: merged };
    });
  }, []);

  // Validate session on mount and refresh profile from database
  useEffect(() => {
    if (!auth.token) return;

    let isMounted = true;
    const fetchFreshProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (res.status === 401) {
          // Token expired or invalid
          if (isMounted) logout();
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.user) {
            updateUser(data.user);
          }
        }
      } catch {
        // Network drop; keep local cached user for offline viewing
      }
    };

    fetchFreshProfile();

    return () => {
      isMounted = false;
    };
  }, [auth.token, logout, updateUser]);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        updateUser,
        isLoggedIn: !!auth.token && !!auth.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
