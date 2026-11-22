import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY_MENUS = 'brewbook_fav_menus';
const STORAGE_KEY_CAFES = 'brewbook_fav_cafes';

export const FavoritesProvider = ({ children }) => {
  const [favoriteMenus, setFavoriteMenus] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENUS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteCafes, setFavoriteCafes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAFES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Simpan ke localStorage saat berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(favoriteMenus));
    } catch (e) {
      console.error('Gagal menyimpan menu favorit ke localStorage', e);
    }
  }, [favoriteMenus]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAFES, JSON.stringify(favoriteCafes));
    } catch (e) {
      console.error('Gagal menyimpan kedai favorit ke localStorage', e);
    }
  }, [favoriteCafes]);

  // Menu favorit helper
  const isMenuFavorite = (id) => {
    return favoriteMenus.some((item) => String(item.id) === String(id));
  };

  const toggleMenuFavorite = (menu) => {
    if (!menu || !menu.id) return;
    setFavoriteMenus((prev) => {
      const exists = prev.some((item) => String(item.id) === String(menu.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(menu.id));
      } else {
        return [...prev, menu];
      }
    });
  };

  // Kedai favorit helper
  const isCafeFavorite = (id) => {
    return favoriteCafes.some((item) => String(item.id) === String(id));
  };

  const toggleCafeFavorite = (cafe) => {
    if (!cafe || !cafe.id) return;
    setFavoriteCafes((prev) => {
      const exists = prev.some((item) => String(item.id) === String(cafe.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(cafe.id));
      } else {
        return [...prev, cafe];
      }
    });
  };

  const totalFavorites = favoriteMenus.length + favoriteCafes.length;

  return (
    <FavoritesContext.Provider
      value={{
        favoriteMenus,
        favoriteCafes,
        isMenuFavorite,
        toggleMenuFavorite,
        isCafeFavorite,
        toggleCafeFavorite,
        totalFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
