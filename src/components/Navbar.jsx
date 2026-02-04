import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div><img src="/logo.png" alt="Logo" 
      className="w-20 h-20 object-contain"/></div> 
      
      <div className="space-x-6 flex items-center">
        <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
        
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {user.role === 'faculty' ? 'Prof.' : 'Student'} {user.name}
            </span>
            <button 
              onClick={handleLogoutClick}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;