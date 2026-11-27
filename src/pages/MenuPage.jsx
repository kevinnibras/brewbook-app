import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMenus } from '../hooks/useMenus.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import EmptySearchResult from '../components/EmptySearchResult.jsx';

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
  const [sortBy, setSortBy] = useState('price-asc'); // Default urutkan dari harga termurah
  const [isCafeDropdownOpen, setIsCafeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // Ambil daftar unik kedai kopi beserta jumlah menunya untuk opsi filter
  const uniqueCafes = useMemo(() => {
    const cafeMap = new Map();
    menus.forEach((m) => {
      const cafeId = m.cafes?.id || m.cafe_id;
      const cafeName = m.cafes?.name;
      if (cafeId && cafeName) {
        if (!cafeMap.has(cafeId)) {
          cafeMap.set(cafeId, { id: cafeId, name: cafeName, count: 0 });
        }
        cafeMap.get(cafeId).count += 1;
      }
    });
    return Array.from(cafeMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [menus]);

  // Objek kedai yang sedang aktif dipilih
  const selectedCafeObj = useMemo(() => {
    if (selectedCafe === 'Semua') return null;
    return uniqueCafes.find((c) => c.id === selectedCafe);
  }, [selectedCafe, uniqueCafes]);

  // Menutup dropdown saat klik di luar area atau tekan Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCafeDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCafeDropdownOpen(false);
      }
    };

    if (isCafeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCafeDropdownOpen]);

  // Filter menu berdasarkan query pencarian, kategori, kedai, dan urutan harga
  const filteredMenus = useMemo(() => {
    const result = menus.filter((menu) => {
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

    // Urutkan (Sorting)
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [menus, searchQuery, selectedCategory, selectedCafe, sortBy]);

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

      {/* Toolbar Filter Kedai & Urutkan Harga */}
      <div className="menu-toolbar-row">
        {/* Filter Kedai Kopi (Dropdown) */}
        {uniqueCafes.length > 0 && (
          <div className="cafe-filter-dropdown-container" ref={dropdownRef}>
            <span className="cafe-filter-label">Filter Kedai:</span>
            
            <div className="cafe-dropdown-control">
              <button
                type="button"
                className={`cafe-dropdown-btn ${isCafeDropdownOpen ? 'active' : ''} ${selectedCafe !== 'Semua' ? 'filtered' : ''}`}
                onClick={() => setIsCafeDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isCafeDropdownOpen}
              >
                <span className="cafe-dropdown-icon">
                  {selectedCafe === 'Semua' ? '🏛️' : '☕'}
                </span>
                <span className="cafe-dropdown-label">
                  {selectedCafeObj ? selectedCafeObj.name : `Semua Kedai (${menus.length})`}
                </span>
                {selectedCafeObj && (
                  <span className="cafe-dropdown-pill-count">
                    {selectedCafeObj.count} menu
                  </span>
                )}
                <svg
                  className={`cafe-dropdown-arrow ${isCafeDropdownOpen ? 'open' : ''}`}
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Tombol Clear / Reset Cepat jika sedang memfilter kedai tertentu */}
              {selectedCafe !== 'Semua' && (
                <button
                  type="button"
                  className="cafe-dropdown-reset-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCafe('Semua');
                  }}
                  title="Tampilkan Semua Kedai"
                  aria-label="Reset filter kedai"
                >
                  ✕
                </button>
              )}

              {/* Dropdown Menu List */}
              {isCafeDropdownOpen && (
                <div className="cafe-dropdown-popover" role="listbox">
                  <div className="cafe-dropdown-popover-header">
                    <span>PILIH KEDAI KOPI</span>
                    <span className="popover-meta">{uniqueCafes.length} Kedai Tersedia</span>
                  </div>

                  <div className="cafe-dropdown-popover-list">
                    {/* Opsi Semua Kedai */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedCafe === 'Semua'}
                      className={`cafe-dropdown-item ${selectedCafe === 'Semua' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCafe('Semua');
                        setIsCafeDropdownOpen(false);
                      }}
                    >
                      <div className="item-left">
                        <span className="item-icon">✨</span>
                        <span className="item-name">Semua Kedai</span>
                      </div>
                      <div className="item-right">
                        <span className="item-badge">{menus.length} menu</span>
                        {selectedCafe === 'Semua' && <span className="item-check">✓</span>}
                      </div>
                    </button>

                    <div className="cafe-dropdown-separator"></div>

                    {/* Daftar Pilihan Kedai */}
                    {uniqueCafes.map((c) => {
                      const isSelected = selectedCafe === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={`cafe-dropdown-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedCafe(c.id);
                            setIsCafeDropdownOpen(false);
                          }}
                        >
                          <div className="item-left">
                            <span className="item-icon">🏛️</span>
                            <span className="item-name">{c.name}</span>
                          </div>
                          <div className="item-right">
                            <span className="item-badge">{c.count} menu</span>
                            {isSelected && <span className="item-check">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pengurutan Harga (Sort Harga Murah ke Mahal) */}
        <div className="sort-filter-dropdown-container">
          <span className="sort-filter-label">Urutkan:</span>
          <div className="sort-select-wrapper">
            <span className="sort-icon-badge">⇅</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-native-select"
              aria-label="Urutkan Harga Menu Kopi"
            >
              <option value="price-asc">💵 Harga: Termurah → Termahal</option>
              <option value="price-desc">💎 Harga: Termahal → Termurah</option>
              <option value="default">✨ Rekomendasi Menu</option>
              <option value="name-asc">🔤 Nama (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

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

      {/* State Kosong Setelah Filter & Pencarian */}
      {!loading && !error && filteredMenus.length === 0 && (
        <EmptySearchResult
          query={searchQuery}
          category={selectedCategory}
          cafe={selectedCafe}
          type="menu"
          onReset={() => {
            setSearchQuery('');
            setSelectedCafe('Semua');
            setSortBy('price-asc');
            handleCategoryChange('Semua');
          }}
          onSelectSuggestion={(suggestion) => {
            setSearchQuery(suggestion);
          }}
        />
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
