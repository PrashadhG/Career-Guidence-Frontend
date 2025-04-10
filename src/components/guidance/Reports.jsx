import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

const Reports = ({ savedReports, setActiveTab, navigate }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-6">📚 My Saved Reports</h2>
      {savedReports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">You don't have any saved reports yet</p>
          <button
            onClick={() => setActiveTab("assessment")}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium cursor-pointer"
          >
            Take New Assessment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedReports.map(report => (
            <motion.div
              key={report._id}
              className="bg-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/reports/${report._id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">{report.selectedCareer || "Career Assessment"}</h3>
                <span className="text-sm bg-gray-600 px-2 py-1 rounded">
                  {report.level}th Grade
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-300">
                  {report.evaluationResults?.length ? "Completed" : "In Progress"}
                </span>
                <FiChevronRight className="text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;