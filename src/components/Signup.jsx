import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >

        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-6 text-white text-center">
          Create Account
        </h2>

        {/* Inputs */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {/* Role Select */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Register As
            </label>

            <select
              className="w-full p-3 mt-1 bg-black border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 font-bold ml-1 hover:underline"
          >
            Login
          </button>
        </p>

      </form>
    </div>
  );
};

export default Signup;