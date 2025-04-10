import { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import ProgressStepper from "../components/guidance/ProgressStepper";
import Assessment from "../components/guidance/Assessment";
import Results from "../components/guidance/Result";
import Activity from "../components/guidance/Activity";
import Evaluation from "../components/guidance/Evaluation";
import Reports from "../components/guidance/Reports";
import Dashboard from "../components/guidance/DashBoard";
import Sidebar from "../components/SideBar";

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assessmentId] = useState(uuidv4());
  const [currentCategory, setCurrentCategory] = useState('personality');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingActivities, setIsGeneratingActivities] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const calculateProgress = () => {
    const categories = Object.keys(questions);
    if (categories.length === 0) return 0;
    const currentCatIndex = categories.indexOf(currentCategory);
    const progressPerCategory = 100 / categories.length;
    const categoryProgress = currentCatIndex * progressPerCategory;
    const questionProgress = ((currentQuestionIndex + 1) / questions[currentCategory].length) * progressPerCategory;
    return Math.min(100, categoryProgress + questionProgress);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/my");
        setSavedReports(res.data);
      } catch (error) {
        setReportsError(error.response?.data?.error || "Failed to load reports");
        if (error.response?.status === 401) {
          console.log("Please login to view reports");
        }
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, [activeTab, isSaving]);

  const handleStartAssessment = () => {
    setActiveTab("assessment");
    setLevel("");
    setQuestions({ personality: [], orientation: [], interest: [] });
    setAnswers({});
    setResult(null);
    setSelectedCareer(null);
    setActivities([]);
    setUserResponse("");
    setEvaluationResult(null);
  };

  const navigateToReport = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  const handleStartQuiz = async () => {
    if (!level) return alert("Please select a grade!");
    setIsGeneratingQuestions(true);
    const requestData = {
      level,
      categories: ["personality", "orientation", "interest", "aptitude"],
      questions_per_category: 20
    };
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate_psychometric_assessment", requestData);
      setQuestions(res.data.questions_by_category);
      setCurrentCategory(Object.keys(res.data.questions_by_category)[0]);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setResult(null);
      setSelectedCareer(null);
      setActivities([]);
      setUserResponse("");
      setEvaluationResult(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnswerSelect = (category, questionId, selectedOption) => {
    setAnswers(prev => {
      // If selectedOption is null (deselecting), remove the answer
      if (selectedOption === null) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      // Otherwise, update with the new selection
      return {
        ...prev,
        [questionId]: selectedOption[0]
      };
    });
  };

  const handleNextQuestion = () => {
    const categoryQuestions = questions[currentCategory];
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const categories = Object.keys(questions);
      const currentIndex = categories.indexOf(currentCategory);
      if (currentIndex < categories.length - 1) {
        setCurrentCategory(categories[currentIndex + 1]);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      const categories = Object.keys(questions);
      const currentIndex = categories.indexOf(currentCategory);
      if (currentIndex > 0) {
        setCurrentCategory(categories[currentIndex - 1]);
        setCurrentQuestionIndex(questions[categories[currentIndex - 1]].length - 1);
      }
    }
  };

  const handleSubmitQuiz = async () => {
    const totalQuestions = Object.values(questions).flat().length;
    if (Object.keys(answers).length !== totalQuestions) {
      return alert("Please answer all questions!");
    }
    setIsSubmittingAssessment(true);
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
      formattedAnswers[`${category}_responses`] = {};
      questions[category].forEach((q, index) => {
        const questionId = q?.id || `${category}_${index + 1}`;
        if (answers[questionId] !== undefined) {
          formattedAnswers[`${category}_responses`][questionId] = answers[questionId];
        }
      });
    });
    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze_complete_assessment", formattedAnswers);
      setResult(res.data);
      setActiveTab("results");
    } catch (error) {
      console.error("Error analyzing assessment:", error);
      alert("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  const handleGenerateActivity = async () => {
    if (!selectedCareer) return alert("Please select a career!");
    setIsGeneratingActivities(true);
    const requestData = {
      career_path: selectedCareer,
      class_level: level,
      specific_area: result.subject_recommendations.core[0]
    };
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate_activities", requestData);
      setActivities(res.data.activities);
      setActiveTab("activity");
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsGeneratingActivities(false);
    }
  };

  const handleSubmitActivityResponse = async () => {
    if (!userResponse.trim()) return alert("Please enter your response!");
    setIsSubmittingResponse(true);
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
      setActiveTab("evaluation");
    } catch (error) {
      console.error("Error evaluating response:", error);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const saveReport = async () => {
    if (!result) return;

    try {
      setIsSaving(true);

      await api.post("/reports", {
        assessmentId,
        level,
        answers,
        results: result,
        selectedCareer,
        activities,
        evaluationResults: evaluationResult ? [evaluationResult] : []
      });
      const res = await api.get("/reports/my");
      setSavedReports(res.data);

    } catch (error) {
      console.error("Error saving report:", error);
      if (error.response?.status === 401) {
        console.log("Session expired - you'll be redirected to login");
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex">
      <Sidebar
        activePage={activeTab}
        setActivePage={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-7xl w-full mx-auto px-4 py-10">
          {activeTab === "dashboard" ? (
            <Dashboard
              reports={savedReports}
              loading={loadingReports}
              error={reportsError}
              handleStartAssessment={handleStartAssessment}
              navigateToReport={navigateToReport}
              setActiveTab={setActiveTab}
              setSidebarOpen={setSidebarOpen}
            />
          ) : activeTab === "reports" ? (
            <Reports savedReports={savedReports} setActiveTab={setActiveTab} navigate={navigate} />
          ) : (
            <>
              {activeTab !== "dashboard" && (
                <ProgressStepper
                  activeTab={activeTab}
                  result={result}
                  selectedCareer={selectedCareer}
                  evaluationResult={evaluationResult}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "assessment" && (
                <Assessment
                  level={level}
                  setLevel={setLevel}
                  questions={questions}
                  currentCategory={currentCategory}
                  currentQuestionIndex={currentQuestionIndex}
                  answers={answers}
                  isGeneratingQuestions={isGeneratingQuestions}
                  isSubmittingAssessment={isSubmittingAssessment}
                  handleStartQuiz={handleStartQuiz}
                  handleAnswerSelect={handleAnswerSelect}
                  handlePrevQuestion={handlePrevQuestion}
                  handleNextQuestion={handleNextQuestion}
                  handleSubmitQuiz={handleSubmitQuiz}
                  setCurrentCategory={setCurrentCategory}
                  setCurrentQuestionIndex={setCurrentQuestionIndex}
                  calculateProgress={calculateProgress}
                />
              )}

              {activeTab === "results" && result && (
                <Results
                  result={result}
                  selectedCareer={selectedCareer}
                  isSaving={isSaving}
                  isGeneratingActivities={isGeneratingActivities}
                  saveReport={saveReport}
                  handleGenerateActivity={handleGenerateActivity}
                  setSelectedCareer={setSelectedCareer}
                  getCareerMatchScore={getCareerMatchScore}
                />
              )}

              {activeTab === "activity" && activities.length > 0 && (
                <Activity
                  activities={activities}
                  userResponse={userResponse}
                  isSaving={isSaving}
                  isSubmittingResponse={isSubmittingResponse}
                  setActiveTab={setActiveTab}
                  setUserResponse={setUserResponse}
                  handleSubmitActivityResponse={handleSubmitActivityResponse}
                  saveReport={saveReport}
                />
              )}

              {activeTab === "evaluation" && evaluationResult && (
                <Evaluation
                  selectedCareer={selectedCareer}
                  evaluationResult={evaluationResult}
                  isSaving={isSaving}
                  setActiveTab={setActiveTab}
                  saveReport={saveReport}
                  navigate={navigate}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guidance;