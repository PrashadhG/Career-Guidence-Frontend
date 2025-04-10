import { motion } from "framer-motion";
import useDocumentTitle from "../title";

const Assessment = ({
  level,
  setLevel,
  questions,
  currentCategory,
  currentQuestionIndex,
  answers,
  isGeneratingQuestions,
  isSubmittingAssessment,
  handleStartQuiz,
  handleAnswerSelect,
  handlePrevQuestion,
  handleNextQuestion,
  handleSubmitQuiz,
  setCurrentCategory,
  setCurrentQuestionIndex,
  calculateProgress
}) => {
  useDocumentTitle("Assessment");
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">🧠 Career Assessment</h2>

      {!Object.values(questions).flat().length && (
        <div className="text-center">
          <h3 className="text-xl mb-6">Select your grade level to begin</h3>
          <div className="flex justify-center space-x-6">
            {['10', '12'].map(grade => (
              <motion.button
                key={grade}
                onClick={() => setLevel(grade)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl text-lg font-bold cursor-pointer ${level === grade ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700 '}`}
              >
                {grade}th Grade
              </motion.button>
            ))}
          </div>
          {level && (
            <motion.button
              onClick={handleStartQuiz}
              className={`mt-10 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all ${isGeneratingQuestions
                ? 'bg-gradient-to-r from-green-700 to-teal-700 opacity-75 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-teal-600 cursor-pointer'}`}
              whileHover={!isGeneratingQuestions ? { scale: 1.05 } : {}}
              disabled={isGeneratingQuestions}
            >
              {isGeneratingQuestions ? "Generating..." : "Start Assessment"}
            </motion.button>
          )}
        </div>
      )}

      {Object.values(questions).flat().length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <select
              value={currentCategory}
              onChange={(e) => {
                setCurrentCategory(e.target.value);
                setCurrentQuestionIndex(0);
              }}
              className="bg-gray-700 text-white rounded-lg px-4 py-2"
            >
              {Object.keys(questions).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Questions
                </option>
              ))}
            </select>

            <div className="text-gray-300">
              Question {currentQuestionIndex + 1} of {questions[currentCategory].length}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-bold text-lg mb-3">
                {currentQuestionIndex + 1}. {questions[currentCategory][currentQuestionIndex].question}
              </h4>
              <ul className="space-y-2">
                {questions[currentCategory][currentQuestionIndex].options.map((option, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 5 }}
                    className={`cursor-pointer p-3 rounded-lg transition-colors ${answers[questions[currentCategory][currentQuestionIndex].id] === option[0]
                      ? 'bg-gradient-to-r from-blue-700 to-purple-700'
                      : 'bg-gray-600 hover:bg-gray-500'}`}
                    onClick={() => handleAnswerSelect(
                      currentCategory,
                      questions[currentCategory][currentQuestionIndex].id,
                      option
                    )}
                  >
                    {option}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0 && currentCategory === Object.keys(questions)[0]}
                className={`px-6 py-2 rounded-lg ${currentQuestionIndex === 0 && currentCategory === Object.keys(questions)[0]
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-500 cursor-pointer'}`}
                whileHover={{ scale: currentQuestionIndex > 0 || currentCategory !== Object.keys(questions)[0] ? 1.05 : 1 }}
              >
                Previous
              </motion.button>

              {currentQuestionIndex === questions[currentCategory].length - 1 &&
                currentCategory === Object.keys(questions)[Object.keys(questions).length - 1] ? (
                <motion.button
                  onClick={handleSubmitQuiz}
                  className={`px-8 py-2 rounded-lg font-bold flex items-center justify-center ${isSubmittingAssessment
                    ? 'bg-gradient-to-r from-purple-700 to-blue-700 opacity-75 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 cursor-pointer'}`}
                  whileHover={!isSubmittingAssessment ? { scale: 1.05 } : {}}
                  disabled={isSubmittingAssessment}
                >
                  {isSubmittingAssessment ? "Submitting..." : "Submit Assessment"}
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-full h-2 w-full">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Assessment;