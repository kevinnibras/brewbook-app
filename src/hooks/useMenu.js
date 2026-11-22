import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

// Hook untuk mengambil satu detail menu berdasarkan ID
export const useMenu = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/menus/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat detail menu');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return { data, loading, error, refetch: fetchMenu };
};
