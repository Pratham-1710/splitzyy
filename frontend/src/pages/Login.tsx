import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Shield
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
// import { setNotifications } from "../store/slices/notificationSlice";

import { useDispatch } from "react-redux";
// import { setNotifications } from "../store/slices/notificationSlice";




// TypeScript interface that defines what props this component expects
interface LoginProps {
  setUser: (user: any) => void;    // Function to save user data after successful login
  setToken: (token: string) => void; // Function to save authentication token
  token: string | null
}

function Login({ setUser, setToken, token }: LoginProps) {
  // Hook to programmatically navigate between pages (like going to dashboard after login)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State variables to manage form data and UI states
  const [email, setEmail] = useState("");           // User's email input
  const [password, setPassword] = useState("");     // User's password input
  const [showPassword, setShowPassword] = useState(false); // Whether to show/hide password
  const [loading, setLoading] = useState(false);    // Whether we're currently logging in
  const [error, setError] = useState("");           // Any error messages to show

  // const[isNotIf,setIsNotIf] = useState(false);
  // const[notification,setNotification] = useState([])

  // Function that runs when user submits the login form
  const handleLogin = async (e: React.FormEvent) => {
    // Prevent the browser from refreshing the page (default form behavior)
    e.preventDefault();
    
    // Clear any previous error messages
    setError("");
    
    // Show loading state while we process the login
    setLoading(true);

    try {
      // Send login request to our backend API
      const res = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      
      
      // If login successful, save user data and token
      setUser(res.data.user);
      setToken(res.data.token);

      // const notif = await axiosInstance.get('/notification?limit=5', {
      //     headers: {Authorization: `Bearer ${token}`}
      // })
        
      // if(notif){

      //   dispatch(setNotifications(notif.data))
      // }
      // console.log("delta",notif.data)

      // // the moment you logged in got recent 5 notification
      //  const Notification = await axiosInstance.get('/notification?limit=5', {
      //      headers: { Authorization: `Bearer ${token}` }
      //   });

        
      // console.log("notif are",Notification);
        //  if(Notification){
               
              // setIsNotIf(true);
              // setNotification(Notification.data)
        //  }

        //  if(!Notification){
            //  console.log("No notification is there")
        //  }
     
      // Navigate to the dashboard page
      navigate("/dashboard");
    } catch (err: any) {
      // If login fails, show error message to user
      setError(err.response?.data?.message || "Login failed");
    } finally {
      // Always turn off loading state, whether success or failure
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration elements for visual appeal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main login card container */}
      <div className="relative w-full max-w-md">
        {/* Login form card with modern styling */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
          
          {/* Header section with logo and title */}
          <div className="relative text-center mb-8">
            {/* App logo/icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            {/* Welcome message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to manage your expenses</p>
          </div>

          {/* Error message display - only shows if there's an error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email input field */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                {/* Email icon inside the input */}
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

            {/* Password input field */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>Password</span>
              </label>
              <div className="relative">
                {/* Lock icon inside the input */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50"
                />
                {/* Show/hide password button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <>
                  {/* Spinning loader icon */}
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  {/* Shield icon for security */}
                  <Shield className="w-5 h-5" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Security badge for trust */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Your data is secure and encrypted</span>
          </div>
        </div>

        {/* Additional trust indicators */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Trusted by thousands of users worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;









// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// interface LoginProps {
//   setUser: (user: any) => void;
//   setToken: (token: string) => void;
// }


// function Login({setUser,setToken}: LoginProps) {
//    const navigate = useNavigate();

//    const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async(e: React.FormEvent) =>{
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//            const res = await axiosInstance.post('/auth/login', {
//              email,password
//            });

//            setUser(res.data.user);
//            setToken(res.data.token);

          

//            navigate("/dashboard")
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
// }

//   return(
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
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

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//         <p className="text-sm text-center mt-6">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="text-blue-600 hover:underline cursor-pointer"
//           >
//             Signup
//           </span>
//         </p>
//       </div>
//     </div>

//   );
// }


// export default Login;
