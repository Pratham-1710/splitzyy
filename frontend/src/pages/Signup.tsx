import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Shield 
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

function Signup() {
  const navigate = useNavigate();

  // Local state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Sign up to start tracking your expenses</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Signup Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-gray-500" />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50"
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing Up...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log In
              </button>
            </p>
          </div>

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Your data is secure and encrypted</span>
          </div>
        </div>

        {/* Extra text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Join thousands of users worldwide</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;





// import React from 'react'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axiosInstance from '../utils/axiosInstance'

// function Signup() {

//   const navigate = useNavigate()
  
//   // local state
//   const [name,setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

   
//   const handleSignup = async (e: React.FormEvent) =>{
//        e.preventDefault();
//        setError("");
//        setLoading(true);
  

//     try {
         
//         await axiosInstance.post("/auth/signup", {
//              name,email,password
//         });

//         alert("signup Successfull ! please Login");
//         navigate("/login")
         
//    } catch (err: any) {
//       setError(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }

// }

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-gray-100'>
//       <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
        
//           <h2 className='text-2xl font-bold text-center mb-6'>Create Account</h2>

//             <form onSubmit={handleSignup} className='space-y-4'>
//                 <input
//                   type='text'
//                   placeholder='Name'
//                   value={name}
//                   onChange={(e)=> setName(e.target.value)}
//                   className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 '
//                 />

//                 <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//             <button
//             type="submit"
//                 disabled={loading}
//                 className= "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition diabled:opacity-50">
                 
//                  {loading? "signing up... ": "Signup"}
//             </button>
//             </form>

//                  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//         <p className="text-sm text-center mt-6">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-blue-600 hover:underline cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </div>  
        
//         </div>
        
//   )
// }

// export default Signup