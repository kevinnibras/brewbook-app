import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMenus } from '../hooks/useMenus.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';

const MenuPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'Semua';

  const { data: menus, loading, error, refetch } = useMenus();
  const { isMenuFavorite, toggleMenuFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [selectedCafe, setSelectedCafe] = useState('Semua');

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // Ambil daftar unik kedai kopi untuk opsi filter cepat
  const uniqueCafes = useMemo(() => {
    const cafeMap = new Map();
    menus.forEach((m) => {
      if (m.cafes?.id && m.cafes?.name) {
        cafeMap.set(m.cafes.id, m.cafes.name);
      }
    });
    return Array.from(cafeMap.entries()).map(([id, name]) => ({ id, name }));
  }, [menus]);

  // Filter menu berdasarkan query pencarian, kategori, dan kedai
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        menu.name?.toLowerCase().includes(query) ||
        menu.description?.toLowerCase().includes(query) ||
        menu.cafes?.name?.toLowerCase().includes(query) ||
        menu.categories?.name?.toLowerCase().includes(query);

      const catName = menu.categories?.name || '';
      let matchCat = true;
      if (selectedCategory !== 'Semua') {
        if (selectedCategory === 'Espresso') {
          matchCat = catName.toLowerCase().includes('espresso');
        } else if (selectedCategory === 'Manual') {
          matchCat = catName.toLowerCase().includes('manual');
        } else if (selectedCategory === 'Non-Coffee') {
          matchCat = catName.toLowerCase().includes('non');
        } else {
          matchCat = catName.toLowerCase().includes(selectedCategory.toLowerCase());
        }
      }

      let matchCafe = true;
      if (selectedCafe !== 'Semua') {
        matchCafe = menu.cafe_id === selectedCafe || menu.cafes?.id === selectedCafe;
      }

      return matchSearch && matchCat && matchCafe;
    });
  }, [menus, searchQuery, selectedCategory, selectedCafe]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'Semua') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: category });
    }
  };

  return (
    <div className="page-container menu-page">
      <header className="page-header">
        <div className="header-brand">
          <span className="brand-badge">Coffee Space</span>
          <h1>Katalog Menu Kopi</h1>
        </div>
        <p className="header-subtitle">
          Jelajahi beragam seduhan kopi spesialti lengkap dengan kedai penyajinya di Semarang
        </p>
      </header>

      {/* Input Pencarian */}
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Cari kopi, nama kedai (Tekodeko, Spiegel...), racikan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      {/* Filter Kategori Minuman */}
      <div className="category-filter-bar">
        {['Semua', 'Espresso', 'Manual', 'Non-Coffee'].map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat === 'Semua' ? '✨ Semua Jenis' : cat === 'Espresso' ? '☕ Espresso Based' : cat === 'Manual' ? '⚗️ Manual Brew' : '🍵 Non-Coffee'}
          </button>
        ))}
      </div>

      {/* Filter Kedai Kopi (Opsional Pills) */}
      {uniqueCafes.length > 0 && (
        <div className="cafe-filter-bar">
          <span className="cafe-filter-label">Filter Kedai:</span>
          <button
            className={`filter-pill-sm ${selectedCafe === 'Semua' ? 'active' : ''}`}
            onClick={() => setSelectedCafe('Semua')}
          >
            Semua Kedai ({menus.length})
          </button>
          {uniqueCafes.map((c) => (
            <button
              key={c.id}
              className={`filter-pill-sm ${selectedCafe === c.id ? 'active' : ''}`}
              onClick={() => setSelectedCafe(c.id)}
            >
              🏛️ {c.name}
            </button>
          ))}
        </div>
      )}

      {/* State Loading */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Memuat menu kopi dan kedai penyajinya...</p>
        </div>
      )}

      {/* State Error */}
      {error && !loading && (
        <div className="state-box error-box">
          <p className="error-text">⚠️ {error}</p>
          <button className="btn-retry" onClick={refetch}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* State Kosong Setelah Filter */}
      {!loading && !error && filteredMenus.length === 0 && (
        <div className="state-box">
          <p>Tidak ditemukan menu kopi yang cocok.</p>
          {(searchQuery || selectedCategory !== 'Semua' || selectedCafe !== 'Semua') && (
            <button
              className="btn-retry mt-8"
              onClick={() => {
                setSearchQuery('');
                setSelectedCafe('Semua');
                handleCategoryChange('Semua');
              }}
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* Daftar Menu Kopi */}
      {!loading && !error && filteredMenus.length > 0 && (
        <div className="card-list">
          {filteredMenus.map((menu) => {
            const fav = isMenuFavorite(menu.id);
            const cafeName = menu.cafes?.name || 'Kedai Kopi Semarang';
            return (
              <div
                key={menu.id}
                className="menu-card"
                onClick={() => navigate(`/menu/${menu.id}`)}
                role="button"
                tabIndex={0}
              >
                {/* Info Kedai Kopi Penyaji di Atas Gambar */}
                <div className="card-cafe-bar">
                  <span className="cafe-bar-icon">🏛️</span>
                  <span className="cafe-bar-name" title={cafeName}>{cafeName}</span>
                </div>

                {/* Wrapper Gambar Menu */}
                <div className="card-image-wrapper">
                  <img
                    src={menu.image_url || DEFAULT_COFFEE_IMAGE}
                    alt={menu.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_COFFEE_IMAGE;
                    }}
                  />
                  <span className="category-pill">
                    {menu.categories?.name || 'Kopi'}
                  </span>
                  <button
                    className={`btn-fav-card ${fav ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenuFavorite(menu);
                    }}
                    title={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                    aria-label="Favoritkan Menu"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill={fav ? '#FF4D6D' : 'none'} stroke={fav ? '#FF4D6D' : '#8D5120'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>

                {/* Body Informasi Menu */}
                <div className="card-body">
                  <h3 className="card-title">{menu.name}</h3>
                  <div className="card-meta-line">
                    <p className="card-price">{formatRupiah(menu.price)}</p>
                    {menu.serving_size && (
                      <span className="card-size-tag">📏 {menu.serving_size}</span>
                    )}
                  </div>
                  {menu.ingredients && (
                    <p className="card-ingredients-line" title={menu.ingredients}>
                      <span className="card-ingredients-label">🌿 Bahan:</span> {menu.ingredients}
                    </p>
                  )}
                  <p className="card-desc-snippet">
                    {menu.description || 'Klik untuk melihat detail racikan ini.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
