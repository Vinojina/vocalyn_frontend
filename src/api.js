import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SONG APIs
export const fetchAllSongs = () => api.get('/songs/all-songs');
export const deleteSong = (id) => api.delete(`/songs/${id}`);
export const addSong = (formData) =>
  api.post('/songs/addSong', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// USER APIs
export const updateUserRole = (userId, newRole) =>
  api.put(`/users/${userId}/role`, { role: newRole });

// DASHBOARD FETCH (you should move this to a React hook or DashboardPage file)
export const fetchDashboard = async (setUser, setSongs, setLoading, setError) => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/users/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data);
    setSongs(res.data.songs || []);
  } catch (err) {
    setError('Failed to load dashboard.');
  } finally {
    setLoading(false);
  }
};

// FEEDBACK API (send audio file to backend for analysis and AI feedback)
export const sendRecordingForFeedback = async (formData) => {
  const res = await api.post('/songs/recordings', formData);
  return res.data;
};

export default api;
