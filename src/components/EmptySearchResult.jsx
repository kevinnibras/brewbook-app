import React from 'react';

const EmptySearchResult = ({
  query = '',
  category = 'Semua',
  cafe = 'Semua',
  type = 'menu', // 'menu' | 'cafe'
  onReset,
  onSelectSuggestion
}) => {
  const isMenu = type === 'menu';
  const suggestions = isMenu
    ? ['Espresso', 'Manual Brew', 'Gendhis', 'Tekodeko', 'Latte']
    : ['Kota Lama', 'Tembalang', 'Pleburan', 'Tekodeko', 'Spiegel'];

  return (
    <div className="empty-search-container animate-fade-in">
      {/* Ilustrasi Vektor Kopi & Kaca Pembesar */}
      <div className="empty-search-illustration">
        <svg
          viewBox="0 0 240 200"
          width="200"
          height="160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="empty-search-svg"
        >
          {/* Soft Background Glow Circle */}
          <circle cx="120" cy="110" r="75" fill="#F4ECE1" opacity="0.8" />
          
          {/* Tatakan Piring Cangkir */}
          <ellipse cx="115" cy="148" rx="58" ry="12" fill="#E6DAC8" />
          <ellipse cx="115" cy="146" rx="52" ry="10" fill="#FAF6F0" />

          {/* Cangkir Kopi */}
          <path
            d="M80 92h70v36a35 35 0 0 1-70 0V92z"
            fill="#FFFFFF"
            stroke="#8D5120"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Permukaan Kopi di Dalam Cangkir */}
          <ellipse cx="115" cy="94" rx="33" ry="8" fill="#5A3A1E" />
          <ellipse cx="115" cy="94" rx="27" ry="5.5" fill="#3E2410" />
          <ellipse cx="110" cy="93" rx="10" ry="2.5" fill="#8D5120" opacity="0.6" />

          {/* Gagang Cangkir */}
          <path
            d="M150 98c12 0 19 8 19 18s-7 18-19 18"
            stroke="#8D5120"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Uap Hangat Berkelok */}
          <path
            d="M100 78c-4-7 4-13 0-20"
            stroke="#C58940"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M115 74c-4-8 5-14 1-22"
            stroke="#C58940"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M130 78c-4-7 4-13 0-20"
            stroke="#C58940"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Kaca Pembesar (Magnifying Glass) yang Mencari */}
          <g transform="translate(130, 60)">
            <circle
              cx="32"
              cy="32"
              r="24"
              fill="#FFFFFF"
              fillOpacity="0.85"
              stroke="#C58940"
              strokeWidth="4"
            />
            {/* Pantulan Kaca */}
            <path
              d="M18 24a18 18 0 0 1 18-14"
              stroke="#E8D5C4"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Tanda Tanya di Dalam Kaca Pembesar */}
            <text
              x="32"
              y="39"
              textAnchor="middle"
              fill="#8D5120"
              fontSize="20"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ?
            </text>
            {/* Gagang Kaca Pembesar */}
            <line
              x1="49"
              y1="49"
              x2="72"
              y2="72"
              stroke="#8D5120"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* Bintang Kilau Kecil */}
          <path d="M72 65l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#C58940" opacity="0.6" />
          <path d="M60 125l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#C58940" opacity="0.5" />
        </svg>
      </div>

      {/* Pesan & Deskripsi Informatif */}
      <div className="empty-search-body">
        <h3 className="empty-search-title">
          {isMenu ? 'Menu Kopi Tidak Ditemukan' : 'Kedai Kopi Tidak Ditemukan'}
        </h3>
        
        <p className="empty-search-desc">
          {query ? (
            <>
              Tidak ada hasil yang cocok dengan kata kunci <strong className="empty-search-highlight">"{query}"</strong>.
            </>
          ) : category !== 'Semua' || cafe !== 'Semua' ? (
            <>
              Tidak ada menu yang sesuai dengan filter kategori atau kedai yang sedang aktif.
            </>
          ) : (
            <>
              Maaf, belum ada item yang sesuai dengan kriteria filter saat ini.
            </>
          )}
        </p>

        <p className="empty-search-subdesc">
          Coba periksa kembali ejaan kata kunci, gunakan istilah yang lebih umum, atau reset filter untuk menampilkan semua pilihan.
        </p>

        {/* Saran Kata Kunci Populer */}
        {suggestions && suggestions.length > 0 && onSelectSuggestion && (
          <div className="empty-search-suggestions">
            <span className="suggestions-label">Coba kata kunci populer:</span>
            <div className="suggestions-chips">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => onSelectSuggestion(item)}
                >
                  🔍 {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Aksi Reset */}
        {onReset && (
          <div className="empty-search-actions">
            <button type="button" className="btn-reset-search" onClick={onReset}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 2v6h6"></path>
                <path d="M21.5 22v-6h-6"></path>
                <path d="M22 11.5A10 10 0 0 0 3.2 7.2L2.5 8"></path>
                <path d="M2 12.5a10 10 0 0 0 18.8 4.3l.7-.8"></path>
              </svg>
              <span>Reset Pencarian & Filter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptySearchResult;
