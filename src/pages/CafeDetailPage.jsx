import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCafe } from '../hooks/useCafe.js';
import { useMenus } from '../hooks/useMenus.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80';
const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cafe, loading, error, refetch } = useCafe(id);
  const { data: allMenus } = useMenus();
  const { isCafeFavorite, toggleCafeFavorite, isMenuFavorite, toggleMenuFavorite } = useFavorites();

  const fav = cafe ? isCafeFavorite(cafe.id) : false;

  // Filter menu yang disajikan oleh kedai ini
  const cafeMenus = (allMenus || []).filter((m) => {
    return m.cafe_id === id || m.cafes?.id === id || m.cafes?.name === cafe?.name;
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  return (
    <div className="page-container detail-container">
      {/* Tombol Navigasi Atas */}
      <div className="detail-top-nav">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Kembali ke Kedai</span>
        </button>

        {cafe && (
          <button
            className={`btn-fav-detail ${fav ? 'active' : ''}`}
            onClick={() => toggleCafeFavorite(cafe)}
            title={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            aria-label="Favoritkan Kedai"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill={fav ? '#FF4D6D' : 'none'} stroke={fav ? '#FF4D6D' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{fav ? 'Tersimpan di Favorit' : 'Tambah Favorit'}</span>
          </button>
        )}
      </div>

      {/* State Loading */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Memuat informasi kedai...</p>
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

      {/* Konten Detail Kedai */}
      {!loading && !error && cafe && (
        <>
          <article className="detail-card">
            <div className="detail-image-box">
              <img
                src={cafe.image_url || DEFAULT_CAFE_IMAGE}
                alt={cafe.name}
                className="detail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_CAFE_IMAGE;
                }}
              />
              <span className="hours-pill-large">
                ⏱️ {cafe.open_hours || 'Buka setiap hari'}
              </span>
            </div>

            <div className="detail-content">
              <h1 className="detail-title">{cafe.name}</h1>

              <div className="cafe-info-banner">
                <span className="icon">📍</span>
                <div>
                  <strong>Alamat Lengkap:</strong>
                  <p>{cafe.address || 'Semarang, Jawa Tengah'}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Suasana & Daya Tarik</h3>
                <p className="detail-description">
                  {cafe.description || 'Kedai kopi nyaman untuk bersantai dan menikmati seduhan kopi berkualitas.'}
                </p>
              </div>

              <div className="detail-meta-box">
                <div className="meta-item">
                  <span className="meta-label">Jam Operasional</span>
                  <span className="meta-value">{cafe.open_hours || '09.00 - 22.00 WIB'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Fasilitas</span>
                  <span className="meta-value">Wi-Fi, Stopkontak, AC</span>
                </div>
              </div>
            </div>
          </article>

          {/* Daftar Menu yang Dijual oleh Kedai Ini */}
          <div className="cafe-menus-section">
            <div className="section-title-row">
              <h2 className="section-title">☕ Menu Kopi Pilihan di {cafe.name}</h2>
              <span className="brand-badge">{cafeMenus.length} Menu Tersedia</span>
            </div>

            {cafeMenus.length === 0 ? (
              <div className="state-box">
                <p>Belum ada daftar menu khusus yang terdata untuk kedai ini.</p>
              </div>
            ) : (
              <div className="card-list">
                {cafeMenus.map((menu) => {
                  const menuFav = isMenuFavorite(menu.id);
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
                        <span className="cafe-bar-name">{cafe.name}</span>
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
                          className={`btn-fav-card ${menuFav ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenuFavorite(menu);
                          }}
                          title={menuFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                          aria-label="Favoritkan Menu"
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill={menuFav ? '#FF4D6D' : 'none'} stroke={menuFav ? '#FF4D6D' : '#8D5120'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          </div>
        </>
      )}
    </div>
  );
};

export default CafeDetailPage;
