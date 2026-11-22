import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

// Hook untuk mengambil seluruh daftar menu
export const useMenus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/menus');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat menu kopi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return { data, loading, error, refetch: fetchMenus };
};
