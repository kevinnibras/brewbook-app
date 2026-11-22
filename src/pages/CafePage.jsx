import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCafes } from '../hooks/useCafes.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80';

const CafePage = () => {
  const navigate = useNavigate();
  const { data: cafes, loading, error, refetch } = useCafes();
  const { isCafeFavorite, toggleCafeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      return (
        cafe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [cafes, searchQuery]);

  return (
    <div className="page-container cafe-page">
      <header className="page-header">
        <div className="header-brand">
          <span className="brand-badge">Semarang</span>
          <h1>Daftar Kedai Kopi</h1>
        </div>
        <p className="header-subtitle">Rekomendasi tempat ngopi dan bersantai terbaik</p>
      </header>

      {/* Input Pencarian Kedai */}
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Cari kedai, Kota Lama, Tembalang..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      {/* State Loading */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Memuat daftar kedai...</p>
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

      {/* State Kosong */}
      {!loading && !error && filteredCafes.length === 0 && (
        <div className="state-box">
          <p>Tidak ditemukan kedai kopi yang cocok.</p>
          {searchQuery && (
            <button className="btn-retry mt-8" onClick={() => setSearchQuery('')}>
              Reset Pencarian
            </button>
          )}
        </div>
      )}

      {/* Daftar Kedai */}
      {!loading && !error && filteredCafes.length > 0 && (
        <div className="card-list">
          {filteredCafes.map((cafe) => {
            const fav = isCafeFavorite(cafe.id);
            return (
              <div
                key={cafe.id}
                className="cafe-card"
                onClick={() => navigate(`/kedai/${cafe.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="card-image-wrapper">
                  <img
                    src={cafe.image_url || DEFAULT_CAFE_IMAGE}
                    alt={cafe.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_CAFE_IMAGE;
                    }}
                  />
                  <span className="hours-pill">
                    ⏱️ {cafe.open_hours || 'Buka setiap hari'}
                  </span>
                  <button
                    className={`btn-fav-card ${fav ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCafeFavorite(cafe);
                    }}
                    title={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                    aria-label="Favoritkan Kedai"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill={fav ? '#E53935' : 'none'} stroke={fav ? '#E53935' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{cafe.name}</h3>
                  <p className="cafe-address">
                    📍 {cafe.address || 'Kota Semarang'}
                  </p>
                  <p className="card-desc-snippet">
                    {cafe.description || 'Klik untuk informasi fasilitas dan suasana kedai ini.'}
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

export default CafePage;
