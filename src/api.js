import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllSongs = () => api.get('/songs/all-songs');
export const deleteSong = (id) => api.delete(`/songs/${id}`);
export const addSong = (formData) =>
  api.post('/songs/addSong', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const updateUserRole = (userId, newRole) =>
  api.put(`/users/${userId}/role`, { role: newRole });

const fetchDashboard = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/users/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data);
    setSongs(res.data.songs || []);
  } catch (err) {
    setError("Failed to load dashboard.");
  } finally {
    setLoading(false);
  }
};

export default api;
