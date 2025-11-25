import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'saus-auth-user';
const USERS_STORAGE_KEY = 'saus-auth-users';
const GUEST_ACCOUNT = {
  fullName: 'Guest Explorer',
  email: 'guest@saus.edu.pk',
  password: 'Guest123!',
  isGuest: true
};

const ensureSeedUsers = () => {
  const stored = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const existingGuest = stored.find((user) => user.email === GUEST_ACCOUNT.email);
  if (!existingGuest) {
    stored.push(GUEST_ACCOUNT);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(stored));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    ensureSeedUsers();
    setIsAuthenticating(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const getStoredUsers = () => JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

  const login = async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const users = getStoredUsers();
    const match = users.find((entry) => entry.email === email && entry.password === password);
    if (!match) {
      throw new Error('Invalid email or password');
    }
    setUser({ fullName: match.fullName, email: match.email, isGuest: !!match.isGuest });
    return match;
  };

  const signup = async ({ fullName, email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getStoredUsers();
    const exists = users.some((entry) => entry.email === email);
    if (exists) {
      throw new Error('An account with this email already exists');
    }
    const nextUsers = [...users, { fullName, email, password }];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    return true;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticating,
      login,
      signup,
      logout,
      guestCredentials: { email: GUEST_ACCOUNT.email, password: GUEST_ACCOUNT.password }
    }),
    [user, isAuthenticating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};


