import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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

  // Stats
  const totalStudents = myCourses.reduce(
    (acc, course) => acc + (course.enrolledStudents?.length || 0), 0
  );

  const totalRevenue = myCourses.reduce(
    (acc, course) => acc + (course.price * (course.enrolledStudents?.length || 0)), 0
  );

  // 🔄 Loading
  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-lg">
        
        <div>
          <h1 className="text-4xl font-black text-white">
            Instructor Studio
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Manage curriculum and track earnings.
          </p>
        </div>

        <button 
          onClick={() => navigate('/create-course')}
          className="mt-6 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition shadow-xl"
        >
          + Create New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <p className="text-blue-400 font-bold uppercase text-xs tracking-wider">
            Total Revenue
          </p>
          <p className="text-3xl font-black text-white">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <p className="text-green-400 font-bold uppercase text-xs tracking-wider">
            Total Students
          </p>
          <p className="text-3xl font-black text-white">
            {totalStudents}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <p className="text-purple-400 font-bold uppercase text-xs tracking-wider">
            Active Courses
          </p>
          <p className="text-3xl font-black text-white">
            {myCourses.length}
          </p>
        </div>

      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-6">
        Your Published Courses
      </h2>

      {/* Empty */}
      {myCourses.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
          <p className="text-gray-400 text-lg">
            No courses published yet.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {myCourses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 rounded-3xl border border-gray-800 shadow-lg overflow-hidden"
            >

              {/* Header */}
              <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 bg-black/40">
                
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    Price: ₹{course.price} • {course.lectures?.length || 0} Lectures
                  </p>
                </div>

                <Link 
                  to={`/manage-lectures/${course._id}`}
                  className="mt-4 md:mt-0 bg-gray-800 text-blue-400 px-6 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition"
                >
                  📺 Manage Curriculum
                </Link>
              </div>

              {/* Students */}
              <div className="p-8">
                
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-white flex items-center gap-2 text-lg">
                    👥 Enrolled Students ({course.enrolledStudents?.length || 0})
                  </h4>

                  <p className="text-purple-400 font-black">
                    Earnings: ₹{(course.price * (course.enrolledStudents?.length || 0)).toLocaleString()}
                  </p>
                </div>

                {course.enrolledStudents?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      
                      <thead>
                        <tr className="text-gray-500 text-sm uppercase border-b border-gray-800">
                          <th className="pb-4">Student Name</th>
                          <th className="pb-4">Email</th>
                          <th className="pb-4 text-right">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {course.enrolledStudents.map((student, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                          >
                            <td className="py-4 font-bold text-white">
                              {student.name}
                            </td>
                            <td className="py-4 text-gray-400">
                              {student.email}
                            </td>
                            <td className="py-4 text-right">
                              <span className="bg-green-500/20 text-green-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase">
                                Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-black/40 rounded-2xl border border-gray-800">
                    <p className="text-gray-500 italic text-sm">
                      Waiting for first enrollment...
                    </p>
                  </div>
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