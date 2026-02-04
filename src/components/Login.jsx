import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Attempting login for:", email);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            console.log("Login successful:", res.data);

            // 1. Store Token and User in LocalStorage for persistence
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // 2. Update the Global App State
            setUser(res.data.user);

            // 3. ROLE-BASED REDIRECTION
            // This checks the 'role' field saved in your MongoDB
            if (res.data.user.role === 'faculty') {
                console.log("Access Granted: Faculty Dashboard");
                navigate('/faculty-dashboard');
            } else {
                console.log("Access Granted: Student Dashboard");
                navigate('/dashboard');
            }

        } catch (err) {
            console.error("Login Error:", err);
            if (err.response) {
                // Backend sent a specific error message (e.g., "Invalid Credentials")
                alert(err.response.data.message);
            } else {
                // Server is likely offline
                alert("Server connection failed. Please check if your backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-2xl rounded-2xl border w-full max-w-md transform transition-all">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@university.com" 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                            loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                        }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?  
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="ml-1 text-indigo-600 font-bold hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;