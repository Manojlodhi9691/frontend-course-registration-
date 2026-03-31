 // components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  // Active link highlight
  const baseLink =
    "font-medium text-sm md:text-base transition duration-200 text-gray-400 hover:text-white";

  const activeLink = (path) =>
    location.pathname === path
      ? "text-white border-b-2 border-purple-500 pb-1"
      : "";

  return (
    <nav className="bg-black border-b border-gray-800 px-4 md:px-8 py-4 flex justify-between items-center shadow-lg">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-9 h-9" />
        <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          MITS
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-3 sm:gap-5 md:gap-7">
        <Link to="/" className={`${baseLink} ${activeLink("/")}`}>
          Home
        </Link>

        <Link to="/courses" className={`${baseLink} ${activeLink("/courses")}`}>
          Courses
        </Link>

        {user ? (
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              to="/dashboard"
              className={`${baseLink} ${activeLink("/dashboard")}`}
            >
              Dashboard
            </Link>

            <span className="hidden lg:inline-block text-xs font-semibold bg-gray-900 text-blue-400 px-3 py-1 rounded-full border border-gray-700">
              {user.role === 'faculty' ? 'Prof.' : 'Student'} {user.name}
            </span>

            <button
              onClick={handleLogoutClick}
              className="text-red-400 hover:text-red-500 font-bold text-xs md:text-sm uppercase"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-5">
            <Link to="/login" className={baseLink}>
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg hover:scale-105 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;