import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Imports...
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import CourseDetails from './components/CourseDetails';
import CreateCourse from './components/CreateCourse';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // This is the part that might be causing the crash if typed incorrectly
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error("Session expired or server down");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                user.role === 'faculty' ? 
                <FacultyDashboard user={user} /> : 
                <StudentDashboard user={user} />
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
          path="/course/:id" 
          element={<CourseDetails user={user} />} />
          <Route path="/create-course" element={<CreateCourse />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;