const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const api = {
  health: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Backend offline');
      return await res.json();
    } catch (err) {
      throw new Error('Backend offline');
    }
  },
  predict: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Prediction failed');
    return data;
  },
  getCases: async () => {
    const res = await fetch(`${API_BASE_URL}/cases`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch cases');
    return data;
  }
};
