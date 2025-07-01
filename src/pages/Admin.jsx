import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  });
  const [songs, setSongs] = useState([]);
  const [songForm, setSongForm] = useState({
    title: '', artist: '', genre: '', level: 'beginner', status: 'free'
  });
  const [audioFile, setAudioFile] = useState(null);
  const [lyricsFile, setLyricsFile] = useState(null);
  const [songsLoading, setSongsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        if (!user.isAdmin) navigate('/');
      } catch (err) {
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
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location = '/login';
      }
      throw error;
    }
  };

  const fetchSongs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/songs/all-songs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Songs fetched:', response.data);
      setSongs(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch songs:', {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });
      
      if (err.response?.status === 401) {
        // Handle unauthorized
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to load songs');
      }
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Song uploaded!');
      fetchSongs();
      setSongForm({ title: '', artist: '', genre: '', level: 'beginner', status: 'free' });
      setAudioFile(null);
      setLyricsFile(null);
    } catch (err) {
      alert('Failed to upload song');
      console.error(err);
    }
  };

  const handleSongDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await axios.delete(`/api/songs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchSongs();
    } catch (err) {
      alert('Failed to delete song');
      console.error(err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = users.map(user => user._id === userId ? { ...user, role: newRole } : user);
      setUsers(updatedUsers);
      updateStats(updatedUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const updateStats = (users) => {
    setStats({
      totalUsers: users.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Helper to group songs by level
  const groupSongsByLevel = (songs) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    return levels.map(level => ({
      level,
      songs: songs.filter(song => song.status === approved)
    }));
  };

  // Song item component
  const SongItem = ({ song, onDelete }) => (
    <li key={song._id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
      <div>
        <p className="font-semibold">{song.title} - {song.artist}</p>
        <p className="text-sm">{song.level} | {song.status} | {song.genre}</p>
        <audio controls src={`http://localhost:5000${song.audioUrl}`} className="mt-2 w-full" />
      </div>
      <button
        onClick={() => onDelete(song._id)}
        className="text-red-600 hover:underline"
      >Delete</button>
    </li>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r shadow-sm p-4">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <ul className="space-y-3">
          <li><a href="#users" className="text-blue-600 hover:underline">User Management</a></li>
          <li><a href="#songs" className="text-blue-600 hover:underline">Song Management</a></li>
          <li><button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button></li>
        </ul>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">👥 Total Users: {stats.totalUsers}</div>
          <div className="bg-white p-4 rounded shadow">👑 Admins: {stats.adminUsers}</div>
          <div className="bg-white p-4 rounded shadow">👤 Users: {stats.regularUsers}</div>
        </div>

        <section id="users" className="bg-white p-4 rounded shadow mb-10">
          <h3 className="text-lg font-medium mb-4">User Management</h3>
          {error && <p className="text-red-600">{error}</p>}
          <table className="w-full text-left">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="songs" className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-4">Song Management</h3>

          <form onSubmit={handleSongUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input name="title" value={songForm.title} onChange={e => setSongForm({ ...songForm, title: e.target.value })} placeholder="Title" required />
            <input name="artist" value={songForm.artist} onChange={e => setSongForm({ ...songForm, artist: e.target.value })} placeholder="Artist" required />
            <input name="genre" value={songForm.genre} onChange={e => setSongForm({ ...songForm, genre: e.target.value })} placeholder="Genre" />
            <select name="level" value={songForm.level} onChange={e => setSongForm({ ...songForm, level: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select name="status" value={songForm.status} onChange={e => setSongForm({ ...songForm, status: e.target.value })}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} required />
            <input type="file" accept=".lrc,.txt" onChange={e => setLyricsFile(e.target.files[0])} />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
          </form>

          <div className="space-y-8">
            {/* Beginner Songs */}
            <div>
              <h3 className="text-lg font-bold mb-3">Beginner Songs</h3>
              {songs.filter(song => song.level === 'beginner').length === 0 ? (
                <div className="text-gray-500">No beginner songs.</div>
              ) : (
                songs.filter(song => song.level === 'beginner').map(song => (
                  <SongItem key={song._id} song={song} onDelete={handleSongDelete} />
                ))
              )}
            </div>

            {/* Intermediate Songs */}
            <div>
              <h3 className="text-lg font-bold mb-3">Intermediate Songs</h3>
              {songs.filter(song => song.level === 'intermediate').length === 0 ? (
                <div className="text-gray-500">No intermediate songs.</div>
              ) : (
                songs.filter(song => song.level === 'intermediate').map(song => (
                  <SongItem key={song._id} song={song} onDelete={handleSongDelete} />
                ))
              )}
            </div>

            {/* Advanced Songs */}
            <div>
              <h3 className="text-lg font-bold mb-3">Advanced Songs</h3>
              {songs.filter(song => song.level === 'advanced').length === 0 ? (
                <div className="text-gray-500">No advanced songs.</div>
              ) : (
                songs.filter(song => song.level === 'advanced').map(song => (
                  <SongItem key={song._id} song={song} onDelete={handleSongDelete} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
