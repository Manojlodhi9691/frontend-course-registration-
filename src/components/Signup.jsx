import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Grab the API URL from your frontend .env file
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. Use the dynamic variable for the POST request
      await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create Account</h2>
        
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Register As</label>
            <select 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white" 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account? 
          <button onClick={() => navigate('/login')} className="text-blue-600 font-bold ml-1 hover:underline">
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;