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
    <nav className="bg-white shadow-md px-3 md:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Brand Section: Logo + Text */}
      <Link to="/" className="flex items-center flex-shrink-0">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain mr-1.5"/>
        <span className="text-lg md:text-xl font-bold text-red-500 tracking-tight">MITS</span>
      </Link> 
      
      {/* Links Section - Using a tighter gap on mobile */}
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium text-xs sm:text-sm md:text-base">Home</Link>
        <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-medium text-xs sm:text-sm md:text-base">Courses</Link>
        
        {user ? (
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Hide the full name on mobile to prevent overlapping, show only role badge */}
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium text-xs sm:text-sm md:text-base">Dashboard</Link>
            
            <span className="hidden lg:inline-block text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
              {user.role === 'faculty' ? 'Prof.' : 'Student'} {user.name}
            </span>

            <button 
              onClick={handleLogoutClick}
              className="text-red-500 hover:text-red-700 font-bold text-[10px] md:text-sm uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium text-xs sm:text-sm md:text-base">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-3 py-1.5 md:px-6 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] sm:text-xs md:text-sm shadow-md hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;