import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenus } from '../hooks/useMenus.js';
import { useCafes } from '../hooks/useCafes.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';
const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: menus, loading: loadingMenus } = useMenus();
  const { data: cafes, loading: loadingCafes } = useCafes();
  const { isMenuFavorite, toggleMenuFavorite, isCafeFavorite, toggleCafeFavorite } = useFavorites();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // Ambil 3 menu rekomendasi teratas
  const featuredMenus = menus.slice(0, 3);
  // Ambil 2 kedai populer teratas
  const featuredCafes = cafes.slice(0, 2);

  return (
    <div className="page-container home-page">
      {/* Header Beranda & Greeting */}
      <header className="page-header home-header">
        <div className="header-greeting-row">
          <div>
            <span className="brand-badge">Selamat Datang 👋</span>
            <h1 className="home-title">Halo, Kevin! ☕</h1>
            <p className="header-subtitle">Mau seduh atau cari kedai kopi apa hari ini?</p>
          </div>
          <button 
            className="home-profile-avatar-btn" 
            onClick={() => navigate('/profile')}
            title="Buka Profil"
            aria-label="Profil Pengguna"
          >
            <span>KN</span>
          </button>
        </div>
      </header>

      {/* Hero Banner Promo / Insight */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">🌟 Spesialti Semarang</span>
          <h2 className="hero-headline">Koleksi Racikan & Kedai Kopi Terbaik</h2>
          <p className="hero-desc">
            Temukan aroma seduhan khas nusantara hingga rekomendasi tempat nongkrong estetik.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => navigate('/menu')}>
              Jelajahi Menu
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('/kedai')}>
              Cari Kedai
            </button>
          </div>
        </div>
      </section>

      {/* Kategori Populer Cepat */}
      <section className="home-section">
        <div className="section-title-row">
          <h2 className="section-title">Kategori Minuman</h2>
          <button className="btn-see-all" onClick={() => navigate('/menu')}>
            Semua Menu &rarr;
          </button>
        </div>
        <div className="quick-categories">
          <div className="category-card" onClick={() => navigate('/menu?cat=Espresso')}>
            <span className="cat-icon">☕</span>
            <span className="cat-name">Espresso</span>
          </div>
          <div className="category-card" onClick={() => navigate('/menu?cat=Manual')}>
            <span className="cat-icon">⚗️</span>
            <span className="cat-name">Manual Brew</span>
          </div>
          <div className="category-card" onClick={() => navigate('/menu?cat=Non-Coffee')}>
            <span className="cat-icon">🍵</span>
            <span className="cat-name">Non-Coffee</span>
          </div>
        </div>
      </section>

      {/* Menu Rekomendasi Hari Ini */}
      <section className="home-section">
        <div className="section-title-row">
          <h2 className="section-title">✨ Rekomendasi Menu Hari Ini</h2>
          <button className="btn-see-all" onClick={() => navigate('/menu')}>
            Lihat Semua
          </button>
        </div>

        {loadingMenus ? (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Menyiapkan racikan...</p>
          </div>
        ) : (
          <div className="card-list">
            {featuredMenus.map((menu) => {
              const fav = isMenuFavorite(menu.id);
              return (
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
                      className={`btn-fav-card ${fav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenuFavorite(menu);
                      }}
                      title={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                      aria-label="Favoritkan Menu"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill={fav ? '#E53935' : 'none'} stroke={fav ? '#E53935' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              );
            })}
          </div>
        )}
      </section>

      {/* Kedai Populer Semarang */}
      <section className="home-section">
        <div className="section-title-row">
          <h2 className="section-title">🏛️ Kedai Favorit Semarang</h2>
          <button className="btn-see-all" onClick={() => navigate('/kedai')}>
            Lihat Semua
          </button>
        </div>

        {loadingCafes ? (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Mencari kedai...</p>
          </div>
        ) : (
          <div className="card-list">
            {featuredCafes.map((cafe) => {
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
                    <p className="cafe-address">📍 {cafe.address}</p>
                    <p className="card-desc-snippet">{cafe.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Coffee Quote / Card Tips */}
      <section className="quote-card">
        <span className="quote-mark">“</span>
        <p className="quote-text">
          Kopi yang nikmat selalu punya cerita, dan tempat yang tepat membuatnya berharga.
        </p>
        <span className="quote-author">— Coffee Space Semarang</span>
      </section>
    </div>
  );
};

export default HomePage;
