import React from 'react';

const AboutPage = () => {
  return (
    <div className="page-container about-container">
      <header className="page-header text-center">
        <span className="brand-badge">Profil Mahasiswa</span>
        <h1>Tentang Pengembang</h1>
        <p className="header-subtitle">Tugas Akhir Praktikum Pengembangan Perangkat Bergerak</p>
      </header>

      {/* Kartu Profil */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span>KN</span>
        </div>
        <h2 className="profile-name">Kevin Nibras Kusuma</h2>
        <p className="profile-nim">NIM: 21120124140131</p>
        <span className="profile-badge">Teknik Komputer - Praktikum PPB</span>
      </div>

      {/* Informasi Proyek */}
      <div className="info-card">
        <h3>☕ Judul Proyek</h3>
        <p className="project-title">
          <strong>Coffee Space: Katalog Menu dan Kedai Kopi Berbasis PWA</strong>
        </p>
        <p className="project-desc">
          Aplikasi katalog digital interaktif untuk eksplorasi aneka varian kopi dan rekomendasi kedai kopi di Kota Semarang. Dirancang menggunakan arsitektur Progressive Web App (PWA) agar dapat diakses secara cepat, responsif, dan mendukung mode offline.
        </p>
      </div>

      {/* Daftar Teknologi */}
      <div className="info-card">
        <h3>🛠️ Teknologi yang Digunakan</h3>
        <div className="tech-grid">
          <div className="tech-item">
            <span className="tech-cat">Frontend</span>
            <strong>React 19 + Vite</strong>
            <p>UI Component-based & Fast Build</p>
          </div>
          <div className="tech-item">
            <span className="tech-cat">Routing</span>
            <strong>React Router v7</strong>
            <p>SPA Navigation & Dynamic URL</p>
          </div>
          <div className="tech-item">
            <span className="tech-cat">Backend</span>
            <strong>Node.js + Express</strong>
            <p>RESTful API MVC Pattern</p>
          </div>
          <div className="tech-item">
            <span className="tech-cat">Database</span>
            <strong>Supabase (PostgreSQL)</strong>
            <p>Cloud Relational DB & RLS</p>
          </div>
          <div className="tech-item">
            <span className="tech-cat">PWA Engine</span>
            <strong>vite-plugin-pwa + Workbox</strong>
            <p>Service Worker & Offline Cache</p>
          </div>
          <div className="tech-item">
            <span className="tech-cat">Deployment</span>
            <strong>Vercel Cloud Platform</strong>
            <p>CI/CD Hosting Frontend & Serverless</p>
          </div>
        </div>
      </div>

      {/* Fitur PWA */}
      <div className="info-card">
        <h3>📱 Keunggulan Fitur PWA</h3>
        <ul className="feature-list">
          <li><strong>Add to Home Screen:</strong> Dapat di-install langsung ke homescreen smartphone tanpa Play Store.</li>
          <li><strong>Offline Access:</strong> Service Worker mencache aset statis dan API (strategi NetworkFirst) sehingga aplikasi tetap dapat dibuka saat tidak ada koneksi internet.</li>
          <li><strong>Standalone Experience:</strong> Tampilan aplikasi layar penuh seperti aplikasi native Android/iOS.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
