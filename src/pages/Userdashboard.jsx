import { useEffect, useState } from 'react';
import api from '../api';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState('beginner');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState(0); // progress percentage 0-100

  useEffect(() => {
    fetchUserData();
    fetchSongs();
    fetchProgress();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/user/profile');
      setUser(res.data);
    } catch {
      setError('Failed to load user info');
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await api.get(`/songs/level/${level}`);
      setSongs(res.data);
    } catch {
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get('/user/progress'); // assuming backend endpoint
      // backend returns { completed: 3, total: 5 }
      const { completed, total } = res.data;
      setProgress(Math.round((completed / total) * 100));
    } catch {
      setProgress(0);
    }
  };


  const handleBuyPremium = (song) => {
    alert(`Redirecting to payment for: ${song.title}`);
  };

  const updateUser = async (updates) => {
    try {
      const res = await api.put(`/user/${user._id}`, updates); // assumes user._id is available
      setUser(res.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handlePractice = (song) => {
    const newScore = Math.floor(Math.random() * 100);
    const feedbackComment = 'Great tone! Try to keep a consistent rhythm.';
  
    setAiFeedback({
      score: newScore,
      comment: feedbackComment,
      song: song.title,
    });
  
    setShowFeedback(true);
  
    // Optional: Update progress in backend
    // You may want to increment the completed count, adjust as needed:
    if (user && typeof user.completed === 'number') {
      updateUser({ completed: user.completed + 1 });
    }
  };
  
  

  const renderSongs = (status) => {
    const filtered = songs.filter((song) => song.status === status);
    return filtered.length === 0 ? (
      <p className="text-gray-200">No {status} songs available.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((song) => (
          <div
            key={song._id}
            className="bg-white bg-opacity-90 rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-purple-900">{song.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    song.status === 'premium'
                      ? 'bg-pink-300 text-pink-900'
                      : 'bg-purple-300 text-purple-900'
                  }`}
                >
                  {song.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-purple-700 mb-1">{song.artist}</p>
              <p className="text-xs italic text-purple-500">{song.genre}</p>
            </div>

            <div className="mt-5">
              {status === 'free' ? (
                <button
                  onClick={() => handlePractice(song)}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded font-semibold transition"
                >
                  Practice 🎤
                </button>
              ) : (
                <button
                  onClick={() => handleBuyPremium(song)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold transition"
                >
                  Unlock Premium ⭐
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-purple-700 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold mb-1 text-purple-900">
              Welcome, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              Ready to improve your singing today?
            </p>

            {/* Progress Bar */}
            <div className="mt-6 max-w-sm">
              <p className="font-semibold mb-1 text-purple-900">Training Progress</p>
              <div className="w-full bg-purple-300 rounded-full h-5">
                <div
                  className="bg-pink-500 h-5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-purple-900 font-semibold">{progress}% completed</p>
            </div>
          </div>

          <div className="bg-pink-600 bg-opacity-90 text-white px-6 py-3 rounded-full text-xl font-bold tracking-wide shadow-lg select-none">
            Level: {level.charAt(0).toUpperCase() + level.slice(1)}
          </div>
        </div>

        {error && (
          <p className="text-red-300 text-center mb-6 font-semibold">{error}</p>
        )}

        {loading ? (
          <p className="text-center text-purple-200 text-lg">Loading songs...</p>
        ) : (
          <>
            <section className="mb-16">
              <h2 className="text-3xl font-extrabold mb-6 border-b border-pink-300 pb-3">
                Free Songs
              </h2>
              {renderSongs('free')}
            </section>

            <section>
              <h2 className="text-3xl font-extrabold mb-6 border-b border-purple-300 pb-3">
                Premium Songs
              </h2>
              {renderSongs('premium')}
            </section>
          </>
        )}

        {/* AI Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-lg text-purple-900">
              <h3 className="text-2xl font-bold mb-4 text-pink-600">AI Feedback</h3>
              <p className="mb-2 font-semibold">{aiFeedback.song}</p>
              <p className="mb-1">Score: {aiFeedback.score}/100</p>
              <p className="mb-6 text-gray-700">{aiFeedback.comment}</p>
              <button
                onClick={() => setShowFeedback(false)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
