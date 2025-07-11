import React from 'react';
import Logo from '/src/assets/logo.png';
import Premium from '/src/assets/stars.png';
import HeroBG from '/src/assets/HERO3.png';
import HeroBG1 from '/src/assets/HeroBG.png';
import { useNavigate } from 'react-router-dom';
import Voice from "/src/assets/voice.png";
import Progress from "/src/assets/learning.png";
import Premium1 from "/src/assets/premium1.png";

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('auth_token');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isPremium');
    window.location.href = '/'; // reload the app
  };

  return (
    <div>
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center overflow-hidden text-white"
        style={{ backgroundImage: `url(${HeroBG1})` }}
      >
        {/* Gradient Ring */}
        <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>

        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 py-6 z-10">
          <div className="flex items-center gap-2.5">
            <img src={Logo} alt="Logo" className="h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              VOCALYN
            </span>
          </div>
          <ul className="flex gap-10 text-white/90 font-medium text-sm">
            <li><a href="#home" className="hover:text-pink-400 transition">Home</a></li>
            <li><a href="/userdashboard" className="hover:text-pink-400 transition">Profile</a></li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-pink-400 transition"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <a href="/login" className="hover:text-pink-400 transition">
                  Login
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* Hero Content */}
        <div className="z-10 max-w-7xl w-full px-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl md:mr-10 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                Transform your voice with AI
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Train your voice with AI.<br />Get real-time feedback and level up with songs you love.
            </p>
            <button
              className="justify-center mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition font-semibold"
              onClick={() => navigate('/training')}
            >
              Start Training
            </button>
          </div>
          <div>
            <img src={HeroBG} alt="Hero" className="w-[700px] md:w-[500px] drop-shadow-2xl" />
          </div>
        </div>

        {/* Decorations */}
        <div className="absolute bottom-8 left-10 w-14 h-14 rounded-full border-4 border-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-tr from-pink-400 to-purple-600 rounded-full blur-2xl opacity-40 animate-ping"></div>
      </div>

      {/* Levels Section */}
      <section className="relative flex flex-wrap justify-center gap-8 px-8 py-16 bg-[#0c011a] overflow-hidden">
        <div className="absolute w-96 h-96 bg-pink-500 opacity-30 rounded-full blur-3xl top-[-100px] left-[-100px] z-0 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl bottom-[-120px] right-[-100px] z-0 animate-pulse delay-1000" />
        <div className="absolute w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-2xl top-[40%] left-[40%] z-0 animate-pulse delay-2000" />

        {[ 
          { level: 'Beginner', free: 5, premium: 5, link: '/beginner' },
          { level: 'Intermediate', free: 5, premium: 10, link: '/intermediate' },
          { level: 'Advanced', free: 5, premium: 15, link: '/advanced' }
        ].map(({ level, free, premium, link }) => (
          <div
            key={level}
            className="relative z-10 w-72 bg-white/5 backdrop-blur-lg rounded-lg shadow-xl p-8 text-center transition-transform hover:-translate-y-1 hover:shadow-2xl border border-white/10"
          >
            <img src={Premium} alt="Premium" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6">
              {level}
            </h3>
            <ul className="text-left mb-8 space-y-2 pl-5 text-gray-300">
              <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-white before:text-lg">
                {free} Free songs
              </li>
              <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-white before:text-lg">
                {premium} Premium songs
              </li>
            </ul>
            <button
              onClick={() => navigate(link)}
              className="w-full py-3 rounded border border-pink-400 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition"
            >
              Start Learning
            </button>
          </div>
        ))}

        {/* Why Choose AI Section */}
        <div className="relative z-10 flex-1 flex justify-center items-center px-6 py-20">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-2xl px-10 md:px-20 py-16 max-w-7xl w-full">
            <h1 className="text-4xl font-bold mb-14 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Why choose AI voice trainer?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 bg-white/10 border border-white/20 rounded-xl shadow-md flex flex-col items-center text-center">
                <img src={Voice} alt="Voice Analysis" className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-purple-300">AI Voice Analysis</h3>
                <p className="text-white/80 text-base">
                  Advanced AI technology analyzes your voice in real-time.
                </p>
              </div>
              <div className="p-8 bg-white/10 border border-white/20 rounded-xl shadow-md flex flex-col items-center text-center">
                <img src={Progress} alt="Progress Tracking" className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Progressive Learning</h3>
                <p className="text-white/80 text-base">
                  Unlock levels as you improve:
                  <br />
                  <span className="inline-block mt-2 font-bold text-blue-300">
                    Beginner → Intermediate → Advanced
                  </span>
                </p>
              </div>
              <div className="p-8 bg-white/10 border border-white/20 rounded-xl shadow-md flex flex-col items-center text-center">
                <img src={Premium1} alt="Premium Songs" className="w-12 h-12 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Premium Songs</h3>
                <p className="text-white/80 text-base">
                  Practice with high-quality backing tracks and professional guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-white mt-auto">
        <p>All rights reserved Vocalyn</p>
      </footer>
    </div>
  );
}

export default Home;
