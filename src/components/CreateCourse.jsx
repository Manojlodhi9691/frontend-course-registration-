import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CreateCourse = () => {
  // Added new fields to the initial state
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    price: '',
    instructorExperience: '',
    duration: '',
    batchTiming: '',
    subjects: '' // This will be handled as a string initially
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Transform the subjects string into an array before sending
      const finalData = {
        ...formData,
        subjects: formData.subjects.split(',').map(item => item.trim()).filter(item => item !== "")
      };

      await axios.post(`${API_BASE_URL}/api/courses/create`, finalData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/dashboard'); 
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Could not create course"));
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h2 className="text-3xl font-black mb-6 text-gray-800">Publish New Course</h2>
      
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Course Title</label>
            <input 
              name="title" 
              placeholder="e.g. Advanced Data Mining" 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Course Fee (₹)</label>
            <input 
              name="price" 
              type="number" 
              placeholder="999" 
              onChange={e => setFormData({...formData, price: e.target.value})} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-400">Instructor Experience</label>
          <input 
            name="instructorExperience" 
            placeholder="e.g. 10+ Years in Software Engineering" 
            onChange={e => setFormData({...formData, instructorExperience: e.target.value})} 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Batch Duration</label>
            <input 
              name="duration" 
              placeholder="e.g. 3 Months" 
              onChange={e => setFormData({...formData, duration: e.target.value})} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Batch Timing</label>
            <input 
              name="batchTiming" 
              placeholder="e.g. Mon-Fri | 7PM-9PM" 
              onChange={e => setFormData({...formData, batchTiming: e.target.value})} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        {/* Syllabus Input */}
       

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-400">Course Description</label>
          <textarea 
            name="description" 
            rows="4"
            placeholder="Detailed course overview..." 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition transform active:scale-95">
          Publish Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;