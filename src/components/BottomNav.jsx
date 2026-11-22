import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Menentukan tab mana yang aktif
  // Tab Menu aktif di root '/' atau halaman '/menu/...'
  const isMenuActive = currentPath === '/' || currentPath.startsWith('/menu');
  // Tab Kedai aktif di '/kedai' atau '/kedai/...'
  const isCafeActive = currentPath.startsWith('/kedai');
  // Tab About aktif di '/about'
  const isAboutActive = currentPath === '/about';

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${isMenuActive ? 'active' : ''}`}
        onClick={() => navigate('/')}
        aria-label="Menu Kopi"
      >
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <span>Menu</span>
      </button>

      <button
        className={`nav-item ${isCafeActive ? 'active' : ''}`}
        onClick={() => navigate('/kedai')}
        aria-label="Kedai Kopi"
      >
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Kedai</span>
      </button>

      <button
        className={`nav-item ${isAboutActive ? 'active' : ''}`}
        onClick={() => navigate('/about')}
        aria-label="Tentang Pembuat"
      >
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path>
        </svg>
        <span>About</span>
      </button>
    </nav>
  );
};

export default BottomNav;
