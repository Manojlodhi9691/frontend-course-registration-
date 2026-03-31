import React from 'react';
import CourseList from './CourseList';

const Courses = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-6 text-gray-200">
      
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Browse Our{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Catalog
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-400 mb-12">
          Find the perfect course to advance your career.
        </p>

        {/* Course List */}
        <CourseList />
        
      </div>
    </div>
  );
};

export default Courses;