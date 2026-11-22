import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App.jsx';

// Registrasi Service Worker PWA agar aplikasi dapat di-cache & diakses secara offline
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Versi baru BrewBook tersedia.');
  },
  onOfflineReady() {
    console.log('BrewBook siap digunakan secara offline.');
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
