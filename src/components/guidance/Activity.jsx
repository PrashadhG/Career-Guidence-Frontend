import { motion } from "framer-motion";
import { FiSave } from "react-icons/fi";
import useDocumentTitle from "../title";

const Activity = ({
  activities,
  userResponse,
  isSaving,
  isSubmittingResponse,
  setActiveTab,
  setUserResponse,
  handleSubmitActivityResponse,
  saveReport
}) => {
  useDocumentTitle("Career Activity");
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📚 Career Activity</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("results")}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Back to Results
          </button>
          <button
            onClick={saveReport}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-300">{activities[0].title}</h3>
        <div className="prose prose-invert max-w-none">
          {activities[0].instructions.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="bg-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Your Response</h3>
        <textarea
          className="w-full p-4 bg-gray-800 rounded-lg text-white mb-4 min-h-[200px]"
          placeholder="Write your response here..."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
        />
        <div className="flex justify-end">
          <motion.button
            onClick={handleSubmitActivityResponse}
            className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center ${isSubmittingResponse
              ? 'bg-gradient-to-r from-purple-700 to-blue-700 opacity-75 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 cursor-pointer'}`}
            whileHover={!isSubmittingResponse ? { scale: 1.05 } : {}}
            disabled={isSubmittingResponse}
          >
            {isSubmittingResponse ? "Submitting..." : "Submit Response"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Activity;