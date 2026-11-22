import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCafes } from '../hooks/useCafes.js';

const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80';

const CafePage = () => {
  const navigate = useNavigate();
  const { data: cafes, loading, error, refetch } = useCafes();

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-brand">
          <span className="brand-badge">Semarang</span>
          <h1>Daftar Kedai Kopi</h1>
        </div>
        <p className="header-subtitle">Rekomendasi tempat ngopi dan bersantai terbaik</p>
      </header>

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
      {!loading && !error && cafes.length === 0 && (
        <div className="state-box">
          <p>Belum ada daftar kedai kopi yang tersedia.</p>
        </div>
      )}

      {/* Daftar Kedai */}
      {!loading && !error && cafes.length > 0 && (
        <div className="card-list">
          {cafes.map((cafe) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CafePage;
