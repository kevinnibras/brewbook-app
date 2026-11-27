import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import ReviewSection from '../components/ReviewSection.jsx';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';

const MenuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: menu, loading, error, refetch } = useMenu(id);
  const { isMenuFavorite, toggleMenuFavorite } = useFavorites();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  const fav = menu ? isMenuFavorite(menu.id) : false;

  // Pisahkan string komposisi menjadi array tags
  const ingredientsList = menu?.ingredients
    ? menu.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  return (
    <div className="page-container detail-container">
      {/* Tombol Navigasi Atas */}
      <div className="detail-top-nav">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Kembali ke Menu</span>
        </button>

        {menu && (
          <button
            className={`btn-fav-detail ${fav ? 'active' : ''}`}
            onClick={() => toggleMenuFavorite(menu)}
            title={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            aria-label="Favoritkan Menu"
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
          <p>Memuat detail menu racikan kopi...</p>
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

      {/* Konten Detail Menu */}
      {!loading && !error && menu && (
        <>
          <article className="detail-card">
          <div className="detail-image-box">
            <img
              src={menu.image_url || DEFAULT_COFFEE_IMAGE}
              alt={menu.name}
              className="detail-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_COFFEE_IMAGE;
              }}
            />
            <div className="detail-image-badges">
              <span className="category-pill-large">
                {menu.categories?.name || 'Kopi Spesialti'}
              </span>
              {menu.serving_size && (
                <span className="size-pill-image">
                  📏 {menu.serving_size}
                </span>
              )}
            </div>
          </div>

          <div className="detail-content">
            {/* Judul & Harga */}
            <div className="detail-title-row">
              <div className="detail-title-group">
                <h1 className="detail-title">{menu.name}</h1>
                <div className="detail-header-badges">
                  <span className="badge-detail-sub category-sub">
                    🏷️ {menu.categories?.name || 'Kopi'}
                  </span>
                  {menu.serving_size && (
                    <span className="badge-detail-sub size-sub">
                      📏 Porsi: <strong>{menu.serving_size}</strong>
                    </span>
                  )}
                </div>
              </div>
              <div className="detail-price-box">
                <span className="detail-price-label">Harga Resmi</span>
                <span className="detail-price">{formatRupiah(menu.price)}</span>
              </div>
            </div>

            {/* Banner Kedai Kopi Penyaji */}
            <div className="detail-cafe-banner">
              <div className="detail-cafe-info">
                <span className="detail-cafe-label">🏛️ Kedai Penyaji Menu Ini:</span>
                <h3 className="detail-cafe-name">{menu.cafes?.name || 'Kedai Kopi Semarang'}</h3>
                <p className="detail-cafe-address">📍 {menu.cafes?.address || 'Semarang, Jawa Tengah'}</p>
              </div>
              {(menu.cafe_id || menu.cafes?.id) && (
                <button
                  className="btn-detail-cafe-link"
                  onClick={() => navigate(`/kedai/${menu.cafe_id || menu.cafes?.id}`)}
                >
                  Lihat Kedai &rarr;
                </button>
              )}
            </div>

            {/* Deskripsi Rasa & Karakter */}
            <div className="detail-section">
              <div className="section-title-wrap">
                <span className="section-icon">☕</span>
                <h3>Deskripsi Rasa & Karakter</h3>
              </div>
              <p className="detail-description">
                {menu.description || 'Tidak ada deskripsi tambahan untuk racikan menu ini.'}
              </p>
            </div>

            {/* Komposisi & Racikan Bahan (Ingredients) */}
            <div className="detail-section ingredients-section">
              <div className="section-title-wrap">
                <span className="section-icon">🌿</span>
                <h3>Komposisi & Racikan Bahan</h3>
              </div>
              <p className="ingredients-lead-text">
                Kombinasi bahan baku otentik yang diracik untuk menghasilkan segelas <strong>{menu.name}</strong>:
              </p>
              
              {ingredientsList.length > 0 ? (
                <div className="ingredients-chip-grid">
                  {ingredientsList.map((ingredient, idx) => (
                    <div key={idx} className="ingredient-chip-item">
                      <span className="ingredient-chip-bullet">✦</span>
                      <span className="ingredient-chip-name">{ingredient}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail-description text-italic">
                  {menu.ingredients || 'Kopi spesialti murni, air terfiltrasi, dan bahan pilihan.'}
                </p>
              )}
            </div>

            {/* Grid Spesifikasi & Detail Penyajian */}
            <div className="detail-meta-box">
              <div className="meta-item">
                <span className="meta-label">🏷️ Kategori</span>
                <span className="meta-value">{menu.categories?.name || '-'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">🏛️ Kedai Kopi</span>
                <span className="meta-value">{menu.cafes?.name || 'Kota Semarang'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">📏 Ukuran Saji</span>
                <span className="meta-value highlight-value">{menu.serving_size || '250 ml'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">❄️ Penyajian</span>
                <span className="meta-value">
                  {menu.name.toLowerCase().includes('iced') || menu.name.toLowerCase().includes('float')
                    ? 'Dingin Berisi Es'
                    : menu.name.toLowerCase().includes('espresso')
                    ? 'Hangat (Double Shot)'
                    : 'Panas / Dingin'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">⚡ Metode Racik</span>
                <span className="meta-value">
                  {menu.categories?.name?.includes('Manual')
                    ? 'Manual Filter Brewing'
                    : menu.categories?.name?.includes('Espresso')
                    ? 'Espresso Machine 9 Bar'
                    : 'Handcrafted Artisanal'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">⏱️ Ketersediaan</span>
                <span className="meta-value">Tersedia Setiap Hari</span>
              </div>
            </div>
          </div>
        </article>

        {/* Bagian Ulasan & Pengalaman Pembeli */}
        <ReviewSection itemId={menu.id} itemName={menu.name} type="menu" />
        </>
      )}
    </div>
  );
};

export default MenuDetailPage;