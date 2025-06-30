import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import anxios from 'axios';
import Login from './pages/Login'; // Import the Login component
import RegisterPage from './pages/Register';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Training from './pages/Training.jsx';
import Beginner from './pages/Beginner.jsx';
import Intermediate from './pages/Intermediate.jsx';
import Advance from './pages/Advance.jsx';
import AdminDashboard from './pages/Admin.jsx'; 
import UserDashboard from './pages/Userdashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="/training" element={<Training />} />
        <Route path="/beginner" element={<Beginner />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/advance" element={<Advance />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
