import React from 'react';
import { Link } from 'react-router-dom';
import CourseList from './CourseList';

const Home = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-12">
      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Course Registration <span className="text-blue-600">Fee Payment</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        The all-in-one portal for course registration and fee payments. 
        Designed for students and faculty.
      </p>

      <div className="flex gap-4 mb-16">
        <Link 
          to={user ? "/dashboard" : "/signup"} 
          className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </Link>
      </div>
      
      {/* Conditional Rendering: Only show CourseList if user exists */}
      <div className="w-full max-w-6xl mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Explore Our Courses</h2>
        
        {user ? (
          <CourseList /> 
        ) : (
          <div className="bg-gray-100 p-12 rounded-3xl border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Course Catalog is Locked</h3>
            <p className="text-gray-500 mb-6">Please log in to view available courses and pricing.</p>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign in to your account →
            </Link>
          </div>
        )}
      </div>

      {/* Feature Grid - Always visible to show value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-blue-600 text-3xl mb-3">📚</div>
          <h3 className="font-bold text-lg">Easy Registration</h3>
          <p className="text-gray-500 text-sm">Enroll in your favorite courses with just a single click.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-blue-600 text-3xl mb-3">💳</div>
          <h3 className="font-bold text-lg">Secure Payments</h3>
          <p className="text-gray-500 text-sm">Handle tuition fees securely via integrated payment gateways.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-blue-600 text-3xl mb-3">👨‍🏫</div>
          <h3 className="font-bold text-lg">Faculty Control</h3>
          <p className="text-gray-500 text-sm">Faculty can manage curriculum and track student enrollments easily.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;