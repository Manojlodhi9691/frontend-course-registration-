import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/courses/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard'); // Go back to see the new course in the list
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Could not create course"));
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="title" placeholder="Course Title" onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
        <input name="price" type="number" placeholder="Price" onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Publish</button>
      </form>
    </div>
  );
};

export default CreateCourse;