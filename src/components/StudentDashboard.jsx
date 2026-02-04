import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        // This endpoint should return the user object populated with enrolledCourses
        const res = await axios.get('http://localhost:5000/api/courses/enrolled', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center text-xl">Loading your academy...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Stats Header */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white mb-10 shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
          <p className="opacity-80 mt-2">Continue where you left off and sharpen your skills.</p>
        </div>
        <div className="mt-6 md:mt-0 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30 text-center">
          <p className="text-xs uppercase font-black tracking-widest opacity-90">Courses Bought</p>
          <p className="text-4xl font-extrabold">{enrolledCourses.length}</p>
        </div>
      </div>

      {/* Courses Grid */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Enrolled Courses</h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">You haven't bought any courses yet.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
              <div className="h-3 bg-indigo-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>
                <button 
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="w-full bg-gray-100 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                >
                  View Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;