import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const songId = queryParams.get('songId');

  useEffect(() => {
    localStorage.setItem('isPremium', 'true');
    
    setTimeout(() => {
      if (songId) {
        navigate(`/practice/${songId}`);
      } else {
        alert('Missing songId. Redirecting to home.');
        navigate('/');
      }
    }, 2000);
  }, [songId, navigate]);

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-500 text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h2>
      <p className="text-lg">You're being redirected to your song...</p>
    </div>
  );
};

export default PaymentSuccess;
