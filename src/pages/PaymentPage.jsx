import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMusic, FaCreditCard } from 'react-icons/fa';

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const songId = queryParams.get('songId');

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await axios.get(`/api/songs/${songId}`);
        const songData = res.data;
        setSong(songData);
  
        const parsed = parseLyrics(songData.lyrics || '');
        setLyrics(parsed);
  
        if (songData.premium === true) {
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
  
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create Stripe checkout session.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong while connecting to payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 bg-gradient-to-br from-purple-600 to-pink-400">
      <div className="max-w-md w-full bg-white/20 backdrop-blur p-6 rounded-lg shadow-xl border border-white/30">
        <div className="text-center mb-6">
          <FaMusic className="text-4xl text-yellow-400 mb-2 animate-bounce" />
          <h2 className="text-2xl font-bold text-white">Unlock Premium Song</h2>
          <p className="text-sm text-white/70">Pay once to unlock this karaoke track forever</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4 text-black">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded font-semibold transition"
          >
            <FaCreditCard />
            {loading ? 'Redirecting to Stripe...' : 'Pay $4.99 with Card'}
          </button>
        </form>

        <button
          type="button"
          className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded font-semibold transition"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
