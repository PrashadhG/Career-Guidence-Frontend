import React from 'react';
import {
  ChevronRight,
  AlertCircle,
  Loader2,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import useDocumentTitle from '../title';

const Dashboard = ({
  reports,
  loading,
  error,
  handleStartAssessment,
  navigateToReport,
  setSidebarOpen,
  setActiveTab,
  userName
}) => {
  useDocumentTitle('Dashboard');

  const handleStartWithSidebarClose = () => {
    setSidebarOpen(false);
    handleStartAssessment(); 
  };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        className="w-full h-48 rounded-2xl bg-gradient-to-r from-purple-800 to-blue-800 p-8 flex flex-col justify-center relative overflow-hidden mb-8 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome {userName || 'to Career Pulse'}
          </h1>
          <p className="text-gray-200 mb-6">Discover your perfect career path with our assessment</p>
          <motion.button
            onClick={handleStartWithSidebarClose}
            className="bg-white text-purple-800 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Assessment</span>
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-900/30">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400">Completed Assessments</p>
              <h3 className="text-2xl font-bold">
                {reports?.filter(r => r.evaluationResults?.length).length || 0}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-900/30">
              <ClipboardList className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400">Total Reports</p>
              <h3 className="text-2xl font-bold">{reports?.length || 0}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-400">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-400">Career Options</p>
              <h3 className="text-2xl font-bold">
                {new Set(reports?.flatMap(r => r.results?.top_careers || [])).size || 0}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Career Reports</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Error Loading Reports</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        ) : reports?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((report) => (
              <motion.div
                key={report._id}
                className="bg-gray-800/70 rounded-lg p-5 hover:bg-gray-700/50 transition-colors cursor-pointer border border-gray-700"
                whileHover={{ y: -5 }}
                onClick={() => navigateToReport(report._id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-white line-clamp-1">
                    {report.selectedCareer || 'Career Assessment'}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.evaluationResults?.length
                      ? 'bg-green-900/50 text-green-300'
                      : 'bg-yellow-900/50 text-yellow-300'
                  }`}>
                    {report.evaluationResults?.length ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                {report.level && (
                  <p className="text-sm text-gray-400 mb-3">
                    Grade Level: {report.level}
                  </p>
                )}
                {report.results?.top_careers?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-1">Top Career Matches:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.results.top_careers.slice(0, 3).map((career, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Reports Available</h3>
            <p className="text-gray-300 mb-6">Take an assessment to get started with your career guidance journey.</p>
            <button
              onClick={handleStartWithSidebarClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Start Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;