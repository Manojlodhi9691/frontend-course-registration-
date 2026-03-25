import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FacultyDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/courses/faculty`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyCourses(res.data);
      } catch (err) {
        console.error("Error fetching faculty courses:", err);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyData();
  }, [navigate]);

  // --- CALCULATIONS ---
  const totalStudents = myCourses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0);
  const totalRevenue = myCourses.reduce((acc, course) => acc + (course.price * (course.enrolledStudents?.length || 0)), 0);

  if (loading) return <div className="p-10 text-center text-xl font-bold animate-pulse text-indigo-600">Loading Instructor Studio...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Instructor Studio</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage curriculum and track earnings.</p>
        </div>
        <button 
          onClick={() => navigate('/create-course')}
          className="mt-6 md:mt-0 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all active:scale-95 flex items-center gap-2"
        >
          <span>+</span> Create New Course
        </button>
      </div>

      {/* 📊 ADVANCED STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <p className="text-indigo-600 font-bold uppercase text-xs tracking-wider">Total Revenue</p>
          <p className="text-3xl font-black text-indigo-900">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <p className="text-green-600 font-bold uppercase text-xs tracking-wider">Total Enrolled Students</p>
          <p className="text-3xl font-black text-green-900">{totalStudents}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <p className="text-purple-600 font-bold uppercase text-xs tracking-wider">Active Courses</p>
          <p className="text-3xl font-black text-purple-900">{myCourses.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Performance Detail</h2>

      {myCourses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No courses published yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {myCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                  <p className="text-gray-500">Price per Student: ₹{course.price}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm font-bold text-gray-400 uppercase">Course Revenue</p>
                  <p className="text-2xl font-black text-indigo-600">₹{(course.price * (course.enrolledStudents?.length || 0)).toLocaleString()}</p>
                </div>
              </div>

              {/* 👥 ENROLLED STUDENTS TABLE */}
              <div className="p-8">
                <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span>👥</span> Enrolled Students ({course.enrolledStudents?.length || 0})
                </h4>
                
                {course.enrolledStudents?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 text-sm uppercase tracking-widest border-b border-gray-100">
                          <th className="pb-4 font-medium">Student Name</th>
                          <th className="pb-4 font-medium">Email Address</th>
                          <th className="pb-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        {course.enrolledStudents.map((student, idx) => (
                          <tr key={idx} className="border-b border-gray-50 last:border-0">
                            <td className="py-4 font-bold text-gray-800">{student.name}</td>
                            <td className="py-4">{student.email}</td>
                            <td className="py-4">
                              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-black">PAID</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm text-center py-4 bg-gray-50 rounded-xl">No enrollments yet for this course.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;