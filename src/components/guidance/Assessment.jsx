import { motion } from "framer-motion";
import useDocumentTitle from "../title";
import { useState, useEffect } from "react";

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
  calculateProgress: originalCalculateProgress,
  
}) => {
  useDocumentTitle("Assessment");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState({});

  // New progress calculation that only counts answered questions
  const calculateAnsweredProgress = () => {
    let answeredCount = 0;
    const totalQuestions = Object.values(questions).flat().length;

    Object.keys(questions).forEach(category => {
      questions[category].forEach((q, index) => {
        const questionId = q?.id || `${category}_${index + 1}`;
        if (answers[questionId]) {
          answeredCount++;
        }
      });
    });

    return totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have unsaved assessment progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Check if all questions are answered or skipped
  useEffect(() => {
    const totalQuestions = Object.values(questions).flat().length;
    const answeredCount = Object.keys(answers).length;
    const skippedCount = Object.keys(skippedQuestions).length;

    // Remove any skipped questions that have since been answered
    const updatedSkipped = { ...skippedQuestions };
    let hasChanges = false;

    Object.keys(updatedSkipped).forEach(questionId => {
      if (answers[questionId]) {
        delete updatedSkipped[questionId];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setSkippedQuestions(updatedSkipped);
    }

    setAllQuestionsAnswered(answeredCount + Object.keys(updatedSkipped).length === totalQuestions);
  }, [answers, questions, skippedQuestions]);

  const getQuestionStatus = (category, index) => {
    const questionId = questions[category][index]?.id || `${category}_${index + 1}`;
    if (currentCategory === category && currentQuestionIndex === index) {
      return 'active';
    }
    if (skippedQuestions[questionId] && !answers[questionId]) {
      return 'skipped';
    }
    return answers[questionId] ? 'answered' : 'unanswered';
  };

  const handleQuestionNavigation = (category, index) => {
    setCurrentCategory(category);
    setCurrentQuestionIndex(index);
  };

  const handleSkipQuestion = () => {
    const questionId = questions[currentCategory][currentQuestionIndex].id ||
      `${currentCategory}_${currentQuestionIndex + 1}`;
    setSkippedQuestions(prev => ({ ...prev, [questionId]: true }));
    handleNextQuestion();
  };



  const handleAnswerSelectWithSkipUpdate = (category, questionId, selectedOption) => {
    // If the same option is clicked again, unselect it
    if (answers[questionId] === selectedOption[0]) {
      handleAnswerSelect(category, questionId, null); // Pass null to indicate deselection
      return;
    }

    // Remove from skipped if it exists
    if (skippedQuestions[questionId]) {
      setSkippedQuestions(prev => {
        const newSkipped = { ...prev };
        delete newSkipped[questionId];
        return newSkipped;
      });
    }
    handleAnswerSelect(category, questionId, selectedOption);
  };

  // Check if it's the last question of the last category
  const isLastQuestion = () => {
    const categories = Object.keys(questions);
    const isLastInCategory = currentQuestionIndex === questions[currentCategory].length - 1;
    const isLastCategory = currentCategory === categories[categories.length - 1];
    return isLastInCategory && isLastCategory;
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >

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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Current Question */}
          <div className="lg:w-2/3 bg-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions[currentCategory].length}
                </h4>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-between bg-gray-600 text-white rounded-lg px-3 py-1 text-sm"
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    <span>
                      {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
                    </span>
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <ul
                      className="absolute z-10 mt-1 right-0 w-40 bg-gray-700 rounded-lg shadow-lg py-1"
                      role="listbox"
                    >
                      {Object.keys(questions).map((category) => (
                        <li
                          key={category}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-600 text-sm ${currentCategory === category ? 'bg-gray-600' : ''}`}
                          onClick={() => {
                            setCurrentCategory(category);
                            setCurrentQuestionIndex(0);
                            setDropdownOpen(false);
                          }}
                          role="option"
                          aria-selected={currentCategory === category}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">
                {questions[currentCategory][currentQuestionIndex].question}
              </h3>
            </div>

            <ul className="space-y-3 mb-6">
              {questions[currentCategory][currentQuestionIndex].options.map((option, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`cursor-pointer p-4 rounded-lg transition-all ${answers[questions[currentCategory][currentQuestionIndex].id] === option[0]
                    ? 'bg-gradient-to-r from-blue-700 to-purple-700'
                    : 'bg-gray-600 hover:bg-gray-500'}`}
                  onClick={() => handleAnswerSelectWithSkipUpdate(
                    currentCategory,
                    questions[currentCategory][currentQuestionIndex].id,
                    option
                  )}
                >
                  <div className="flex items-center">
                    <span className="text-lg">{option}</span>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="flex justify-between">
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

              <div className="flex gap-3">
                <motion.button
                  onClick={handleSkipQuestion}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  Skip
                </motion.button>

                <motion.button
                  onClick={handleNextQuestion}
                  disabled={isLastQuestion()}
                  className={`px-6 py-2 rounded-lg ${isLastQuestion()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer'}`}
                  whileHover={{ scale: isLastQuestion() ? 1 : 1.05 }}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation */}
          <div className="lg:w-1/3 space-y-4">
            {/* Question Navigation Grid */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h3 className="text-md font-semibold mb-2">Questions</h3>
              <div className="grid grid-cols-5 gap-1.5">
                {questions[currentCategory].map((_, index) => {
                  const status = getQuestionStatus(currentCategory, index);
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleQuestionNavigation(currentCategory, index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full h-12 rounded-md flex items-center justify-center text-xs font-medium transition-all
                        ${status === 'active' ?
                          'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md ring-1 ring-white' :
                          status === 'answered' ?
                            'bg-green-600/80 text-white' :
                            status === 'skipped' ?
                              'bg-yellow-600/80 text-white' :
                              'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        }`}
                      aria-label={`Question ${index + 1} - ${status}`}
                    >
                      {index + 1}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar - Shows only answered progress */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Answered Progress</span>
                <span className="text-sm font-medium">{calculateAnsweredProgress()}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${calculateAnsweredProgress()}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {Object.keys(answers).length} of {Object.values(questions).flat().length} answered
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmitQuiz}
              className="w-full py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-green-600 to-teal-600 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              {isSubmittingAssessment ? "Submitting..." : "Submit Assessment"}
            </motion.button>

            {/* Legend */}
            <div className="bg-gray-700/50 rounded-lg p-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-purple-600 mr-2"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded bg-green-600/80 mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded bg-yellow-600/80 mr-2"></div>
                  <span>Skipped</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded bg-gray-600 mr-2"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Assessment;