import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="flex flex-col items-center bg-white">
      {/* 1. Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Course Registration <br />
          <span className="text-blue-600">Fee Payment Portal</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The official all-in-one portal for MITS students and faculty. 
          Streamline your academic journey with secure payments and instant enrollment.
        </p>

        <div className="flex gap-4">
          <Link 
            to={user ? "/dashboard" : "/signup"} 
            className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
          >
            {user ? "Go to Dashboard" : "Get Started Now"}
          </Link>
          {!user && (
            <Link 
              to="/courses" 
              className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all duration-300"
            >
              View Courses
            </Link>
          )}
        </div>
      </div>

      {/* 2. Stats Section (New) */}
      <div className="w-full py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            { label: "Active Students", value: "2,500+" },
            { label: "Total Courses", value: "120+" },
            { label: "Expert Faculty", value: "85+" },
            { label: "Success Rate", value: "99%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-blue-600">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Features Section */}
      <div className="py-24 px-4 w-full max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Portal?</h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6">📚</div>
            <h3 className="font-bold text-xl mb-3">Easy Registration</h3>
            <p className="text-gray-500 leading-relaxed">Enroll in your favorite courses with just a single click. No more standing in long queues.</p>
          </div>
          
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6">💳</div>
            <h3 className="font-bold text-xl mb-3">Secure Payments</h3>
            <p className="text-gray-500 leading-relaxed">Handling tuition fees is safer than ever with our encrypted Razorpay integration.</p>
          </div>
          
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6">👨‍🏫</div>
            <h3 className="font-bold text-xl mb-3">Faculty Control</h3>
            <p className="text-gray-500 leading-relaxed">Faculty can manage curriculum, track student progress, and export enrollment data easily.</p>
          </div>
        </div>
      </div>
     {/* 4. How It Works Section */}
      <div className="py-20 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Start Your Journey in 3 Steps</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">1</div>
              <h3 className="font-bold text-lg mb-2">Create Account</h3>
              <p className="text-gray-500">Sign up as a student to access the premium course catalog.</p>
            </div>
            <div className="hidden md:block w-20 h-0.5 bg-blue-200"></div>
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">2</div>
              <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-500">Pay your course fees securely via our integrated Razorpay gateway.</p>
            </div>
            <div className="hidden md:block w-20 h-0.5 bg-blue-200"></div>
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">3</div>
              <h3 className="font-bold text-lg mb-2">Instant Access</h3>
              <p className="text-gray-500">Get immediate access to your dashboard and start learning.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FAQ Section */}
      <div className="py-24 max-w-4xl mx-auto px-6 w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "Is the payment gateway secure?", a: "Yes, we use Razorpay's industry-standard encryption to handle all transactions safely." },
            { q: "Can faculty members create their own courses?", a: "Absolutely. Faculty accounts have a dedicated dashboard to create, manage, and track courses." },
            { q: "How do I get my payment receipt?", a: "Once payment is verified, your receipt is automatically generated and visible in your Student Dashboard." }
          ].map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">Q: {item.q}</h4>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Final Call to Action Section */}
      <div className="w-full px-6 py-20">
        <div className="max-w-6xl mx-auto bg-blue-600 rounded-[3rem] p-12 text-center text-white shadow-2xl overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>
          
          <h2 className="text-4xl font-black mb-6 relative z-10">Ready to boost your skills?</h2>
          <p className="text-blue-100 mb-10 text-lg relative z-10 max-w-xl mx-auto">Join thousands of students at MITS and start your academic success story today.</p>
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 px-12 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition relative z-10 inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </div>
      {/* 4. Simple Footer (New) */}
      <footer className="w-full bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">MITS Academy</h3>
            <p className="text-gray-400 text-sm">Empowering students through digital education management.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><Link to="/courses" className="hover:text-blue-400">All Courses</Link></li>
              <li><Link to="/signup" className="hover:text-blue-400">Join as Faculty</Link></li>
              <li><Link to="/login" className="hover:text-blue-400">Student Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Support</h4>
            <p className="text-gray-400 text-sm">Email: support@mits.edu</p>
            <p className="text-gray-400 text-sm">Phone: +91 1234567890</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          © 2026 MITS Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;