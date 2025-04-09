import { useNavigate } from "react-router-dom";
import video from "../assets/video.mp4";
import { motion } from "framer-motion";
import { Menu, X, Github, Twitter, Linkedin, Mail, Activity } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AboutImage from "../assets/about.png";
const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    document.title = "Career Pathfinder"; 
  }, []);
  

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-gray-900 text-white scroll-snap-y-mandatory">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800' : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isScrolled ? 'from-blue-400 to-purple-600' : 'from-blue-500 to-purple-600'}`}>
                Career Pathfinder
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('steps')}
                className={`transition ${isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}
              >
                Steps
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`transition ${isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`transition ${isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}
              >
                Contact
              </button>
              <div className="flex space-x-4 ml-8">
                <button
                  onClick={() => navigate("/")}
                  className={`px-4 py-2 rounded-lg transition ${isScrolled ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                >
                  Sign Up
                </button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={isScrolled ? 'text-white' : 'text-gray-700'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 space-y-4 rounded-lg p-4 ${isScrolled ? 'bg-gray-800/90' : 'bg-white'} shadow-lg`}>
              <button 
                onClick={() => scrollToSection('steps')}
                className={`block transition ${isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}
              >
                Steps
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`block transition ${isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`block transition ${isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}
              >
                Contact
              </button>
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={() => { navigate("/"); setIsMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition ${isScrolled ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/register"); setIsMenuOpen(false); }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden pt-16 snap-start"
      >
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-purple-900/50"></div>

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.8 + 0.2
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            animate={{
              textShadow: ["0 0 8px rgba(96, 165, 250, 0.5)", "0 0 16px rgba(168, 85, 247, 0.5)", "0 0 8px rgba(96, 165, 250, 0.5)"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Discover Your Dream Career
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mt-4 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Take our <span className="font-semibold text-purple-300">AI-powered assessment</span> and unlock personalized career recommendations tailored to your unique strengths and interests.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button
              onClick={() => navigate("/register")}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl flex items-center mx-auto group cursor-pointer"
            >
              Start Your Journey
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                🚀
              </span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2"
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section 
        id="steps" 
        className="py-20 bg-gray-900 h-screen snap-start flex items-center"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our simple three-step process helps you discover your ideal career path
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Step 1 */}
            <motion.div
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-1 max-w-md"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="text-purple-400 mb-4 text-2xl font-bold">01</div>
              <h3 className="text-2xl font-semibold mb-4">Take the Assessment</h3>
              <p className="text-gray-300 mb-6">
                Complete our 15-minute AI-powered assessment that evaluates your skills, interests, and personality traits.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-1 max-w-md"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="text-purple-400 mb-4 text-2xl font-bold">02</div>
              <h3 className="text-2xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-300 mb-6">
                Our advanced algorithms analyze your responses against thousands of career paths to find the best matches.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex-1 max-w-md"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="text-purple-400 mb-4 text-2xl font-bold">03</div>
              <h3 className="text-2xl font-semibold mb-4">Get Your Report</h3>
              <p className="text-gray-300 mb-6">
                Receive a detailed report with personalized career recommendations, skill gaps, and actionable next steps.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="py-20 bg-gray-800/30 h-screen snap-start flex items-center"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src={AboutImage} 
                alt="About CareerPath" 
                className="rounded-xl shadow-2xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                About Our Platform
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                CareerPath is an innovative career guidance platform that leverages artificial intelligence to help individuals discover their ideal career paths.
              </p>
              <p className="text-gray-300 mb-6">
                Our mission is to bridge the gap between education and employment by providing personalized, data-driven career recommendations that align with your unique strengths and aspirations.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center">
                  <div className="mr-4 text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">AI-Powered</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-purple-400">
                    <Activity size={24} />
                  </div>
                  <span className="text-gray-300">Activity-Based</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Detailed Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="py-20 bg-gray-900 h-screen snap-start flex items-center"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Contact Us
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition w-full md:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 h-full">
                <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-purple-400 mr-4 mt-1">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Email</h4>
                      <p className="text-gray-400">support@careerpath.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-purple-400 mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Phone</h4>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-purple-400 mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Address</h4>
                      <p className="text-gray-400">123 Career Street, Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="text-lg font-medium mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                CareerPath
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
                  <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-purple-400 transition">Home</button></li>
                  <li><button onClick={() => scrollToSection('steps')} className="text-gray-400 hover:text-purple-400 transition">How It Works</button></li>
                  <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-purple-400 transition">About</button></li>
                  <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-purple-400 transition">Contact</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Cookie Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-300">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400 transition">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} CareerPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;