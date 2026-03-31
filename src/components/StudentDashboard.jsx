import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${API_BASE_URL}/api/courses/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);

        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // 🔄 Loading
  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-10 shadow-xl flex flex-col md:flex-row justify-between items-center">
        
        <div>
          <h1 className="text-3xl md:text-4xl font-black">
            My Learning Dashboard
          </h1>
          <p className="opacity-80 mt-2 text-sm md:text-base">
            Continue where you left off and sharpen your skills.
          </p>
        </div>

        <div className="mt-6 md:mt-0 bg-black/30 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/20 text-center">
          <p className="text-xs uppercase font-bold tracking-widest opacity-80">
            Courses Bought
          </p>
          <p className="text-4xl font-extrabold">
            {enrolledCourses.length}
          </p>
        </div>
      </div>

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-white mb-6">
        My Enrolled Courses
      </h2>

      {/* Empty State */}
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
          <p className="text-gray-400 text-lg">
            You haven't bought any courses yet.
          </p>

          <button 
            onClick={() => navigate('/courses')}
            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        // Courses Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-purple-900/30 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Top Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"></div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {course.description || "No description available."}
              </p>

              {/* Button */}
              <button 
                onClick={() => navigate(`/course-content/${course._id}`)}
                className="w-full bg-gray-800 text-blue-400 py-3 rounded-xl font-bold hover:bg-gray-700 transition"
              >
                View Content
              </button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default StudentDashboard;