import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Security Check
    if (!user || user.role !== 'faculty') {
      navigate('/login'); 
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/courses/faculty', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching faculty stats:", err);
        // If token is invalid, clear storage and send to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  // Calculate Grand Totals using the fields we added to the backend
  const totalStudents = courses.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
  const totalRevenue = courses.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  if (loading) return <div className="p-8 text-center font-bold animate-pulse">Loading Faculty Data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Faculty Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={() => navigate('/create-course')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg transform hover:scale-105"
        >
          + Create New Course
        </button>
      </div>
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Students</p>
          <p className="text-5xl font-black text-indigo-600 mt-1">{totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
          <p className="text-5xl font-black text-green-600 mt-1">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* COURSE TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="font-bold text-gray-700">Course Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b">
              <tr>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase">Course Name</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase text-center">Registrations</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? courses.map((course) => (
                <tr key={course._id} className="border-b last:border-0 hover:bg-indigo-50/30 transition">
                  <td className="p-4 font-semibold text-gray-800">{course.title}</td>
                  <td className="p-4 text-center">
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold">
                      {course.studentCount}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    ₹{(course.revenue).toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-400 italic">
                    No courses found. Start by creating one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;