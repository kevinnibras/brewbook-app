import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USERS = 'coffee_space_users';
const STORAGE_KEY_ACTIVE = 'coffee_space_active_user';

export const DEFAULT_DEMO_USER = {
  id: 'user-demo-kevin',
  name: 'Kevin Nibras Kusuma',
  email: 'kevin.nibras@coffeespace.id',
  password: 'password123',
  bio: 'Pencinta aroma kopi otentik dan penjelajah kedai kopi nusantara.',
  role: 'Coffee Enthusiast • Member'
};

export const AuthProvider = ({ children }) => {
  // Ambil daftar user tersimpan (atau inisialisasi default demo user)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) return JSON.parse(saved);
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  });

  // Ambil user yang sedang aktif login
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Simpan daftar users ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Gagal menyimpan daftar user:', e);
    }
  }, [users]);

  // Simpan active user ke localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      }
    } catch (e) {
      console.error('Gagal menyimpan user aktif:', e);
    }
  }, [currentUser]);

  // Fungsi Login
  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    return {
      success: false,
      message: 'Email atau password yang Anda masukkan salah.'
    };
  };

  // Fungsi Login Cepat Demo (1-Klik)
  const loginDemo = () => {
    let demo = users.find((u) => u.email === DEFAULT_DEMO_USER.email);
    if (!demo) {
      demo = DEFAULT_DEMO_USER;
      setUsers((prev) => [...prev, demo]);
    }
    setCurrentUser(demo);
    return { success: true, user: demo };
  };

  // Fungsi Register Akun Baru
  const register = (name, email, password) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, message: 'Semua kolom wajib diisi!' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password minimal terdiri dari 6 karakter.' };
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, message: 'Email ini sudah terdaftar. Silakan login.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password,
      bio: 'Pencinta seduhan kopi otentik Coffee Space.',
      role: 'Coffee Enthusiast • Member'
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Fungsi Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
  };

  // Fungsi Perbarui Profil
  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updated : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        loginDemo,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
