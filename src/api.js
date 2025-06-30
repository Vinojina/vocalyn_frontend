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

export default api;
