// Updated Admin Dashboard UI with matching gradient style and cohesive soft palette

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import the api instance

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, adminUsers: 0, regularUsers: 0 });
  const [songs, setSongs] = useState([]);
  const [songForm, setSongForm] = useState({ title: '', artist: '', genre: '', level: 'beginner', status: 'free' });
  const [audioFile, setAudioFile] = useState(null);
  const [lyricsFile, setLyricsFile] = useState(null);
  const [selectedSection, setSelectedSection] = useState('users');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.isAdmin) navigate('/');
      } catch {
        navigate('/login');
      }
    };
    checkAdmin();
    fetchUsers();
    fetchSongs();
    setLoading(false);
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      updateStats(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError('Failed to load users');
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await api.get('/admin/all-songs');
      setSongs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load songs');
    }
  };

  const handleSongUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(songForm).forEach(([k, v]) => data.append(k, v));
    data.append('audio', audioFile);
    if (lyricsFile) data.append('lyricsFile', lyricsFile);

    try {
      await axios.post('/api/songs/addSong', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchSongs();
      setSongForm({ title: '', artist: '', genre: '', level: 'beginner', status: 'free' });
      setAudioFile(null);
      setLyricsFile(null);
    } catch {
      alert('Upload failed');
    }
  };

  const handleSongDelete = async (id) => {
    if (!window.confirm('Delete this song?')) return;
    try {
      await axios.delete(`/api/songs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSongs();
    } catch {
      alert('Delete failed');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUsers = users.map(u => u._id === userId ? { ...u, role: newRole } : u);
      setUsers(updatedUsers);
      updateStats(updatedUsers);
    } catch {
      setError('Role update failed');
    }
  };

  const updateStats = (users) => {
    setStats({
      totalUsers: users.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const SongItem = ({ song, onDelete }) => (
    <li key={song._id} className="bg-white p-5 rounded-lg shadow flex justify-between items-center hover:shadow-md transition border-l-4 border-pink-200">
      <div className="w-full">
        <p className="text-lg font-semibold text-gray-800">{song.title} - {song.artist}</p>
        <p className="text-sm text-gray-500">{song.level} | {song.status} | {song.genre}</p>
        <audio controls src={`http://localhost:5000${song.audioUrl}`} className="mt-2 w-full" />
      </div>
      <button onClick={() => onDelete(song._id)} className="ml-6 px-4 py-2 bg-rose-400 text-white rounded hover:bg-rose-500">Delete</button>
    </li>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#fffaf0] via-[#fefcea] to-[#f9f9f9]">
      <aside className="w-64 bg-white text-gray-700 px-6 py-8 shadow-md">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav className="flex flex-col space-y-4">
          <button onClick={() => setSelectedSection('users')} className={`text-left py-2 px-4 rounded ${selectedSection === 'users' ? 'bg-amber-100 text-gray-800 font-semibold shadow' : 'hover:bg-amber-50'}`}>User Management</button>
          <button onClick={() => setSelectedSection('songs')} className={`text-left py-2 px-4 rounded ${selectedSection === 'songs' ? 'bg-amber-100 text-gray-800 font-semibold shadow' : 'hover:bg-amber-50'}`}>Song Management</button>
          <button onClick={handleLogout} className="text-left py-2 px-4 text-rose-500 hover:text-rose-700">Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow-sm text-center border-t-4 border-pink-200">
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm text-center border-t-4 border-orange-200">
            <p className="text-2xl font-bold text-gray-800">{stats.adminUsers}</p>
            <p className="text-sm text-gray-500">Admins</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm text-center border-t-4 border-green-200">
            <p className="text-2xl font-bold text-gray-800">{stats.regularUsers}</p>
            <p className="text-sm text-gray-500">Regular Users</p>
          </div>
        </div>

        {selectedSection === 'users' && (
          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">User Management</h3>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <table className="w-full text-left">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t">
                    <td className="py-2">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-2 py-1">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {selectedSection === 'songs' && (
          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Song Management</h3>
            <form onSubmit={handleSongUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input name="title" value={songForm.title} onChange={e => setSongForm({ ...songForm, title: e.target.value })} placeholder="Title" required className="border border-gray-300 rounded px-3 py-2" />
              <input name="artist" value={songForm.artist} onChange={e => setSongForm({ ...songForm, artist: e.target.value })} placeholder="Artist" required className="border border-gray-300 rounded px-3 py-2" />
              <input name="genre" value={songForm.genre} onChange={e => setSongForm({ ...songForm, genre: e.target.value })} placeholder="Genre" className="border border-gray-300 rounded px-3 py-2" />
              <select name="level" value={songForm.level} onChange={e => setSongForm({ ...songForm, level: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select name="status" value={songForm.status} onChange={e => setSongForm({ ...songForm, status: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} required className="border border-gray-300 rounded px-3 py-2" />
              <input type="file" accept=".lrc,.txt" onChange={e => setLyricsFile(e.target.files[0])} className="border border-gray-300 rounded px-3 py-2" />
              <button type="submit" className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500">Upload</button>
            </form>
            <ul className="space-y-6">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <li key={level}>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2 capitalize">{level} Songs</h4>
                  {songs.filter(song => song.level === level).length === 0 ? (
                    <p className="text-gray-400">No {level} songs.</p>
                  ) : (
                    <ul className="space-y-4">
                      {songs.filter(song => song.level === level).map(song => (
                        <SongItem key={song._id} song={song} onDelete={handleSongDelete} />
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default Admin;
