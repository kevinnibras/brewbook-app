import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu.js';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';

const MenuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: menu, loading, error, refetch } = useMenu(id);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  return (
    <div className="page-container detail-container">
      {/* Tombol Kembali */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Kembali ke Menu</span>
      </button>

      {/* State Loading */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Memuat detail menu...</p>
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
            <span className="category-pill-large">
              {menu.categories?.name || 'Kopi Spesialti'}
            </span>
          </div>

          <div className="detail-content">
            <div className="detail-title-row">
              <h1 className="detail-title">{menu.name}</h1>
              <span className="detail-price">{formatRupiah(menu.price)}</span>
            </div>

            <div className="detail-section">
              <h3>Deskripsi Rasa & Penyajian</h3>
              <p className="detail-description">
                {menu.description || 'Tidak ada deskripsi tambahan untuk racikan menu ini.'}
              </p>
            </div>

            <div className="detail-meta-box">
              <div className="meta-item">
                <span className="meta-label">Kategori</span>
                <span className="meta-value">{menu.categories?.name || '-'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Penyajian</span>
                <span className="meta-value">Panas / Dingin</span>
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default MenuDetailPage;
