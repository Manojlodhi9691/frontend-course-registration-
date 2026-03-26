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

  // Helper to ensure Razorpay is loaded (Fixes Laptop/Desktop silent blocks)
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Please check your internet or disable AdBlock.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to purchase this course.");
      navigate('/login');
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Create Order
      const orderRes = await axios.post(`${API_BASE_URL}/api/payments/create-order`, 
        { amount: course.price, courseId: id },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const { amount, id: order_id, currency } = orderRes.data;

      // 2. Options Configuration
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount,
        currency,
        name: "Academy Portal",
        description: `Enrolling in ${course.title}`,
        order_id, 
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payments/verify`, response, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.success) {
              await axios.post(`${API_BASE_URL}/api/courses/enroll`, 
                { courseId: id }, 
                { headers: { Authorization: `Bearer ${token}` }}
              );
              alert("Payment Successful! Welcome to the course.");
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: { 
          name: user?.name || "", 
          email: user?.email || "" 
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: () => setIsProcessing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.response?.data?.message || "Could not initiate payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!course) return <div className="p-8 text-center text-red-500 font-bold">Course not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Course Details
              </span>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">{course.title}</h1>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center font-bold">
                  {course.faculty?.name?.charAt(0) || 'E'}
                </div>
                <p className="font-medium text-indigo-100 text-lg">
                  By <span className="text-white font-bold">{course.faculty?.name || 'Expert Faculty'}</span>
                </p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
              <p className="text-xs font-bold opacity-70 uppercase mb-1">Investment</p>
              <p className="text-4xl font-black">₹{course.price}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                About this Course
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {course.description || "Learn industry-relevant skills with our comprehensive, hands-on curriculum designed by professionals."}
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                Syllabus
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.subjects?.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                    <span className="text-indigo-600 font-black text-xl opacity-30">0{idx + 1}</span>
                    <p className="font-bold text-gray-700">{sub}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
              <h4 className="font-black text-indigo-900 mb-4 uppercase text-xs tracking-widest">Instructor Bio</h4>
              <p className="text-indigo-800/80 leading-relaxed italic">
                "{course.instructorExperience || 'Experienced professional dedicated to student success and practical learning.'}"
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h4 className="font-black text-gray-900 flex items-center gap-2">
                🚀 Batch Details
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium text-sm">Duration</span>
                  <span className="font-bold text-indigo-600">{course.duration || 'Flexible'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium text-sm">Schedule</span>
                  <span className="font-bold text-gray-800">{course.batchTiming || 'Evening Batch'}</span>
                </div>
              </div>

              {/* Dynamic Action Button */}
              <div className="pt-4">
                {user?.role === 'faculty' ? (
                  <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-bold cursor-not-allowed">
                    Faculty View Only
                  </button>
                ) : course.isEnrolled ? (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition transform active:scale-95"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button 
                    onClick={handleRazorpayPayment}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-2xl font-black shadow-2xl transition-all transform active:scale-95 flex justify-center items-center gap-2 ${
                      isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;