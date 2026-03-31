import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = ({ user }) => {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-200">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl -top-32 -left-32"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl bottom-0 right-0"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white"
        >
          Learn Without Limits <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Build Your Future
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl text-gray-400 mb-10"
        >
          A modern learning platform by MITS Academy. Discover courses, upgrade skills, and accelerate your career.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Link
            to="/courses"
            className="px-10 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:scale-105 transition"
          >
            Explore Courses
          </Link>

          {!user && (
            <Link
              to="/signup"
              className="px-10 py-4 rounded-2xl text-lg font-semibold border border-gray-700 hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
          )}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {[
            { label: 'Students', value: '2.5K+' },
            { label: 'Courses', value: '120+' },
            { label: 'Faculty', value: '85+' },
            { label: 'Success', value: '99%' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <h3 className="text-3xl font-bold text-blue-400">{stat.value}</h3>
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="w-full py-24 bg-gradient-to-r from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Browse', desc: 'Explore courses freely before enrolling.' },
              { title: 'Pay Securely', desc: 'Safe payments with Razorpay.' },
              { title: 'Start Learning', desc: 'Instant access to dashboard.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-md hover:shadow-xl transition"
              >
                <div className="text-4xl font-bold text-purple-400 mb-4">0{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">FAQs</h2>

        <div className="space-y-4">
          {[
            {
              q: 'Can I view courses for free?',
              a: 'Yes, you can explore all courses before enrolling.',
            },
            {
              q: 'Is payment secure?',
              a: 'Yes, we use Razorpay with SSL encryption.',
            },
            {
              q: 'When do I get access?',
              a: 'Immediately after successful payment.',
            },
          ].map((item, i) => (
            <details
              key={i}
              className="group bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800"
            >
              <summary className="cursor-pointer font-semibold flex justify-between text-white">
                {item.q}
                <span className="group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-4 text-gray-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-6">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-16 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="mb-8 text-lg text-gray-200">Join thousands of learners upgrading their skills.</p>

          <Link
            to="/signup"
            className="bg-white text-gray-900 px-12 py-4 rounded-xl font-bold hover:scale-105 transition"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;