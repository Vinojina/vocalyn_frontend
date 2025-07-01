import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PracticePage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const lyricsRef = useRef(null);
  const [audioFormats, setAudioFormats] = useState(['.mp3', '.ogg', '.wav']); // Supported formats
  const [currentFormatIndex, setCurrentFormatIndex] = useState(0);

  // Check available audio formats
  useEffect(() => {
    const checkFormats = async () => {
      if (!song?.audioUrl) return;
      
      const baseUrl = song.audioUrl.replace(/\.[^/.]+$/, '');
      const availableFormats = [];
      
      for (const format of audioFormats) {
        try {
          const response = await fetch(`${baseUrl}${format}`, { method: 'HEAD' });
          if (response.ok) {
            availableFormats.push(format);
          }
        } catch (e) {
          console.log(`Format ${format} not available`);
        }
      }
      
      if (availableFormats.length === 0) {
        setError('No supported audio formats available');
      }
      setAudioFormats(availableFormats);
    };
    
    checkFormats();
  }, [song]);

  // Fetch song data
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(`/api/songs/${songId}`);
        
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          throw new Error('Server returned HTML instead of JSON');
        }
        
        setSong(response.data);
      } catch (err) {
        console.error('Error fetching song:', err);
        setError(err.response?.data?.error || 'Failed to load song data');
      }
    };
    
    fetchSong();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [songId]);

  // Handle audio errors by trying next format
  const handleAudioError = (e) => {
    const error = e.target.error;
    console.error('Audio error:', error);
    
    if (currentFormatIndex < audioFormats.length - 1) {
      // Try next available format
      setCurrentFormatIndex(currentFormatIndex + 1);
      setError(`Trying ${audioFormats[currentFormatIndex + 1]} format...`);
    } else {
      setError('Failed to play audio: No supported formats available');
    }
  };

  // Play/pause handler
  const handlePlay = async () => {
    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error("Playback error:", err);
      setError("Failed to play audio: " + err.message);
      setIsPlaying(false);
    }
  };

  // Lyrics synchronization
  const handleTimeUpdate = () => {
    if (!song?.lyrics || !audioRef.current) return;

    const currentTime = audioRef.current.currentTime;
    const lines = song.lyrics.split('\n');

    for (let i = lines.length - 1; i >= 0; i--) {
      const timeMatch = lines[i].match(/\[(\d+):(\d+)\.(\d+)\]/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1]);
        const seconds = parseInt(timeMatch[2]);
        const milliseconds = parseInt(timeMatch[3]);
        const lineTime = minutes * 60 + seconds + milliseconds / 1000;
        
        if (currentTime >= lineTime) {
          setCurrentLine(i);
          
          // Auto-scroll to current line
          if (lyricsRef.current) {
            const lyricLines = lyricsRef.current.querySelectorAll('p');
            if (lyricLines[i]) {
              lyricLines[i].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          }
          break;
        }
      }
    }
  };

  // Loading state
  if (!song && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading song data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && (!audioFormats || currentFormatIndex >= audioFormats.length)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Audio Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Back to Songs
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get current audio URL with selected format
  const getAudioUrl = () => {
    if (!song?.audioUrl) return '';
    const baseUrl = song.audioUrl.replace(/\.[^/.]+$/, '');
    return `${baseUrl}${audioFormats[currentFormatIndex]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-pink-600 hover:text-pink-800 transition"
          >
            ← Back to Songs
          </button>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-600">
              {song?.title || 'Untitled Song'}
            </h1>
            <h2 className="text-lg md:text-xl text-purple-600">
              {song?.artist || 'Unknown Artist'}
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Lyrics Container */}
          <div 
            ref={lyricsRef}
            className="h-96 md:h-[28rem] overflow-y-auto p-6 text-center text-lg leading-10"
          >
            {song?.lyrics?.split('\n').map((line, index) => (
              <p 
                key={index}
                className={currentLine === index ? 
                  "text-pink-600 font-bold scale-105" : 
                  "text-gray-700 opacity-80"}
              >
                {line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '')}
              </p>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlay}
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    isPlaying ? 'bg-pink-600' : 'bg-pink-500'
                  } text-white shadow-md`}
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                
                <div className="flex items-center space-x-2">
                  <span>Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {error && currentFormatIndex < audioFormats.length && (
                  <span className="text-yellow-600 mr-2">
                    Trying {audioFormats[currentFormatIndex]}...
                  </span>
                )}
                <span>Format: {audioFormats[currentFormatIndex]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={getAudioUrl()}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
        onCanPlay={() => {
          setAudioReady(true);
          setError(null);
        }}
        preload="auto"
        hidden
      />
    </div>
  );
};

export default PracticePage;