import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenus } from '../hooks/useMenus.js';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';

const MenuPage = () => {
  const navigate = useNavigate();
  const { data: menus, loading, error, refetch } = useMenus();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-brand">
          <span className="brand-badge">BrewBook</span>
          <h1>Katalog Menu Kopi</h1>
        </div>
        <p className="header-subtitle">Jelajahi beragam racikan kopi spesialti pilihan</p>
      </header>

      {/* State Loading */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Memuat menu kopi...</p>
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
      {!loading && !error && menus.length === 0 && (
        <div className="state-box">
          <p>Belum ada menu kopi yang tersedia.</p>
        </div>
      )}

      {/* Daftar Menu */}
      {!loading && !error && menus.length > 0 && (
        <div className="card-list">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="menu-card"
              onClick={() => navigate(`/menu/${menu.id}`)}
              role="button"
              tabIndex={0}
            >
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
              </div>
              <div className="card-body">
                <h3 className="card-title">{menu.name}</h3>
                <p className="card-price">{formatRupiah(menu.price)}</p>
                <p className="card-desc-snippet">
                  {menu.description || 'Klik untuk melihat detail racikan ini.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
