// src/components/Courses.jsx
import React from 'react';
import CourseList from './CourseList'; // Removed the ../ because they are in the same folder

const Courses = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Browse Our <span className="text-blue-600">Catalog</span>
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Find the perfect course to advance your career.
        </p>
        <CourseList />
      </div>
    </div>
  );
};

export default Courses;