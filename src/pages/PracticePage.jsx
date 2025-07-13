import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PracticePage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);

  const audioRef = useRef(null);
  const lyricsRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const parseLyrics = (rawLyrics) => {
    const lines = rawLyrics.replace(/\r\n/g, '\n').split('\n');
    return lines.map((line, i) => {
      const match = line.match(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?](.*)/);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const ms = match[3] ? parseFloat(`0.${match[3]}`) : 0;
        const time = min * 60 + sec + ms;
        return { time, text: match[4].trim() };
      }
      return { time: i * 1, text: line };
    });
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await axios.get(`/api/songs/${songId}`);
        const songData = res.data;
        setSong(songData);
        const parsed = parseLyrics(songData.lyrics || '');
        setLyrics(parsed);

        if (songData.status === 'premium') {
          const isPremium = localStorage.getItem('isPremium') === 'true';
          const unlocked = JSON.parse(localStorage.getItem('unlockedSongs') || '[]');
          const isUnlocked = unlocked.includes(songId);
          if (!isPremium && !isUnlocked) {
            navigate(`/payment?songId=${songId}`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch song:', err);
        setError('Failed to load song data');
      }
    };

    fetchSong();
  }, [songId, navigate]);

  const handleTimeUpdate = () => {
    const time = audioRef.current.currentTime;
    const index = lyrics.findIndex((line, i) =>
      time >= line.time && (i === lyrics.length - 1 || time < lyrics[i + 1].time)
    );
    if (index !== -1 && index !== currentLine) {
      setCurrentLine(index);
      const elements = lyricsRef.current?.querySelectorAll('p');
      if (elements?.[index]) {
        elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('recording', blob, `${songId}-user-recording.webm`);
        formData.append('songId', songId);

        try {
          const res = await axios.post('/api/songs/recordings', formData);
          console.log("🎤 Gemini response:", res.data);

          const { feedback, score } = res.data;

          if (feedback && typeof score === "number") {
            setFeedback(feedback);
            setScore(score);
            toast.success("✅ Singing feedback received!");
          } else {
            console.warn("⚠️ Invalid feedback response:", res.data);
            setFeedback("⚠️ No valid feedback received from server.");
            setScore("N/A");
            toast.error("⚠️ Could not retrieve valid feedback.");
          }

        } catch (err) {
          console.error('❌ Upload error:', err);
          setFeedback("❌ Error retrieving feedback.");
          setScore("N/A");
          toast.error('❌ Failed to get feedback from server');
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Mic access error', err);
      setError('Microphone permission denied');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      stopRecording();
    } else {
      audioRef.current.play().catch((e) => setError('Cannot play audio'));
      startRecording();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#fff8f8] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-pink-600 hover:underline">← Back</button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-pink-700">{song?.title}</h1>
            <p className="text-purple-600">{song?.artist}</p>
          </div>
        </div>

        <div className="bg-white rounded shadow-lg overflow-hidden">
          <div ref={lyricsRef} className="h-96 overflow-y-auto p-4 space-y-2 text-center text-lg leading-8">
            {lyrics.map((line, i) => (
              <p
                key={i}
                className={currentLine === i ? 'text-pink-600 font-bold text-xl' : 'text-gray-600'}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className={`w-12 h-12 rounded-full text-white text-lg ${isPlaying ? 'bg-pink-600' : 'bg-pink-500'} shadow`}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setVolume(vol);
                    if (audioRef.current) audioRef.current.volume = vol;
                  }}
                  className="w-24"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">Karaoke Mode with Recording</div>
          </div>
        </div>

        {feedback && (
          <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <h2 className="text-xl font-semibold text-green-700">🎤 Singing Feedback</h2>
            <p className="mt-2 text-gray-800"><strong>Feedback:</strong> {feedback}</p>
            <p className="text-gray-800">
              <strong>Score:</strong> {typeof score === 'number' ? `${score} / 100` : score}
            </p>
          </div>
        )}
      </div>

      {song?.audioUrl && (
        <audio
          ref={audioRef}
          src={`http://localhost:5000${song.audioUrl}`}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            stopRecording();
          }}
          preload="auto"
          onCanPlay={() => setError(null)}
          onError={() => setError('Audio cannot be played')}
          hidden
        />
      )}

      {error && (
        <div className="mt-4 text-center text-red-600">{error}</div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default PracticePage;
