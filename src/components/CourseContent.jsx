import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CourseContent = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourse(res.data);
        // Set the first lecture as the default video if it exists
        if (res.data.lectures && res.data.lectures.length > 0) {
          setActiveVideo(res.data.lectures[0]);
        }
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Classroom...</div>;
  if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Video Player Section */}
      <div className="lg:col-span-2">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video mb-6">
          {activeVideo ? (
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video mb-6">
  {activeVideo ? (
    <video
      key={activeVideo.videoUrl} // Key forces re-render when video changes
      controls
      controlsList="nodownload" // Prevents students from easily stealing your content
      className="w-full h-full"
    >
      <source src={activeVideo.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <div className="h-full flex items-center justify-center text-white italic">
      Select a lecture to start watching.
    </div>
  )}
</div>
          ) : (
            <div className="h-full flex items-center justify-center text-white italic">
              No lectures uploaded yet.
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black text-gray-900">{activeVideo?.title || course.title}</h1>
       
      </div>

      {/* Playlist Sidebar */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-[fit-content]">
        <div className="p-6 bg-indigo-600 text-white font-bold text-xl">
          Course Content
        </div>
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {course.lectures?.map((lecture, index) => (
            <button
              key={index}
              onClick={() => setActiveVideo(lecture)}
              className={`w-full p-5 text-left flex items-center gap-4 transition-all ${
                activeVideo?.videoUrl === lecture.videoUrl 
                ? 'bg-indigo-50 border-l-4 border-indigo-600' 
                : 'hover:bg-gray-50'
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className={`font-bold ${activeVideo?.videoUrl === lecture.videoUrl ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {lecture.title}
                </p>
                <p className="text-xs text-gray-400 uppercase mt-1">Video Lesson</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;