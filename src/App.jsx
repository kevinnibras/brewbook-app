import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import MenuPage from './pages/MenuPage.jsx';
import MenuDetailPage from './pages/MenuDetailPage.jsx';
import CafePage from './pages/CafePage.jsx';
import CafeDetailPage from './pages/CafeDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            {/* Halaman 1 & 2: Menu dan Detail Menu */}
            <Route path="/" element={<MenuPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<MenuDetailPage />} />

            {/* Halaman 3 & 4: Kedai dan Detail Kedai */}
            <Route path="/kedai" element={<CafePage />} />
            <Route path="/kedai/:id" element={<CafeDetailPage />} />

            {/* Halaman 5: Profil / About */}
            <Route path="/about" element={<AboutPage />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
