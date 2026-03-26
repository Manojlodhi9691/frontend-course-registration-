import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageLectures = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [newLecture, setNewLecture] = useState({ title: '', videoUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Extract YouTube ID if they paste a full link
      const videoId = newLecture.videoUrl.split('v=')[1] || newLecture.videoUrl.split('/').pop();
      
      await axios.put(`${API_BASE_URL}/api/courses/${id}/add-lecture`, 
        { title: newLecture.title, videoUrl: videoId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      alert("Lecture Added Successfully!");
      setNewLecture({ title: '', videoUrl: '' });
      fetchCourse(); // Refresh the list
    } catch (err) {
      alert("Failed to add lecture. Make sure you are the Faculty of this course.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Course Manager...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Manage Lectures</h1>
      <p className="text-gray-500 mb-8">Course: <span className="text-indigo-600 font-bold">{course?.title}</span></p>

      {/* Add Lecture Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10">
        <h3 className="text-xl font-bold mb-4">Add New Video Lesson</h3>
        <form onSubmit={handleAddLecture} className="space-y-4">
          <input 
            type="text" placeholder="Lecture Title (e.g., Intro to React)"
            className="w-full p-3 border rounded-xl"
            value={newLecture.title}
            onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
            required
          />
          <input 
            type="text" placeholder="YouTube Video URL or ID"
            className="w-full p-3 border rounded-xl"
            value={newLecture.videoUrl}
            onChange={(e) => setNewLecture({...newLecture, videoUrl: e.target.value})}
            required
          />
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition w-full">
            Upload to Course
          </button>
        </form>
      </div>

      {/* Existing Lectures List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Current Curriculum</h3>
        {course?.lectures?.length === 0 && <p className="text-gray-400 italic">No lectures added yet.</p>}
        {course?.lectures?.map((lec, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
            <div>
              <p className="font-bold text-gray-800">{lec.title}</p>
              <p className="text-xs text-gray-400">ID: {lec.videoUrl}</p>
            </div>
            <span className="text-green-600 text-sm font-bold">Live</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageLectures;