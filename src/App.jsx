import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
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
import AuthPage from './pages/AuthPage.jsx';

import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className={`app-container ${isAuthPage ? 'auth-layout' : ''}`}>
      {/* Header Navigasi Desktop hanya tampil jika bukan di halaman login */}
      {!isAuthPage && <DesktopNavbar />}

      {/* Konten Utama */}
      <main className={isAuthPage ? 'auth-main' : 'main-content'}>
        <Routes>
          {/* Rute Publik: Login & Register */}
          <Route path="/login" element={<AuthPage />} />

          {/* Rute Terproteksi: Harus Login Terlebih Dahulu */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/beranda" element={<Navigate to="/" replace />} />

          {/* Katalog Menu & Detail Menu */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/:id"
            element={
              <ProtectedRoute>
                <MenuDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rekomendasi Kedai & Detail Kedai */}
          <Route
            path="/kedai"
            element={
              <ProtectedRoute>
                <CafePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kedai/:id"
            element={
              <ProtectedRoute>
                <CafeDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Halaman Favorit */}
          <Route
            path="/favorit"
            element={
              <ProtectedRoute>
                <FavoritePage />
              </ProtectedRoute>
            }
          />

          {/* Halaman Profil User */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<Navigate to="/profile" replace />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer & BottomNav hanya tampil jika bukan di halaman login */}
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <AppContent />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
