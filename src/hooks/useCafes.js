import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

// Hook untuk mengambil seluruh daftar kedai kopi
export const useCafes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCafes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/cafes');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat kedai kopi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  return { data, loading, error, refetch: fetchCafes };
};
