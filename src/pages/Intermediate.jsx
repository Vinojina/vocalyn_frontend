import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackIcon from "/src/assets/back.png";
import PlayCircle from "/src/assets/play.png";

const Intermediate= () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('/api/songs/intermediate');
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0c011a]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-[#0c011a] to-[#1f0a3b] text-white flex flex-col min-h-screen overflow-hidden">

      {/* 🎨 Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-400 opacity-30 rounded-full blur-[200px] top-[-150px] left-[-120px] z-0 animate-pulse" />
      <div className="absolute w-[450px] h-[450px] bg-purple-600 opacity-25 rounded-full blur-[180px] bottom-[-100px] right-[-100px] z-0 animate-pulse delay-500" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-[150px] top-[40%] left-[50%] z-0 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000" />

      {/* Page Content Wrapper */}
      <div className="relative z-10 flex-grow flex flex-col px-6 py-20">

        {/* Header */}
        <div className="w-full max-w-6xl mx-auto mb-10">
          <div className="flex items-center">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/levels");
                }
              }}
              className="mr-4"
            >
              <img src={BackIcon} alt="Back" className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Intermediate</h1>
              <p className="text-white/70 text-sm mt-1">
                Choose your skill level and start practicing
              </p>
            </div>
          </div>
        </div>

        {/* Song Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {songs.map((song, index) => (
            <div
              key={song._id || index}
              className="flex flex-col justify-between h-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-shadow hover:shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-white text-lg">{song.title}</h2>
                  <p className="text-sm text-pink-100">{song.artist || song.type}</p>
                  <p className="text-sm text-white/80">{song.duration}</p>
                </div>
                <p className="text-sm capitalize text-white/50">{song.level}</p>
              </div>
              <button
                onClick={() => navigate(`/practice/${song._id}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-4 py-2 mt-6 hover:from-pink-600 hover:to-purple-600 transition"
              >
                <img src={PlayCircle} alt="Play" className="w-5 h-5" />
                Practice song
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-white/50 py-6">
        © All rights reserved. <span className="font-semibold text-white">Vocalyn</span>
      </footer>
    </div>
  );
};

export default Intermediate;
