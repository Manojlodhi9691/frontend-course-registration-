import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CourseDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) return alert("Razorpay failed to load");

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsProcessing(true);

      const orderRes = await axios.post(`${API_BASE_URL}/api/payments/create-order`, 
        { amount: course.price, courseId: id },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const { amount, id: order_id, currency } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Academy Portal",
        description: course.title,
        order_id,
        handler: async (response) => {
          const verifyRes = await axios.post(`${API_BASE_URL}/api/payments/verify`, response, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (verifyRes.data.success) {
            await axios.post(`${API_BASE_URL}/api/courses/enroll`, 
              { courseId: id }, 
              { headers: { Authorization: `Bearer ${token}` }}
            );
            navigate('/dashboard');
          }
        },
        theme: { color: "#6366f1" }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );

  if (!course) return <div className="p-8 text-center text-red-400">Course not found.</div>;

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-black">{course.title}</h1>
          <p className="text-gray-200 mt-2">By {course.faculty?.name || 'Expert Faculty'}</p>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-2xl font-bold mb-4 text-white">About this Course</h3>
              <p className="text-gray-400 leading-relaxed">
                {course.description || "Learn industry-relevant skills with practical curriculum."}
              </p>
            </section>

            {/* --- NEW SECTION FOR INSTRUCTOR EXPERIENCE --- */}
            <section className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-white">Instructor Profile</h3>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center text-xl font-bold">
                  {course.faculty?.name?.charAt(0) || "F"}
                </div>
                <div>
                  <p className="text-xl font-semibold text-indigo-400">{course.faculty?.name || "Instructor"}</p>
                  <p className="text-gray-300 mt-2 italic">
                    "{course.instructorExperience || course.faculty?.experience || "Expertise in the field with years of industry experience."}"
                  </p>
                </div>
              </div>
            </section>
            {/* ---------------------------------------------- */}

            {course.subjects && course.subjects.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4 text-white">Curriculum</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.subjects.map((sub, idx) => (
                    <div key={idx} className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                      {sub}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <p className="text-gray-400 text-sm">Course Fee</p>
              <p className="text-3xl font-bold text-blue-400">₹{course.price}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
              <h4 className="font-bold text-white">Batch Details</h4>
              <div className="flex justify-between text-gray-400">
                <span>Duration</span>
                <span>{course.duration || 'Flexible'}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Schedule</span>
                <span>{course.batchTiming || 'Evening'}</span>
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold transition ${
                isProcessing ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Enroll Now'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;