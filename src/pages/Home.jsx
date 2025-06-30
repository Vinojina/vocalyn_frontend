import React from 'react';
import Logo from '/src/assets/logo.png';
import Premium from '/src/assets/stars.png';
import { useNavigate } from 'react-router-dom';



function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src={Logo} alt="Logo" className="h-10" />
          <span className="text-xl font-bold  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Vocalyn</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#home" className="text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium hover:text-gray-600 transition-colors">Home</a>
          <a href="#share" className="text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium hover:text-gray-600 transition-colors">Share</a>
          <a href="/about" className="text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium hover:text-gray-600 transition-colors">About us</a>
            <button onClick={()=> navigate("/login")} className="border border-purple-500 px-4 py-2 rounded border border- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-gray-800 font-medium hover:bg-gray-100 transition-colors cursor-pointer">
            Login
              </button>
          <button onClick={()=> navigate("/RegisterPage")} className="border border-purple-500 px-4 py-2 rounded bg-gray-800 text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium hover:bg-gray-700 transition-colors cursor-pointer">
            Signup
              </button>

            
            
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-16 bg-gradient-to-br from-gray-50 to-gray-200">
        <h1 className="text-4xl font-bold text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">Transform your voice with AI</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
          Train your voice with AI. Get real-time feedback and level up with songs you love.
        </p>
        <div className="flex gap-4 mt-4">
          <button onClick={()=> navigate("/training")} className=" border border-purple-500 px-6 py-3 rounded bg-gray-800 text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium hover:bg-gray-700 transition-colors">
            Start All training
          </button>
          <button className="border border-purple-500 px-6 py-3 rounded border border-gray-800 text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium hover:bg-gray-100 transition-colors">
            Browse Levels
          </button>
        </div>
      </section>

      {/* Levels Section */}
      <section className="flex flex-wrap justify-center gap-8 px-8 py-12 bg-white">
        {/* Beginner Card */}
        <div className="w-72 bg-white rounded-lg shadow-md p-8 text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
          <img src={Premium} alt="Premium" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6">Beginner</h3>
          <ul className="text-left mb-8 space-y-2 pl-5">
            <li className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-gray-800 before:text-lg">
              5 Free songs
            </li>
            <li className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-gray-800 before:text-lg">
              5 Premium songs
            </li>
          </ul>
          <button  onClick={()=> navigate("/beginner")}className="border border-purple-500 w-full py-3 rounded bg-gray-800 text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent  font-medium hover:bg-gray-700 transition-colors">
            Start Learning
          </button>
        </div>

        {/* Intermediate Card */}
        <div className="w-72 bg-white rounded-lg shadow-md p-8 text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
          <img src={Premium} alt="Premium" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent  mb-6">Intermediate</h3>
          <ul className="text-left mb-8 space-y-2 pl-5">
            <li className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-gray-800 before:text-lg">
              5 Free songs
            </li>
            <li className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-gray-800 before:text-lg">
              10 Premium songs
            </li>
          </ul>
          <button onClick={()=> navigate("/intermediate")} className="border border-purple-500 w-full py-3 rounded bg-gray-800 text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent  font-medium hover:bg-gray-700 transition-colors">
            Start Learning
          </button>
        </div>

        {/* Advanced Card */}
        <div className="w-72 bg-white rounded-lg shadow-md p-8 text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
          <img src={Premium} alt="Premium" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent  mb-6">Advanced</h3>
          <ul className="text-left mb-8 space-y-2 pl-5">
            <li className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-gray-800 before:text-lg">
              5 Free songs
            </li>
            <li className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-gray-800 before:text-lg">
              15 Premium songs
            </li>
          </ul>
          <button onClick={()=> navigate("/advance")} className="border border-purple-500 w-full py-3 rounded bg-gray-800 text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent  font-medium hover:bg-gray-700 transition-colors">
            Start Learning
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-white mt-auto">
        <p>All rights reserved Vocalyn</p>
      </footer>
    {/* Closing tag for the outermost div */}
    </div>
  );
}

export default Home;