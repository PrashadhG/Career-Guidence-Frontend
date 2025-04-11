import { motion } from "framer-motion";
import { FiSave } from "react-icons/fi";
import useDocumentTitle from "../title";

const Evaluation = ({
  selectedCareer,
  evaluationResult,
  isSaving,
  setActiveTab,
  saveReport,
  navigate,
  resetAssessmentState
}) => {
  useDocumentTitle("Activity Evaluation");
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📊 Activity Evaluation</h2>
        <button
          onClick={saveReport}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg disabled:opacity-50 cursor-pointer"
        >
          <FiSave className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-700 to-blue-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Career Fit Analysis</h3>
          <p className="mb-4">{selectedCareer} seems to be a {evaluationResult.overall.score >= 70 ? 'strong' : 'moderate'} fit based on your response.</p>
          <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
            <div
              className="bg-yellow-500 h-4 rounded-full"
              style={{ width: `${evaluationResult.overall.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>0%</span>
            <span>{evaluationResult.overall.score}% Match</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-6">
        <button
          onClick={() => setActiveTab("activity")}
          className="px-6 py-3 bg-gray-700 rounded-lg cursor-pointer font-bold"
        >
          Back to Activity
        </button>
        <button
          onClick={() => {
            resetAssessmentState();
            setActiveTab("dashboard");
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default Evaluation;