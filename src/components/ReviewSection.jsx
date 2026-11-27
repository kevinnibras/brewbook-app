import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Data review otentik bawaan berdasarkan tipe & nama
const getPreseededReviews = (itemName, type) => {
  if (type === 'cafe') {
    return [
      {
        id: 'rev-c-1',
        name: 'Dinda Rahmadani',
        rating: 5,
        date: '2 hari yang lalu',
        comment: `Suasana di ${itemName} bener-bener nyaman dan asik buat kerja maupun santai. Baristanya ramah banget, aroma biji kopinya wangi semerbak begitu masuk pintu!`,
        tags: ['Tempat Cozy', 'Wi-Fi Cepat', 'Barista Ramah'],
        likes: 12
      },
      {
        id: 'rev-c-2',
        name: 'Budi Santoso',
        rating: 5,
        date: '5 hari yang lalu',
        comment: `Salah satu kedai kopi favorit di Semarang! Suasananya otentik, pilihan manual brew-nya lengkap, dan penyajiannya sangat berkelas. Selalu balik ke sini kalau lagi butuh inspirasi.`,
        tags: ['Rasa Mantap', 'Kopi Otentik'],
        likes: 8
      },
      {
        id: 'rev-c-3',
        name: 'Reza Pratama',
        rating: 4,
        date: '1 minggu yang lalu',
        comment: `Tempatnya estetik dan vintage. Sangat direkomendasikan buat yang suka ngopi sambil nongkrong sore. Stopkontak tersedia di banyak meja.`,
        tags: ['Estetik', 'Harga Worth It'],
        likes: 5
      }
    ];
  }

  // Ulasan untuk Menu Kopi
  return [
    {
      id: 'rev-m-1',
      name: 'Clarissa Amanda',
      rating: 5,
      date: 'Kemarin',
      comment: `Racikan ${itemName} ini juara banget! Keseimbangan rasa antara aroma biji kopi dan aftertaste-nya sangat pas di lidah, tidak terlalu asam dan tidak pahit berlebih.`,
      tags: ['Aroma Harum', 'Rasa Mantap', 'Sangat Segar'],
      likes: 15
    },
    {
      id: 'rev-m-2',
      name: 'Hendra Wijaya',
      rating: 5,
      date: '3 hari yang lalu',
      comment: `Salah satu seduhan terbaik yang pernah saya coba di Semarang. Karakter rasanya tebal dan konsisten. Sangat cocok dinikmati baik panas maupun dingin.`,
      tags: ['Kopi Otentik', 'Recommended'],
      likes: 9
    },
    {
      id: 'rev-m-3',
      name: 'Anisa Putri',
      rating: 4,
      date: '6 hari yang lalu',
      comment: `Porsi penyajiannya pas dan penampilannya cantik. Sangat worth it dengan harganya! Pasti bakal pesan lagi kalau mampir ke sini.`,
      tags: ['Harga Worth It', 'Porsi Pas'],
      likes: 4
    }
  ];
};

