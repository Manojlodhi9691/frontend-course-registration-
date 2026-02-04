import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load.");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      // FIX: Added courseId to the request body so backend can block duplicate purchases
      const orderRes = await axios.post('http://localhost:5000/api/payments/create-order', 
        { 
          amount: course.price,
          courseId: id 
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const { amount, id: order_id, currency } = orderRes.data;

      const options = {
        key: "rzp_test_S9ELqKAdUHgy02", 
        amount,
        currency,
        name: "Academy Portal",
        description: `Purchase ${course.title}`,
        order_id, 
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('http://localhost:5000/api/payments/verify', response, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.success) {
              await axios.post('http://localhost:5000/api/courses/enroll', 
                { courseId: id }, 
                { headers: { Authorization: `Bearer ${token}` }}
              );
              alert("Payment Successful & Enrolled!");
              navigate('/dashboard');
            }
          } catch (error) {
            alert("Verification failed.");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#4F46E5" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      // If the backend blocks the order (already enrolled), it will show here
      alert(err.response?.data?.message || "Payment initiation failed.");
    }
  };

  if (!course) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="mt-2">Instructor: {course.faculty?.name || 'Faculty'}</p>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">About this course</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{course.description}</p>
          
          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">
                {course.isEnrolled ? "Access Status" : "Course Price"}
              </p>
              <p className="text-3xl font-extrabold text-indigo-600">
                {course.isEnrolled ? "Lifetime Access" : `₹${course.price}`}
              </p>
            </div>

            {user?.role === 'faculty' ? (
              <span className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-xl font-bold border border-indigo-200">
                Faculty View Mode
              </span>
            ) : course.isEnrolled ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <button 
                onClick={handleRazorpayPayment}
                className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all"
              >
                Pay & Enroll
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;