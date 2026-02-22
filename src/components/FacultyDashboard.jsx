import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Point this to your live Vercel Backend URL via .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const FacultyDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 2. Fetch only courses created by this faculty member
        const res = await axios.get(`${API_BASE_URL}/api/courses/faculty`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyCourses(res.data);
      } catch (err) {
        console.error("Error fetching faculty courses:", err);
        // If unauthorized, send back to login
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyData();
  }, [navigate]);

  if (loading) return <div className="p-10 text-center text-xl font-bold animate-pulse text-indigo-600">Loading Instructor Studio...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Instructor Studio</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your curriculum and track student enrollment.</p>
        </div>
        <button 
          onClick={() => navigate('/create-course')}
          className="mt-6 md:mt-0 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="text-2xl">+</span> Create New Course
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <p className="text-indigo-600 font-bold uppercase text-xs tracking-wider">Active Courses</p>
          <p className="text-3xl font-black text-indigo-900">{myCourses.length}</p>
        </div>
        {/* You can add more stats here later like Total Students or Revenue */}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Published Courses</h2>

      {myCourses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">You haven't created any courses yet.</p>
          <p className="text-gray-400 text-sm">Click the button above to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
              <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex items-end">
                <h3 className="text-white text-xl font-bold line-clamp-2">{course.title}</h3>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
                    Price: ₹{course.price}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold">
                    LIVE
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10">
                  {course.description}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                  >
                    View Details
                  </button>
                  {/* Future Update: Add Edit/Delete buttons here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;