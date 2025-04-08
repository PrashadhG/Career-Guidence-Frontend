import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import useDocumentTitle from "../components/title";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    message: ""
  });
  const navigate = useNavigate();
  useDocumentTitle("Login");

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", message: "" }); // Reset errors

    // Basic validation
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/guidance");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(prev => ({ ...prev, message: "Invalid email or password" }));
      } else {
        setErrors(prev => ({ ...prev, message: "An error occurred. Please try again." }));
      }
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[#111827]"
    >
      <div className="bg-[#1f2937] rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Career Path</h1>
          <p className="text-gray-300 mt-2">Shape your professional journey</p>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Welcome Back</h2>

        {errors.message && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-md text-sm border border-red-700">
            {errors.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: "" }));
                }}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-md bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: "" }));
                }}
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-[#374151]"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Sign up
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;