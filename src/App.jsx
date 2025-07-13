import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import anxios from 'axios';
import Login from './pages/Login'; // Import the Login component
import RegisterPage from './pages/Register';
import Home from './pages/Home.jsx';
import Training from './pages/Training.jsx';
import Beginner from './pages/Beginner.jsx';
import Intermediate from './pages/Intermediate.jsx';
import Advance from './pages/Advance.jsx';
import AdminDashboard from './pages/Admin.jsx'; 
import UserDashboard from './pages/Userdashboard.jsx';
import PracticePage from './pages/PracticePage.jsx';
import PitchDetector from './pages/itchDetector.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import SingingRecorder from './pages/SingingRecorder.jsx';


import axios from "axios";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/beginner" element={<Beginner />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/advanced" element={<Advance />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/practice/:songId" element={<PracticePage/>}/>
      <Route path="/pitch" element={<PitchDetector />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/singing-recorder" element={<SingingRecorder />} />

        {/* Add more routes as needed */}
      </Routes>
  );
}

export default App;
