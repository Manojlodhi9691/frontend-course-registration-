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
        
        // We send the token if it exists (to check enrollment status), 
        // but the request will still work without it for guests.
        const res = await axios.get(`${API_BASE_URL}/api/courses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load the course catalog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return (
    <div className="flex justify-center p-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <div className="text-center p-10 text-red-500 font-semibold">{error}</div>;

  if (courses.length === 0) return <p className="text-gray-500 italic text-center p-10">No courses available at the moment.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div key={course._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 leading-tight">{course.title}</h3>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md uppercase">New</span>
          </div>
          
          <p className="text-gray-500 text-sm mb-6 line-clamp-2 italic">
            By: <span className="text-gray-700 font-semibold">{course.faculty?.name|| 'Academic Expert'}</span>
          </p>
          
          <div className="mt-auto flex justify-between items-center pt-5 border-t border-gray-50">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Course Fee</p>
              <span className="text-blue-600 font-black text-2xl">₹{course.price}</span>
            </div>
            <Link 
              to={`/course/${course._id}`} 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition active:scale-95"
            >
              Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;