# BrewBook App - Frontend Progressive Web App (PWA)

Frontend Progressive Web App (PWA) untuk Tugas Akhir Praktikum Pengembangan Perangkat Bergerak (PPB).

## Identitas Pengembang
* **Nama**: Kevin Nibras Kusuma
* **NIM**: 21120124140131
* **Mata Kuliah**: Praktikum Pengembangan Perangkat Bergerak

---

## Deskripsi Singkat
BrewBook App adalah aplikasi web berbasis PWA bertema kopi modern yang menyajikan katalog menu kopi spesialti dan rekomendasi kedai kopi di Kota Semarang. Aplikasi dirancang mobile-first, memiliki navigasi bawah (bottom navigation), mendukung instalasi ke perangkat (Add to Home Screen), serta mampu berjalan secara offline berkat Service Worker dan Workbox caching.

---

## Fitur Utama & Ketentuan Wajib
- [x] **API Buatan Sendiri**: Terhubung dengan RESTful API `brewbook-api` via Axios.
- [x] **Bottom Navigation Bar**: 3 tab (Menu, Kedai, About) yang tetap aktif saat berada di sub-halaman/detail.
- [x] **Minimal 5 Halaman**:
  1. Halaman Menu Kopi (`/`)
  2. Halaman Detail Menu Kopi (`/menu/:id`)
  3. Halaman Daftar Kedai Kopi (`/kedai`)
  4. Halaman Detail Kedai Kopi (`/kedai/:id`)
  5. Halaman Profil / About (`/about`)
- [x] **List & Detail Interaktif**: Klik pada item menu atau kedai membuka halaman detail lengkap.
- [x] **Full PWA Experience**:
  - `manifest.webmanifest` lengkap dengan nama, ikon 192px & 512px (termasuk maskable), warna tema `#4A2C11`, dan display `standalone`.
  - Service Worker dengan precache aset statis dan runtime cache API menggunakan strategi **NetworkFirst**.
  - Cache gambar eksternal menggunakan strategi **CacheFirst**.
  - Dapat diakses secara offline dan di-install di Android/iOS/Desktop.
- [x] **Mobile-First & Clean UI**: Murni CSS3 modern tanpa Tailwind atau library UI eksternal.

---

## Teknologi yang Digunakan
* **Framework**: React 19 + Vite
* **Routing**: React Router DOM (v7)
* **HTTP Client**: Axios
* **PWA Engine**: `vite-plugin-pwa` + Workbox
* **Styling**: Native CSS3 (Mobile-First responsive layout)
* **Hosting**: Vercel Cloud Platform

---

## Struktur Folder
```text
brewbook-app/
├── public/
│   ├── favicon.svg
│   ├── icon-192.png       # Ikon PWA 192x192
│   └── icon-512.png       # Ikon PWA 512x512
├── src/
│   ├── components/
│   │   └── BottomNav.jsx  # Komponen Bottom Navigation Bar
│   ├── hooks/
│   │   ├── useCafe.js     # Hook detail kedai
│   │   ├── useCafes.js    # Hook daftar kedai
│   │   ├── useMenu.js     # Hook detail menu
│   │   └── useMenus.js    # Hook daftar menu
│   ├── pages/
│   │   ├── AboutPage.jsx      # Halaman Profil Mahasiswa
│   │   ├── CafeDetailPage.jsx # Halaman Detail Kedai Kopi
│   │   ├── CafePage.jsx       # Halaman List Kedai Kopi
│   │   ├── MenuDetailPage.jsx # Halaman Detail Menu Kopi
│   │   └── MenuPage.jsx       # Halaman List Menu Kopi
│   ├── services/
│   │   └── api.js         # Axios instance & base URL konfigurasi
│   ├── App.css            # Styling komponen & tema kopi
│   ├── App.jsx            # Rute React Router
│   ├── index.css          # Styling global & root container
│   └── main.jsx           # Entry point & registrasi Service Worker
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vercel.json            # SPA rewrite routing Vercel
└── vite.config.js         # Konfigurasi Vite & Workbox PWA
```

---

## Cara Menjalankan Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/<username>/brewbook-app.git
   cd brewbook-app
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Buat file `.env`:**
   ```bash
   cp .env.example .env
   ```
   Atur URL backend (gunakan port 3000 jika backend berjalan lokal):
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan terbuka di `http://localhost:5173`.

5. **Build dan Preview PWA:**
   ```bash
   npm run build
   npm run preview
   ```

---

## Deploy ke Vercel

1. Push commit ke GitHub.
2. Import repository `brewbook-app` di Vercel.
3. Framework Preset: **Vite**.
4. Tambahkan **Environment Variable**:
   - `VITE_API_URL`: URL API yang sudah dideploy (misal: `https://brewbook-api.vercel.app`)
5. Klik **Deploy**.
