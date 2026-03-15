import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="flex flex-col items-center bg-white">
      {/* 1. Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master New Skills <br />
          <span className="text-blue-600 font-black">At Your Own Pace</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The official MITS Academy portal. Explore professional courses, 
          manage your registration, and handle fee payments securely.
        </p>

        <div className="flex gap-4">
          <Link 
            to="/courses" 
            className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
          >
            Explore Courses
          </Link>
          {!user && (
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all duration-300"
            >
              Sign Up Free
            </Link>
          )}
        </div>
      </div>

      {/* 2. Stats Section */}
      <div className="w-full py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            { label: "Active Students", value: "2,500+" },
            { label: "Total Courses", value: "120+" },
            { label: "Expert Faculty", value: "85+" },
            { label: "Success Rate", value: "99%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How It Works Section (Scroll Depth) */}
      <div className="py-24 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Learning in 3 Steps</h2>
            <p className="text-gray-500">Getting started at MITS Academy is simple and transparent.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {[
              { step: "1", title: "Browse Catalog", desc: "View all available courses and their curriculum without an account." },
              { step: "2", title: "Secure Payment", desc: "Choose your course and pay securely via Razorpay gateway." },
              { step: "3", title: "Instant Access", desc: "Start learning immediately from your personalized dashboard." }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 text-center group">
                <div className="w-20 h-20 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FAQ Section */}
      <div className="py-24 max-w-3xl mx-auto px-6 w-full">
        <h2 className="text-4xl font-bold text-center mb-16">Common Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Do I need to pay to see course details?", a: "No! You can browse our entire catalog and view course descriptions freely. You only pay when you decide to enroll." },
            { q: "Is my payment data safe?", a: "We use 256-bit SSL encryption via Razorpay. We never store your card details on our servers." },
            { q: "How do I access my courses?", a: "Once enrolled, all your courses appear in your Student Dashboard instantly." }
          ].map((item, index) => (
            <details key={index} className="group p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:border-blue-200 transition-all">
              <summary className="font-bold text-gray-800 list-none flex justify-between items-center">
                {item.q}
                <span className="text-blue-600 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* 5. Final CTA Banner */}
      <div className="w-full px-6 py-24 mb-10">
        <div className="max-w-6xl mx-auto bg-blue-600 rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h2 className="text-5xl font-black mb-6 relative z-10">Ready to start?</h2>
          <p className="text-blue-100 mb-10 text-xl relative z-10">Join 2,500+ students today.</p>
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 px-14 py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition-all inline-block relative z-10"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;