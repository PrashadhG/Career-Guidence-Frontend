import { useNavigate } from "react-router-dom";
import video from "../assets/video.mp4";
import { motion } from "framer-motion";

const Guidance = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-purple-900/50"></div>

      {/* Stars Animation */}
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

      {/* Content */}
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
            onClick={() => navigate("/")}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl flex items-center mx-auto group"
          >
            Start Your Journey
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
              🚀
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Floating indicators */}
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
    </div>
  );
};

export default Guidance;