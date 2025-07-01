import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackIcon from "/src/assets/back.png";
import PlayCircle from "/src/assets/play.png";

const Intermediate = () => {
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-6 text-pink-600">
      {/* Header */}
      <div className="w-full max-w-3xl">
        <div className="flex items-center mb-4">
           <button onClick={() => navigate(-1)} className="mr-2">
              <img src={BackIcon} alt="backicon" className="w-6 h-6 cursor-pointer text-black" />
            </button>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Intermediate
          </h1>
        </div>
        <p className="text-center p-5 text-pink-400 mb-6 text-sm">
          Choose your skill level and start practicing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {songs.map((song, index) => (
          <div
            key={song._id || index}
            className="border-b pb-4 flex flex-col space-y-1 text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-pink-600">{song.title}</h2>
                <p className="text-sm text-pink-400">{song.artist || song.type}</p>
                <p className="text-sm text-black">{song.duration}</p>
              </div>
              <p className="text-sm text-black capitalize">{song.level}</p>
            </div>
            <button  onClick={() => navigate(`/practice/${song._id}`)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-4 py-2 mt-2 hover:from-pink-600 hover:to-purple-600 transition">
              <img src={PlayCircle} alt="play" className="w-5 h-5" />
              Practice song
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-6 text-xs text-black opacity-60">
        © All rights reserved. <span className="font-semibold">Vocalyn</span>
      </footer>
    </div>
  );
};

export default Intermediate;