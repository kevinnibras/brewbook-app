import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCafe } from '../hooks/useCafe.js';

const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80';

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cafe, loading, error, refetch } = useCafe(id);

  return (
    <div className="page-container detail-container">
      {/* Tombol Kembali */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Kembali ke Daftar Kedai</span>
      </button>

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
      )}
    </div>
  );
};

export default CafeDetailPage;
