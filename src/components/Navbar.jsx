import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsSun, BsMoon } from "react-icons/bs";

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <motion.nav 
      className="fixed top-0 left-0 w-full bg-gray-900/20 backdrop-blur-md shadow-lg p-4 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold text-white tracking-wider">
          🚀 CareerPath
        </Link>

        {/* Links */}
        <div className="flex space-x-6">
          <NavItem path="/home" text="Home" active={location.pathname === "/"} />
          <NavItem path="/guidance" text="Guidance" active={location.pathname === "/guidance"} />
        </div>


        <div>
          
        

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl text-white p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300"
        >
          
          {darkMode ? <BsSun /> : <BsMoon />}
        </button>
        </div>
      </div>
    </motion.nav>
  );
};

// Individual Navigation Item Component
const NavItem = ({ path, text, active }) => (
  <Link to={path} className={`relative text-lg font-semibold transition-all duration-300 
    ${active ? "text-sky-400" : "text-white hover:text-sky-300"}`}>
    {text}
    {active && <motion.div className="absolute -bottom-1 left-0 w-full h-0.5 bg-sky-400 rounded-lg" layoutId="underline" />}
  </Link>
);

export default Navbar;
