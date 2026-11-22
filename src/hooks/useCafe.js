import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

// Hook untuk mengambil satu detail kedai kopi berdasarkan ID
export const useCafe = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCafe = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/cafes/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat detail kedai kopi');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCafe();
  }, [fetchCafe]);

  return { data, loading, error, refetch: fetchCafe };
};
