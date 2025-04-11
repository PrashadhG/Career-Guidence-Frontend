import { motion } from "framer-motion";
import { FiSave } from "react-icons/fi";
import useDocumentTitle from "../title";

const Results = ({
  result,
  selectedCareer,
  isSaving,
  isGeneratingActivities,
  saveReport,
  handleGenerateActivity,
  setSelectedCareer,
  getCareerMatchScore
}) => {
  useDocumentTitle("Assessment Results");
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🌟 Your Career Matches</h2>
        <button
          onClick={saveReport}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg disabled:opacity-50"
        >
          <FiSave className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Personality Traits</h3>
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-hide"> {/* Added scrollable container */}
            <ul className="space-y-2">
              {result.individual_results.personality?.dominant_traits &&
                Object.entries(result.individual_results.personality.dominant_traits)
                  .sort((a, b) => b[1] - a[1]) // Sort by score descending
                  .map(([trait, score], i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
                        <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                      </div>
                    </li>
                  ))
              }
            </ul>
          </div>
        </div>

        <div className="bg-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-blue-300">Recommended Subjects</h3>
          <div className="mb-4">
            <h4 className="font-medium text-blue-200">Core Subjects:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.subject_recommendations.core.map((subj, i) => (
                <span key={i} className="px-3 py-1 bg-blue-900 rounded-full text-sm">
                  {subj}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-200">Electives:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {result?.subject_recommendations.electives?.map((subj, i) => (
                <span key={i} className="px-3 py-1 bg-blue-800 rounded-full text-sm">
                  {subj}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-center">Top Career Matches</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from(new Set([
          ...result.individual_results.orientation?.top_careers?.slice(0, 3) || [],
          ...result.individual_results.interest?.top_careers?.slice(0, 3) || [],
          ...result.individual_results.personality?.top_careers?.slice(0, 3) || []
        ])).map((career, i) => (
          <motion.div
            key={i}
            className={`bg-gradient-to-br rounded-xl p-6 cursor-pointer transition-all ${selectedCareer === career
              ? 'from-purple-600 to-blue-600 scale-105 shadow-lg'
              : 'from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'}`}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedCareer(career)}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xl font-bold">{career}</h4>
              <span className="px-2 py-1 bg-black bg-opacity-30 rounded-full text-sm">
                {getCareerMatchScore(career)}% match
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {selectedCareer === career && "Selected for further exploration"}
            </p>
          </motion.div>
        ))}
      </div>

      {selectedCareer && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={handleGenerateActivity}
            className={`px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center ${isGeneratingActivities
              ? 'bg-gradient-to-r from-yellow-700 to-orange-700 opacity-75 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-600 to-orange-600 cursor-pointer hover:shadow-xl'}`}
            whileHover={!isGeneratingActivities ? { scale: 1.05 } : {}}
            disabled={isGeneratingActivities}
          >
            {isGeneratingActivities ? "Generating..." : `Explore ${selectedCareer} Activities`}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default Results;