import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the saved token
        
        const res = await axios.get('http://localhost:5000/api/courses', {
          headers: {
            Authorization: `Bearer ${token}` // Pass token to backend
          }
        });
        
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load courses. Please make sure you are logged in.");
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

  if (error) return <p className="text-red-500 font-semibold">{error}</p>;

  if (courses.length === 0) return <p className="text-gray-500 italic">No courses available. Faculty needs to add some!</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-left hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
          <p className="text-gray-500 text-sm mb-4 italic">
            Instructor: <span className="text-gray-700 font-medium">{course.faculty?.name || 'Academic Staff'}</span>
          </p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
            <span className="text-blue-600 font-black text-xl">₹{course.price}</span>
            <Link 
              to={`/course/${course._id}`} 
              className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;