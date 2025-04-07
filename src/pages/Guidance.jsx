import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiSave, FiBookmark, FiChevronRight, FiCheck, FiX, FiActivity, FiLogOut } from "react-icons/fi";

const Guidance = () => {
  const token = localStorage.getItem("token");
  const [level, setLevel] = useState("");
  const [questions, setQuestions] = useState({ personality: [], orientation: [], interest: [] });
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userResponse, setUserResponse] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [activeTab, setActiveTab] = useState("assessment");
  const [assessmentId] = useState(uuidv4());
  const navigate = useNavigate();

  // Fetch saved reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports/my", {
          headers: { "x-auth-token": token }
        });
        setSavedReports(res.data);
        console.log("REPORT FETCH : ", res.data)
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    
    fetchReports();
  }, []);

  const handleStartQuiz = async () => {
    if (!level) return alert("Please select a grade!");

    const requestData = {
      level,
      categories: ["personality", "orientation", "interest"],
      questions_per_category: 5
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/generate_psychometric_assessment", requestData);
      setQuestions(res.data.questions_by_category);
      console.log("Assesnment Generated : ", res.data)
      setAnswers({});
      setResult(null);
      setSelectedCareer(null);
      setActivities([]);
      setUserResponse("");
      setEvaluationResult(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerSelect = (category, questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption[0]
    }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length !== Object.values(questions).flat().length) {
      return alert("Please answer all questions!");
    }

    const formattedAnswers = {
      user_id: assessmentId,
      orientation_responses: {},
      interest_responses: {},
      personality_responses: {},
      aptitude_scores: {
        Numerical_Aptitude: 0,
        Spatial_Aptitude: 0,
        Perceptual_Aptitude: 0,
        Abstract_Reasoning: 0,
        Verbal_Reasoning: 0
      }
    };

    Object.keys(questions).forEach(category => {
      questions[category].forEach(q => {
        formattedAnswers[`${category}_responses`][q.id] = answers[q.id] || "";
      });
    });

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze_complete_assessment", formattedAnswers);
      setResult(res.data);
      console.log("Assesment RESULTS : ", res.data)
      setActiveTab("results");
    } catch (error) {
      console.error("Error analyzing assessment:", error);
    }
  };

  const handleGenerateActivity = async () => {
    if (!selectedCareer) return alert("Please select a career!");

    const requestData = {
      career_path: selectedCareer,
      class_level: level,
      specific_area: result.subject_recommendations.core[0]
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/generate_activities", requestData);
      setActivities(res.data.activities);
      console.log("Activities Generated : ", res.data)
      setActiveTab("activity");
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleSubmitActivityResponse = async () => {
    if (!userResponse.trim()) return alert("Please enter your response!");

    const requestData = {
      activity_id: activities[0].id,
      response: userResponse,
      career_path: selectedCareer,
      class_level: level,
      response_type: "text",
      image_data: ""
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/evaluate_activity/", requestData);
      setEvaluationResult(res.data.evaluation);
      console.log("Activitiess Evaluation Result : ", res.data)
      setActiveTab("evaluation");
    } catch (error) {
      console.error("Error evaluating response:", error);
    }
  };

  const saveReport = async () => {
    if (!result) return;
    
    try {
      setIsSaving(true);
      
      
      await axios.post("http://localhost:5000/api/reports", {
        assessmentId,
        level,
        answers,
        results: result,
        selectedCareer,
        activities,
        evaluationResults: evaluationResult ? [evaluationResult] : []
      }, {
        headers: { "x-auth-token": token }  // Changed to match middleware
      });
      
      const res = await axios.get("http://localhost:5000/api/reports/my", {
        headers: { "x-auth-token": token }  // Changed to match middleware
      });
      setSavedReports(res.data);
    } catch (error) {
      console.error("Error saving report:", error);
      // Add error handling for 401 unauthorized
      if (error.response?.status === 401) {
        // Handle unauthorized (token expired/invalid)
        console.log("Please login again");
        // Optionally redirect to login
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getCareerMatchScore = (career) => {
    if (!result) return 0;
    
    let score = 0;
    const categories = ["orientation", "interest", "personality", "aptitude"];
    
    categories.forEach(cat => {
      const topCareers = result.individual_results[cat]?.top_careers || [];
      const index = topCareers.indexOf(career);
      if (index !== -1) {
        score += (topCareers.length - index) / topCareers.length * 25;
      }
    });
    
    return Math.round(score);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate("/")}
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            CareerPathfinder
          </button>
          <div className="flex space-x-4">
          <button 
              onClick={() => setActiveTab("assessment")}
              className="flex items-center px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition"
            >
              <FiActivity className="mr-2" /> Assesment
            </button>
            <button 
              onClick={() => setActiveTab("reports")}
              className="flex items-center px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition"
            >
              <FiBookmark className="mr-2" /> My Reports
            </button>
            <button 
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 transition"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {activeTab === "reports" ? (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6">📚 My Saved Reports</h2>
            
            {savedReports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">You don't have any saved reports yet</p>
                <button 
                  onClick={() => setActiveTab("assessment")}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium"
                >
                  Take New Assessment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedReports && (
                  <>
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
                  </>
                )}
                
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center">
                {['assessment', 'results', 'activity', 'evaluation'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <button
                      onClick={() => setActiveTab(step)}
                      className={`flex flex-col items-center ${activeTab === step ? 'text-white' : 'text-gray-400'}`}
                      disabled={
                        (step === 'results' && !result) ||
                        (step === 'activity' && !selectedCareer) ||
                        (step === 'evaluation' && !evaluationResult)
                      }
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        activeTab === step ? 'bg-purple-600' : 
                        (step === 'assessment' || 
                         (step === 'results' && result) ||
                         (step === 'activity' && selectedCareer) ||
                         (step === 'evaluation' && evaluationResult)) ? 'bg-gray-700' : 'bg-gray-800'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-xs capitalize">{step}</span>
                    </button>
                    {index < 3 && (
                      <div className={`h-1 w-16 mx-2 ${activeTab === step ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Tab */}
            {activeTab === "assessment" && (
              <motion.div 
                className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-center">🧠 Career Assessment</h2>

                {/* Grade Selection */}
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
                          className={`px-8 py-4 rounded-xl text-lg font-bold ${
                            level === grade ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700'
                          }`}
                        >
                          {grade}th Grade
                        </motion.button>
                      ))}
                    </div>
                    {level && (
                      <motion.button
                        onClick={handleStartQuiz}
                        className="mt-10 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Assessment
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Questions */}
                {Object.values(questions).flat().length > 0 && (
                  <div className="space-y-8">
                    {Object.keys(questions).map((category) => (
                      questions[category].length > 0 && (
                        <div key={category} className="bg-gray-700 rounded-lg p-6">
                          <h3 className="text-xl font-bold mb-4 capitalize border-b border-gray-600 pb-2">
                            {category} Questions
                          </h3>
                          <div className="space-y-6">
                            {questions[category].map((q, index) => (
                              <div key={q.id} className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-bold text-lg mb-3">
                                  {index + 1}. {q.question}
                                </h4>
                                <ul className="space-y-2">
                                  {q.options.map((option, i) => (
                                    <motion.li
                                      key={i}
                                      whileHover={{ x: 5 }}
                                      className={`cursor-pointer p-3 rounded-lg transition-colors ${
                                        answers[q.id] === option[0] 
                                          ? 'bg-gradient-to-r from-blue-700 to-purple-700' 
                                          : 'bg-gray-600 hover:bg-gray-500'
                                      }`}
                                      onClick={() => handleAnswerSelect(category, q.id, option)}
                                    >
                                      {option}
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}

                    <div className="flex justify-center">
                      <motion.button
                        onClick={handleSubmitQuiz}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Submit Assessment
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results Tab */}
            {activeTab === "results" && result && (
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
                    <ul className="space-y-2">
  {result.individual_results.personality?.dominant_traits && 
    Object.keys(result.individual_results.personality.dominant_traits).map((trait, i) => (
      <li key={i} className="flex items-center">
        <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
        <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
      </li>
    ))
  }
</ul>
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
                      className={`bg-gradient-to-br rounded-xl p-6 cursor-pointer transition-all ${
                        selectedCareer === career 
                          ? 'from-purple-600 to-blue-600 scale-105 shadow-lg' 
                          : 'from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
                      }`}
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
                      className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore {selectedCareer} Activities
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && activities.length > 0 && (
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
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Response
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Evaluation Tab */}
            {activeTab === "evaluation" && evaluationResult && (
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
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg disabled:opacity-50"
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

                  {/* <div className="bg-gradient-to-br from-blue-700 to-teal-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Strengths Identified</h3>
                    <ul className="space-y-2">
                      {evaluationResult.skill_development.focus_areas.map((strength, i) => (
                        <li key={i} className="flex items-start">
                          <FiCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div> */}

                </div>

                

                <div className="flex justify-center mt-8 space-x-6">
                  <button
                    onClick={() => setActiveTab("activity")}
                    className="px-6 py-3 bg-gray-700 rounded-lg"
                  >
                    Back to Activity
                  </button>
                  <button
                    onClick={() => navigate("/guidance")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold"
                  >
                    Take Another Assessment
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Guidance;