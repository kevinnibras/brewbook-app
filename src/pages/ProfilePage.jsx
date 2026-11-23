import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';
const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { favoriteMenus, favoriteCafes } = useFavorites();
  const { currentUser, updateProfile, logout } = useAuth();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const userName = currentUser?.name || 'Kevin Nibras Kusuma';
  const userBio = currentUser?.bio || 'Pencinta aroma kopi otentik dan penjelajah kedai kopi nusantara.';
  const userEmail = currentUser?.email || 'kevin.nibras@coffeespace.id';

  // State Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Form edit temp state
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);
  const [tempEmail, setTempEmail] = useState(userEmail);

  // Sinkronkan form temp jika currentUser berubah
  useEffect(() => {
    if (currentUser) {
      setTempName(currentUser.name);
      setTempBio(currentUser.bio || '');
      setTempEmail(currentUser.email);
    }
  }, [currentUser]);

  // Deteksi koneksi jaringan
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Coffee Space - Katalog Menu & Kedai Kopi',
          text: `Jelajahi kopi pilihan bersama ${userName} di Coffee Space!`,
          url: window.location.origin
        });
      } catch {
        // dibatalkan pengguna
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: tempName,
      email: tempEmail,
      bio: tempBio
    });
    setIsEditModalOpen(false);
    showToast('Profil Anda berhasil diperbarui!');
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Inisial avatar
  const getInitials = (name) => {
    if (!name) return 'CS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  return (
    <div className="page-container profile-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      <header className="page-header profile-header">
        <div className="header-brand">
          <span className="brand-badge">Akun Pengguna</span>
          <h1>Profil User</h1>
        </div>
        <p className="header-subtitle">Kelola koleksi favorit dan pengaturan akun Anda di Coffee Space</p>
      </header>

      <div className="profile-desktop-grid">
        {/* Kolom Kiri: Profil Hero & Aksi */}
        <div className="profile-col-left">
          <div className="user-profile-hero">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                <span>{getInitials(userName)}</span>
              </div>
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Online' : 'Offline'}></span>
            </div>

            <h2 className="user-name">{userName}</h2>
            <p className="user-email-text">{userEmail}</p>
            <span className="user-role-badge">☕ Coffee Enthusiast • Member</span>
            <p className="user-bio-text">{userBio}</p>

            {/* Statistik Pengguna */}
            <div className="user-stats-row">
              <div className="stat-box" onClick={() => navigate('/favorit')} role="button" tabIndex={0} title="Buka Kopi Favorit">
                <span className="stat-number">{favoriteMenus.length}</span>
                <span className="stat-label">Kopi Favorit</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box" onClick={() => navigate('/favorit')} role="button" tabIndex={0} title="Buka Kedai Disimpan">
                <span className="stat-number">{favoriteCafes.length}</span>
                <span className="stat-label">Kedai Disimpan</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="btn-profile-edit-trigger"
              onClick={() => {
                setTempName(userName);
                setTempBio(userBio);
                setTempEmail(userEmail);
                setIsEditModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Edit Profil Saya</span>
            </button>

            <button className="btn-profile-share" onClick={handleShare}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>{copied ? '✅ Link Berhasil Disalin!' : 'Bagikan Coffee Space'}</span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Koleksi Favorit & Pengaturan Akun */}
        <div className="profile-col-right">
          {/* ================= CARD 1: KOLEKSI FAVORIT ================= */}
          <div className="info-card profile-section-card">
            <div className="card-header-with-action">
              <div>
                <h3 className="section-title">
                  <span className="title-icon">❤️</span> Koleksi Favorit
                </h3>
                <p className="section-subtitle">Kopi dan kedai yang disimpan untuk kunjungan berikutnya</p>
              </div>
              <button className="btn-link-action" onClick={() => navigate('/favorit')}>
                Buka Favorit &rarr;
              </button>
            </div>

            {/* Preview Kopi Favorit */}
            <div className="fav-preview-container">
              <div className="fav-preview-header">
                <span className="fav-preview-label">☕ Menu Kopi Disimpan ({favoriteMenus.length})</span>
                <span className="fav-quick-tip">Klik untuk melihat detail menu</span>
              </div>

              {favoriteMenus.length > 0 ? (
                <div className="fav-horizontal-scroll">
                  {favoriteMenus.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="fav-mini-card"
                      onClick={() => navigate(`/menu/${item.id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={item.image_url || DEFAULT_COFFEE_IMAGE}
                        alt={item.name}
                        className="fav-mini-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_COFFEE_IMAGE;
                        }}
                      />
                      <div className="fav-mini-info">
                        <h4 className="fav-mini-title">{item.name}</h4>
                        <p className="fav-mini-cafe">🏛️ {item.cafes?.name || 'Kedai Kopi'}</p>
                        <p className="fav-mini-price">{formatRupiah(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="fav-empty-inline">
                  <p>Belum ada kopi yang disimpan di koleksi.</p>
                  <button className="btn-mini-browse" onClick={() => navigate('/menu')}>
                    Jelajahi Menu Kopi
                  </button>
                </div>
              )}
            </div>

            {/* Preview Kedai Kopi Favorit */}
            <div className="fav-preview-container mt-16">
              <div className="fav-preview-header">
                <span className="fav-preview-label">🏛️ Kedai Kopi Disimpan ({favoriteCafes.length})</span>
                <span className="fav-quick-tip">Klik untuk melihat suasana kedai</span>
              </div>

              {favoriteCafes.length > 0 ? (
                <div className="fav-horizontal-scroll">
                  {favoriteCafes.slice(0, 3).map((cafe) => (
                    <div
                      key={cafe.id}
                      className="fav-mini-card"
                      onClick={() => navigate(`/kedai/${cafe.id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={cafe.image_url || DEFAULT_CAFE_IMAGE}
                        alt={cafe.name}
                        className="fav-mini-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_CAFE_IMAGE;
                        }}
                      />
                      <div className="fav-mini-info">
                        <h4 className="fav-mini-title">{cafe.name}</h4>
                        <p className="fav-mini-cafe">📍 {cafe.address || 'Semarang'}</p>
                        <p className="fav-mini-hours">⏰ {cafe.open_hours || 'Buka Setiap Hari'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="fav-empty-inline">
                  <p>Belum ada kedai kopi favorit yang disimpan.</p>
                  <button className="btn-mini-browse" onClick={() => navigate('/kedai')}>
                    Jelajahi Kedai Kopi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= CARD 2: PENGATURAN AKUN ================= */}
          <div className="info-card profile-section-card">
            <div className="card-header-with-action">
              <div>
                <h3 className="section-title">
                  <span className="title-icon">⚙️</span> Pengaturan Akun
                </h3>
                <p className="section-subtitle">Edit profil dan logout akun</p>
              </div>
            </div>

            <div className="settings-list-group">
              {/* 1. Edit Profil */}
              <div
                className="settings-row-item"
                onClick={() => {
                  setTempName(userName);
                  setTempBio(userBio);
                  setTempEmail(userEmail);
                  setIsEditModalOpen(true);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="settings-icon-circle">
                  <span>✏️</span>
                </div>
                <div className="settings-text-block">
                  <strong className="settings-name">Edit Profil Pengguna</strong>
                  <p className="settings-desc">Ubah nama tampilan, email kontak, dan biografi profil</p>
                </div>
                <span className="settings-arrow">&rarr;</span>
              </div>

              {/* 2. Logout */}
              <div
                className="settings-row-item logout-row"
                onClick={() => setIsLogoutModalOpen(true)}
                role="button"
                tabIndex={0}
              >
                <div className="settings-icon-circle logout-icon-circle">
                  <span>🚪</span>
                </div>
                <div className="settings-text-block">
                  <strong className="settings-name logout-text">Logout / Keluar</strong>
                  <p className="settings-desc">Akhiri sesi penggunaan akun Coffee Space pada perangkat ini</p>
                </div>
                <span className="settings-arrow logout-arrow">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL EDIT PROFIL ================= */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Profil Pengguna</h3>
              <button className="btn-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProfile} className="modal-form">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Kontak</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Biografi Singkat</label>
                <textarea
                  rows="3"
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Ceritakan ketertarikanmu tentang kopi..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-modal-submit">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL LOGOUT ================= */}
      {isLogoutModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="modal-window modal-window-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚪 Konfirmasi Logout</h3>
              <button className="btn-modal-close" onClick={() => setIsLogoutModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="logout-confirm-text">
                Apakah Anda yakin ingin keluar dari akun <strong>{userName}</strong> di Coffee Space?
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-modal-logout"
                onClick={handleLogout}
              >
                Ya, Keluar Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
