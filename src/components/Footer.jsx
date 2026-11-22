import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">☕</span>
              <span className="logo-text">Coffee Space</span>
            </div>
            <p className="footer-tagline">
              Katalog digital racikan kopi spesialti dan rekomendasi kedai kopi favorit di Kota Semarang. Dibangun menggunakan arsitektur Progressive Web App (PWA) modern.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Navigasi</h4>
            <ul>
              <li><button onClick={() => navigate('/')}>Beranda</button></li>
              <li><button onClick={() => navigate('/menu')}>Katalog Menu</button></li>
              <li><button onClick={() => navigate('/kedai')}>Kedai Kopi</button></li>
              <li><button onClick={() => navigate('/favorit')}>Daftar Favorit</button></li>
              <li><button onClick={() => navigate('/profile')}>Profil Pengguna</button></li>
            </ul>
          </div>

          <div className="footer-info-group">
            <h4>Akademik & Proyek</h4>
            <p><strong>Praktikum PPB 2026</strong></p>
            <p>Teknik Komputer Universitas Diponegoro</p>
            <p className="footer-author">Pengembang: <strong>Kevin Nibras Kusuma</strong> (21120124140131)</p>
            <div className="footer-pwa-badge">
              <span>⚡ PWA Offline Ready • React 19 + Express</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Coffee Space. Dibuat untuk Tugas Akhir Praktikum Pengembangan Perangkat Bergerak.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
