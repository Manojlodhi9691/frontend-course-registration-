import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageLectures = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lectureTitle, setLectureTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  // --- NEW: DELETE LECTURE FUNCTION ---
  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;

    try {
      const token = localStorage.getItem('token');
      // Adjust this URL to match your backend DELETE route
      await axios.delete(`${API_BASE_URL}/api/courses/${id}/lectures/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Lecture deleted successfully!");
      fetchCourse(); // Refresh the list
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete lecture.");
    }
  };

  const handleUpload = () => {
    if (!window.cloudinary) {
      alert("Cloudinary SDK not loaded. Please check your internet.");
      return;
    }

    setIsUploading(true);

    window.cloudinary.openUploadWidget({
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
      resourceType: "video",
      clientAllowedFormats: ["mp4", "mov", "avi"],
      maxFileSize: 50000000, 
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        setVideoUrl(result.info.secure_url);
        setIsUploading(false);
        alert("Video uploaded successfully to Cloudinary!");
      } else if (error) {
        setIsUploading(false);
        console.error("Upload Error:", error);
      }
    });
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!videoUrl) {
      alert("Please upload a video first!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/courses/${id}/add-lecture`, 
        { title: lectureTitle, videoUrl: videoUrl },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      alert("Lecture Added to Course!");
      setLectureTitle('');
      setVideoUrl('');
      fetchCourse(); 
    } catch (err) {
      alert("Failed to save lecture to database.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Course Manager...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Manage Curriculum</h1>
      <p className="text-gray-500 mb-8">Course: <span className="text-indigo-600 font-bold">{course?.title}</span></p>

      {/* Upload Form (Same as before) */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
        <h3 className="text-xl font-bold mb-6">Upload New Video Lesson</h3>
        <form onSubmit={handleAddLecture} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lecture Title</label>
            <input 
              type="text" placeholder="e.g. 01 - Introduction to MERN"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-10 rounded-3xl bg-gray-50/50">
            {videoUrl ? (
              <div className="text-center">
                <p className="text-green-600 font-bold mb-2">✓ Video Ready for Database</p>
                <p className="text-xs text-gray-400 truncate max-w-xs">{videoUrl}</p>
                <button type="button" onClick={() => setVideoUrl('')} className="mt-4 text-red-500 text-sm font-bold underline">
                  Remove & Re-upload
                </button>
              </div>
            ) : (
              <button 
                type="button" onClick={handleUpload} disabled={isUploading}
                className={`px-8 py-4 rounded-2xl font-black transition-all ${isUploading ? 'bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {isUploading ? 'Uploading...' : '📁 Choose Video File'}
              </button>
            )}
          </div>

          <button type="submit" disabled={!videoUrl} className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all ${!videoUrl ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}>
            Save Lecture to Course
          </button>
        </form>
      </div>

      {/* --- UPDATED: LIST OF LECTURES WITH DELETE BUTTON --- */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>📚</span> Course Curriculum
        </h3>
        {course?.lectures?.length === 0 ? (
          <p className="text-gray-400 italic bg-gray-50 p-6 rounded-2xl text-center">No videos uploaded yet.</p>
        ) : (
          course?.lectures?.map((lec, index) => (
            <div key={lec._id || index} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">{index + 1}</span>
                <p className="font-bold text-gray-800">{lec.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">Hosted</span>
                {/* DELETE BUTTON */}
                <button 
                  onClick={() => handleDeleteLecture(lec._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Lecture"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageLectures;