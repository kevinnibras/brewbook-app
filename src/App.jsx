import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import DesktopNavbar from './components/DesktopNavbar.jsx';
import BottomNav from './components/BottomNav.jsx';
import Footer from './components/Footer.jsx';

import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import MenuDetailPage from './pages/MenuDetailPage.jsx';
import CafePage from './pages/CafePage.jsx';
import CafeDetailPage from './pages/CafeDetailPage.jsx';
import FavoritePage from './pages/FavoritePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import './App.css';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="app-container">
          {/* Header Navigasi untuk Desktop & Laptop */}
          <DesktopNavbar />

          {/* Konten Halaman Utama */}
          <main className="main-content">
            <Routes>
              {/* Beranda (Home) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/beranda" element={<Navigate to="/" replace />} />

              {/* Katalog Menu & Detail Menu */}
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu/:id" element={<MenuDetailPage />} />

              {/* Rekomendasi Kedai & Detail Kedai */}
              <Route path="/kedai" element={<CafePage />} />
              <Route path="/kedai/:id" element={<CafeDetailPage />} />

              {/* Halaman Favorit */}
              <Route path="/favorit" element={<FavoritePage />} />

              {/* Halaman Profil User */}
              <Route path="/profile" element={<ProfilePage />} />
              {/* Redirect /about ke /profile */}
              <Route path="/about" element={<Navigate to="/profile" replace />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer untuk Desktop */}
          <Footer />

          {/* Bottom Navigation Bar (Khusus Tampilan Mobile) */}
          <BottomNav />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
