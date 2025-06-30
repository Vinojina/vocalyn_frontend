import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Logo from '/src/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing valid token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        
        // Optional: Verify token is still valid with backend
        const isValid = await verifyTokenWithBackend(token);
        if (!isValid) {
          localStorage.removeItem('token');
          return;
        }

        // Redirect based on role
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/userdashboard');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [navigate]);

  // Helper function to verify token with backend
  const verifyTokenWithBackend = async (token) => {
    try {
      await axios.get('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setAlert('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token,userData } = response.data;  
      
      // Store token and decode it
      localStorage.setItem('token', token);
      localStorage.setItem('user',JSON.stringify(userData))
      const decoded = jwtDecode(token);
      
      // Update auth context
      // if (login) {
      //   login({
      //     email: decoded.email,
      //     role: decoded.role,
      //     name: decoded.name,
      //     token
      //   });
      // }

     

      // Redirect based on role
      setSuccess('Login successful! Redirecting...');
      if (userData.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/userdashboard');
      }
      
    } catch (error) {
      setAlert(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setAlert('Please enter both email and password.');
      return;
    }

    handleLogin(email, password);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mx-4">
        {/* Left side - App description */}
        <div className="mb-6 md:mb-0 md:mr-6 w-full md:w-1/2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent m-5">
            AI Voice Trainer
          </h1>
          <p className="text-gray-600 mb-4">
            Improve your voice with our advanced AI technology. Perfect for professional singers and public speakers.
          </p>
          <ul className="text-gray-600 list-disc list-inside">
            <li>Personalized Voice analysis</li>
            <li>Real time feedback</li>
            <li>Custom training exercises</li>
            <li>Progress tracking</li>
          </ul>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img src={Logo} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 text-center">
              Log in to your Account
            </h2>
            <p className="text-gray-500 text-center mb-4">
              Start your journey to better vocal control today
            </p>
            
            {/* Alert messages */}
            {alert && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {alert}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Login form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="At least 8 characters" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required
                  minLength="8"
                />
              </div>
             
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded hover:opacity-90 transition duration-200 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Login'}
              </button>
              
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <a href="/RegisterPage" className="text-purple-600 hover:underline font-medium">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;