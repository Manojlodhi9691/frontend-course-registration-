import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// The URL will change automatically between Localhost and your Cloud URL (Render)
const  API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CourseDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetching course details with optional Auth header to check enrollment status
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
      // STEP 1: Create Order on Backend
      const orderRes = await axios.post(`${API_BASE_URL}/api/payments/create-order`, 
        { 
          amount: course.price,
          courseId: id 
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const { amount, id: order_id, currency } = orderRes.data;

      // STEP 2: Configure Razorpay Options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use Environment Variable
        amount,
        currency,
        name: "Academy Portal",
        description: `Purchase ${course.title}`,
        order_id, 
        handler: async function (response) {
          try {
            // STEP 3: Verify Payment Signature on Backend
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payments/verify`, response, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.success) {
              // STEP 4: Finalize Enrollment
              await axios.post(`${API_BASE_URL}/api/courses/enroll`, 
                { courseId: id }, 
                { headers: { Authorization: `Bearer ${token}` }}
              );
              alert("Payment Successful & Enrolled!");
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: { 
          name: user?.name || "", 
          email: user?.email || "" 
        },
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
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-white">
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="mt-2 opacity-90">Instructor: {course.faculty?.name || 'Expert Instructor'}</p>
        </div>
        
        {/* Content Section */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">About this course</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {course.description || "No description available for this course yet."}
          </p>
          
          {/* Action Box */}
          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">
                {course.isEnrolled ? "Access Status" : "Course Price"}
              </p>
              <p className="text-3xl font-extrabold text-indigo-600">
                {course.isEnrolled ? "Lifetime Access" : `₹${course.price}`}
              </p>
            </div>

            {/* Role-Based Buttons */}
            <div className="flex gap-4">
              {user?.role === 'faculty' ? (
                <span className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-xl font-bold border border-indigo-200">
                  Faculty View Mode
                </span>
              ) : course.isEnrolled ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={handleRazorpayPayment}
                  className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all active:scale-95"
                >
                  Pay & Enroll
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;