import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                CareerPulse AI
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-20 pb-12">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              animate={{
                textShadow: ["0 0 8px rgba(96, 165, 250, 0.5)", "0 0 16px rgba(168, 85, 247, 0.5)", "0 0 8px rgba(96, 165, 250, 0.5)"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              404
            </motion.h1>
            
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Page Not Found
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                to="/"
                className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl inline-flex items-center group"
              >
                Return to Home
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  &rarr;
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                CareerPulse AI
              </h3>
              <p className="text-gray-400 max-w-xs">
                Helping you find your ideal career through AI-powered assessments.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-purple-400 transition">Home</Link></li>
                  <li><Link to="/login" className="text-gray-400 hover:text-purple-400 transition">Login</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-purple-400 transition">Register</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Contact</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Mail size={18} className="text-purple-400 mr-2 mt-0.5" />
                    <span className="text-gray-400">support@careerpulseai.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} CareerPulse AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageNotFound;