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
            <h4>Tentang Coffee Space</h4>
            <p>Katalog panduan kedai kopi otentik dan kurasi racikan spesialti terbaik di Kota Semarang.</p>
            <p className="footer-author">Semarang, Jawa Tengah</p>
            <div className="footer-pwa-badge">
              <span>☕ Nikmati Kopi Terbaik Setiap Hari</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Coffee Space. Semarang Coffee Catalog & Community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
