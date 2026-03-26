import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CourseDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to purchase this course.");
      navigate('/login');
      return;
    }

    try {
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
        description: `Purchase ${course.title}`,
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
              alert("Payment Successful & Enrolled!");
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: { name: user?.name || "", email: user?.email || "" },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Initiation Error:", err);
      alert(err.response?.data?.message || "Payment initiation failed.");
    }
  };

  if (loading) return <div className="p-8 text-center font-semibold">Loading Course Details...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-10 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black">{course.title}</h1>
              <p className="mt-2 text-indigo-100 flex items-center gap-2">
                <span className="bg-indigo-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Instructor</span>
                {course.faculty?.name || 'Expert Instructor'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-sm font-bold opacity-80 uppercase tracking-tighter">Current Price</p>
              <p className="text-3xl font-black">₹{course.price}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-indigo-600 pl-4">Course Overview</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {course.description || "Comprehensive curriculum designed for practical industry application."}
              </p>
            </section>

            {/* Syllabus / Subjects */}
            <section>
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.subjects?.length > 0 ? (
                  course.subjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-semibold">
                      <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">{idx + 1}</span>
                      {sub}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Curriculum details coming soon.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column: Stats & Experience */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-400 uppercase text-xs mb-4 tracking-widest">Instructor Expertise</h4>
              <p className="text-gray-700 font-medium leading-relaxed italic">
                "{course.instructorExperience || 'Subject Matter Expert with deep theoretical and practical knowledge.'}"
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900">Batch Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-bold text-gray-800">{course.duration || '8 Weeks'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timing</span>
                  <span className="font-bold text-gray-800">{course.batchTiming || 'Mon-Fri (Evening)'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                {user?.role === 'faculty' ? (
                  <div className="w-full text-center py-3 bg-gray-100 text-gray-500 rounded-xl font-bold cursor-not-allowed border border-gray-200">
                    Faculty Dashboard Mode
                  </div>
                ) : course.isEnrolled ? (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Go to Learning Library
                  </button>
                ) : (
                  <button 
                    onClick={handleRazorpayPayment}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-black shadow-lg shadow-green-100 hover:bg-green-700 hover:scale-[1.02] transition-all"
                  >
                    Buy Now & Start Learning
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