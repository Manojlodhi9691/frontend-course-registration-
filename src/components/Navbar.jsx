// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain mr-2"/>
        <span className="text-xl font-bold text-red-400">MITS</span>
      </Link> 
      
      <div className="space-x-6 flex items-center">
        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
        
        {/* NEW: Courses link is now visible to everyone */}
        <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-medium">Courses</Link>
        
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
              {user.role === 'faculty' ? 'Prof.' : 'Student'} {user.name}
            </span>
            <button 
              onClick={handleLogoutClick}
              className="text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;