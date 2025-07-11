import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Set token for authenticated requests
const token = localStorage.getItem("auth_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/users/dashboard");
        setUser(res.data);
        setSongs(res.data.songs || []);
      } catch (err) {
        console.error("❌ Dashboard error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDelete = async (songId) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    setDeleting(songId);
    try {
      await axios.delete(`/api/users/songs/${songId}`);
      setSongs((prev) => prev.filter((song) => song._id !== songId));
    } catch (err) {
      alert("Failed to delete song.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-300">{error}</div>;

  return (
    <div className="relative min-h-screen bg-[#0c011a] flex flex-col items-center px-4 py-10 text-white animate-fade-in overflow-hidden">
      {/* 🔮 Background Emojis */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-6xl text-white/10 animate-pulse">🎵</div>
        <div className="absolute top-[30%] right-[8%] text-7xl text-white/5 rotate-12">🎶</div>
        <div className="absolute bottom-[20%] left-[10%] text-6xl text-white/10 animate-bounce">🎧</div>
        <div className="absolute bottom-[10%] right-[5%] text-8xl text-white/5 -rotate-12">🎼</div>
        <div className="absolute top-[50%] left-[50%] text-[100px] text-white/5 blur-md transform -translate-x-1/2 -translate-y-1/2">🎵</div>
      </div>

      <div className="w-full max-w-5xl">
        {/* 🔙 Back + 🚪 Logout Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg hover:brightness-110 transition font-semibold"
          >
            ← Back
          </button>

          {/* <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("isPremium");
              window.location.href = "/";
            }}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:brightness-110 transition font-semibold"
          >
            Logout
          </button> */}

          <button
  onClick={() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("isPremium");
    navigate("/login"); // Redirect to login page
  }}
  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:brightness-110 transition font-semibold"
>
  Logout
</button>

        </div>

        {/* 🧑‍🎤 Profile Card */}
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white/10 rounded-3xl shadow-2xl p-10 mb-10 border border-white/30 backdrop-blur-lg text-white">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start md:w-1/3">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-6 shadow-lg border-4 border-white/40">
              <span className="text-6xl font-extrabold text-white drop-shadow-lg">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 mb-2">
              {user?.name}
            </h1>
            <p className="text-sm text-white/80 mb-1">{user?.email}</p>
            <span className="inline-block bg-white/20 text-white text-xs px-4 py-1 rounded-full mb-2 shadow">
              {user?.role}
            </span>
            <p className="text-xs text-white/60">
              Joined: {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* 🎵 Songs List */}
          <div className="flex-1 mt-8 md:mt-0 md:ml-12 w-full">
            <div className="bg-white/10 border border-white/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4 text-white/90">Your Uploaded Songs</h2>
              {songs.length === 0 ? (
                <p className="text-white/70 text-center">No songs uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-pink-200 text-base">Title</th>
                        <th className="px-4 py-2 text-pink-200 text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {songs.map((song, idx) => (
                        <tr key={song._id} className="bg-white/20 backdrop-blur rounded-xl shadow border border-white/20">
                          <td className="px-4 py-3 font-medium text-white rounded-l-xl">
                            {song.title || `Untitled Song #${idx + 1}`}
                          </td>
                          <td className="px-4 py-3 rounded-r-xl">
                            <button
                              onClick={() => handleDelete(song._id)}
                              disabled={deleting === song._id}
                              className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full shadow hover:brightness-110 transition disabled:opacity-50"
                            >
                              {deleting === song._id ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🌀 Fade-in Animation */}
        <style>{`
          .animate-fade-in {
            animation: fadeIn 1.2s<button
  onClick={() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("isPremium");
    navigate("/login"); // Redirect to login page
  }}
  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:brightness-110 transition font-semibold"
>
  Logout
</button>
 ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default UserDashboard;