const ReviewSection = ({ itemId, itemName, type = 'menu' }) => {
  const { currentUser } = useAuth();
  const storageKey = `coffeespace_reviews_${type}_${itemId}`;

  // Ambil data ulasan dari localStorage atau gunakan seed default
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat review dari storage', e);
    }
    return getPreseededReviews(itemName, type);
  });

  // State Form Tulis Ulasan
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(currentUser?.name || '');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // Sync nama jika user login berubah
  useEffect(() => {
    if (currentUser?.name && !name) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  // Simpan ke localStorage setiap ada perubahan reviews
  const saveReviews = (newReviews) => {
    setReviews(newReviews);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newReviews));
    } catch (e) {
      console.warn('Gagal menyimpan review ke storage', e);
    }
  };

  // Statistik Rating
  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { average: 5.0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    const avg = (sum / reviews.length).toFixed(1);
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });
    return { average: avg, count: reviews.length, breakdown };
  }, [reviews]);

  const availableTags = type === 'cafe'
    ? ['Tempat Cozy', 'Wi-Fi Cepat', 'Barista Ramah', 'Kopi Otentik', 'Estetik', 'Harga Worth It']
    : ['Aroma Harum', 'Rasa Mantap', 'Aftertaste Manis', 'Recommended', 'Kopi Otentik', 'Harga Worth It'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleLike = (reviewId) => {
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, likes: (r.likes || 0) + 1 };
      }
      return r;
    });
    saveReviews(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      name: name.trim() || currentUser?.name || 'Penikmat Kopi',
      rating,
      date: 'Baru saja',
      comment: comment.trim(),
      tags: selectedTags,
      likes: 0
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    // Reset Form & Tampilkan Notifikasi
    setComment('');
    setSelectedTags([]);
    setShowForm(false);
    setToastMsg('Ulasan Anda berhasil diterbitkan.');
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <section className="detail-section reviews-section animate-fade-in">
      <div className="section-title-wrap between">
        <div className="title-left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#C58940" stroke="#C58940" strokeWidth="1.2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <div>
            <h3>Ulasan & Pengalaman Pembeli</h3>
            <p className="section-subtext">
              Pendapat asli dari para penikmat kopi yang telah mencoba {type === 'cafe' ? 'kedai' : 'menu'} ini
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-write-review-toggle"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Tutup Form' : 'Tulis Ulasan'}
        </button>
      </div>

      {toastMsg && (
        <div className="review-toast-banner">
          {toastMsg}
        </div>
      )}

      {/* Ringkasan Skor & Rating Bar */}
      <div className="review-summary-box">
        <div className="rating-score-card">
          <span className="rating-score-large">{stats.average}</span>
          <div className="rating-stars-large">
            {'★'.repeat(Math.round(stats.average))}
            {'☆'.repeat(5 - Math.round(stats.average))}
          </div>
          <span className="rating-count-label">
            Berdasarkan <strong>{stats.count}</strong> ulasan pembeli
          </span>
        </div>

        <div className="rating-breakdown-card">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.breakdown[star] || 0;
            const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
            return (
              <div key={star} className="rating-bar-row">
                <span className="bar-star-label">{star} ★</span>
                <div className="rating-progress-track">
                  <div className="rating-progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="bar-count-label">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Tulis Ulasan */}
      {showForm && (
        <form onSubmit={handleSubmit} className="review-form-card animate-fade-down">
          <h4 className="form-heading">Bagikan Ulasan Anda untuk {itemName}</h4>
          
          {/* Pilih Rating Bintang */}
          <div className="form-group">
            <label className="form-label">Beri Penilaian Bintang:</label>
            <div className="interactive-star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  title={`${star} Bintang`}
                >
                  ★
                </button>
              ))}
              <span className="rating-text-feedback">
                {rating === 5 ? 'Sangat Memuaskan (5/5)' : rating === 4 ? 'Memuaskan (4/5)' : rating === 3 ? 'Cukup Baik (3/5)' : rating === 2 ? 'Kurang (2/5)' : 'Perlu Ditingkatkan (1/5)'}
              </span>
            </div>
          </div>

          {/* Nama Pengulas */}
          <div className="form-group">
            <label className="form-label">Nama Anda:</label>
            <input
              type="text"
              className="review-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rian Coffee Lover"
              required
            />
          </div>

          {/* Tag Kesan Singkat */}
          <div className="form-group">
            <label className="form-label">Pilih Kesan (Opsional):</label>
            <div className="review-tag-selector">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`review-tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {selectedTags.includes(tag) ? '✓ ' : '+ '}
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Isi Ulasan */}
          <div className="form-group">
            <label className="form-label">Pengalaman Rasa & Suasana:</label>
            <textarea
              className="review-textarea"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                type === 'cafe'
                  ? 'Bagikan kesan Anda tentang suasana, kenyamanan, pelayanan, dan racikan kopi di kedai ini...'
                  : 'Ceritakan rasa seduhan, aroma, tingkat keasaman, atau keunikan racikan kopi ini...'
              }
              required
            />
          </div>

          <div className="review-form-actions">
            <button
              type="button"
              className="btn-cancel-review"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn-submit-review">
              Kirim Ulasan Sekarang
            </button>
          </div>
        </form>
      )}

      {/* Daftar Kartu Ulasan Pelanggan */}
      <div className="reviews-list">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-card-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="reviewer-name-row">
                    <strong className="reviewer-name">{rev.name}</strong>
                    <span className="verified-badge">✓ Terverifikasi</span>
                  </div>
                  <span className="review-date">{rev.date}</span>
                </div>
              </div>

              <div className="review-stars-badge">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>
            </div>

            {/* Tag Kesan */}
            {rev.tags && rev.tags.length > 0 && (
              <div className="review-card-tags">
                {rev.tags.map((t, idx) => (
                  <span key={idx} className="review-card-tag">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <p className="review-card-comment">{rev.comment}</p>

            <div className="review-card-footer">
              <button
                type="button"
                className="btn-like-review"
                onClick={() => handleLike(rev.id)}
                title="Tandai ulasan ini membantu"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                <span>Membantu ({rev.likes || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
