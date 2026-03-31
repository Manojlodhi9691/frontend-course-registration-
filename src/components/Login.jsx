import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setUser(res.data.user);

      if (res.data.user.role === 'faculty') {
        navigate('/faculty-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server connection failed. Try again in a few seconds.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email Address
            </label>
            <input 
              type="email"
              placeholder="name@university.com"
              className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?
            <button 
              onClick={() => navigate('/signup')}
              className="ml-1 text-blue-400 font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;