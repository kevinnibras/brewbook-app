import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';
const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80';

const FavoritePage = () => {
  const navigate = useNavigate();
  const {
    favoriteMenus,
    favoriteCafes,
    toggleMenuFavorite,
    toggleCafeFavorite
  } = useFavorites();

  const [activeTab, setActiveTab] = useState('menus'); // 'menus' | 'cafes'

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  return (
    <div className="page-container favorite-page">
      <header className="page-header">
        <div className="header-brand">
          <span className="brand-badge">Koleksi Saya</span>
          <h1>Daftar Favorit ❤️</h1>
        </div>
        <p className="header-subtitle">
          Kopi dan kedai yang kamu sukai tersimpan rapi di sini
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === 'menus' ? 'active' : ''}`}
          onClick={() => setActiveTab('menus')}
        >
          ☕ Menu Kopi ({favoriteMenus.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'cafes' ? 'active' : ''}`}
          onClick={() => setActiveTab('cafes')}
        >
          🏛️ Kedai Kopi ({favoriteCafes.length})
        </button>
      </div>

      {/* Konten Tab Menus */}
      {activeTab === 'menus' && (
        <div className="fav-content">
          {favoriteMenus.length === 0 ? (
            <div className="empty-fav-box">
              <span className="empty-icon">☕</span>
              <h3>Belum Ada Menu Favorit</h3>
              <p>
                Kamu belum menandai menu kopi favoritmu. Buka katalog dan klik ikon hati untuk menyimpan menu di sini!
              </p>
              <button className="btn-explore-fav" onClick={() => navigate('/menu')}>
                Jelajahi Menu Kopi
              </button>
            </div>
          ) : (
            <div className="card-list">
              {favoriteMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="menu-card"
                  onClick={() => navigate(`/menu/${menu.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-cafe-bar">
                    <span className="cafe-bar-icon">🏛️</span>
                    <span className="cafe-bar-name">{menu.cafes?.name || 'Kedai Kopi Semarang'}</span>
                  </div>
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
                      className="btn-fav-card active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenuFavorite(menu);
                      }}
                      title="Hapus dari favorit"
                      aria-label="Hapus dari Favorit"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#E53935" stroke="#E53935" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
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
                    <p className="card-desc-snippet">{menu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Konten Tab Cafes */}
      {activeTab === 'cafes' && (
        <div className="fav-content">
          {favoriteCafes.length === 0 ? (
            <div className="empty-fav-box">
              <span className="empty-icon">🏛️</span>
              <h3>Belum Ada Kedai Favorit</h3>
              <p>
                Belum ada kedai kopi yang kamu simpan. Temukan tempat nongkrong asik dan tandai kedai favoritmu!
              </p>
              <button className="btn-explore-fav" onClick={() => navigate('/kedai')}>
                Cari Kedai Kopi
              </button>
            </div>
          ) : (
            <div className="card-list">
              {favoriteCafes.map((cafe) => (
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
                      className="btn-fav-card active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCafeFavorite(cafe);
                      }}
                      title="Hapus dari favorit"
                      aria-label="Hapus dari Favorit"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#E53935" stroke="#E53935" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{cafe.name}</h3>
                    <p className="cafe-address">📍 {cafe.address}</p>
                    <p className="card-desc-snippet">{cafe.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
