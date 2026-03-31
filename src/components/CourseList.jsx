import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${API_BASE_URL}/api/courses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load the course catalog.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 🔄 Loading
  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    </div>
  );

  // ❌ Error
  if (error) return (
    <div className="text-center p-10 text-red-400 font-semibold bg-black">
      {error}
    </div>
  );

  // 📭 Empty
  if (courses.length === 0) return (
    <p className="text-gray-400 italic text-center p-10 bg-black">
      No courses available at the moment.
    </p>
  );

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {courses.map((course) => (
          <div
            key={course._id}
            className="group relative bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-purple-900/40 hover:-translate-y-3 transition-all duration-500 flex flex-col overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition"></div>

            {/* Title */}
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                {course.title}
              </h3>

              <span className="bg-purple-600/20 text-purple-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                New
              </span>
            </div>

            {/* Faculty */}
            <p className="text-gray-400 text-sm mb-6 italic relative z-10">
              By: <span className="text-gray-200 font-semibold">
                {course.faculty?.name || 'Academic Expert'}
              </span>
            </p>

            {/* Footer */}
            <div className="mt-auto flex justify-between items-center pt-5 border-t border-gray-800 relative z-10">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  Course Fee
                </p>
                <span className="text-blue-400 font-black text-2xl">
                  ₹{course.price}
                </span>
              </div>

              <Link
                to={`/course/${course._id}`}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-110 hover:shadow-xl transition"
              >
                Details
              </Link>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default CourseList;