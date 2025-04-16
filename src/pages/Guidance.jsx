import { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";
import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProgressStepper from "../components/guidance/ProgressStepper";
import Assessment from "../components/guidance/Assessment";
import Results from "../components/guidance/Result";
import Activity from "../components/guidance/Activity";
import Evaluation from "../components/guidance/Evaluation";
import Reports from "../components/guidance/Reports";
import Dashboard from "../components/guidance/DashBoard";
import Sidebar from "../components/SideBar";
import CustomModal from "../components/CustomModel";

const Guidance = ({ defaultTab = "dashboard" }) => {
  const token = localStorage.getItem("token");
  const [level, setLevel] = useState("");
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState({
    personality: [],
    orientation: [],
    interest: [],
    aptitude: []
  });
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userResponse, setUserResponse] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
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
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    const tabFromPath = pathname.split('/').pop();
    return ['dashboard', 'assessment', 'reports'].includes(tabFromPath) 
      ? tabFromPath 
      : defaultTab;
  });
  
  //pathname is used to determine the active tab when the component mounts
  // This is to ensure that the active tab is set correctly when the component mounts
  // and to handle the case when the user navigates directly to a specific tab
  useEffect(() => {
    const tabFromPath = pathname.split('/').pop();
    if (tabFromPath !== activeTab && ['dashboard', 'assessment', 'reports'].includes(activeTab)) {
      navigate(`/guidance/${activeTab}`);
    }
  }, [activeTab, pathname, navigate]);
  
  // Calculate progress based on current category and question index
  // This is to update the progress bar in the assessment section
  // and to ensure that the progress is calculated correctly when navigating between categories
  const calculateProgress = () => {
    const categories = Object.keys(questions);
    if (categories.length === 0) return 0;
    const currentCatIndex = categories.indexOf(currentCategory);
    const progressPerCategory = 100 / categories.length;
    const categoryProgress = currentCatIndex * progressPerCategory;
    const questionProgress = ((currentQuestionIndex + 1) / questions[currentCategory].length) * progressPerCategory;
    return Math.min(100, categoryProgress + questionProgress);
  };

  // Fetch saved reports when the active tab is 'reports' or 'dashboard'
  // This is to ensure that the reports are loaded when the user navigates to these tabs
  // and to handle the case when the user is not authenticated
  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      setReportsError(null);
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

    if (activeTab === "reports" || activeTab === "dashboard") {
      fetchReports();
    }
  }, [activeTab, isSaving]);
  
  //fetch user name from API
  // This is to display the user's name in the dashboard and reports sections
  // and to ensure that the user is authenticated before accessing these sections
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await api.get('/users/me');
        const name = typeof response.data === 'string'
          ? response.data
          : response.data.user?.name || response.data.name || '';

        setUserName(name);
      } catch (err) {
        console.error('Failed to fetch user name:', err);
        setUserName('');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserName();
    }
  }, []);

  // Set active tab based on URL path or saved state
  // This is to ensure that the active tab is set correctly when the component mounts
  // and to handle the case when the user navigates directly to a specific tab
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/reports')) {
      setActiveTab('reports');
      return;
    }

    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }

    const savedAssessment = localStorage.getItem('currentAssessment');
    if (savedAssessment) {
      try {
        const data = JSON.parse(savedAssessment);
        const token = localStorage.getItem('token');
        
        if (token && data.activeTab !== 'dashboard' && data.activeTab !== 'reports') {
          setLevel(data.level);
          setQuestions(data.questions);
          setAnswers(data.answers);
          if (data.result) setResult(data.result);
          if (data.selectedCareer) setSelectedCareer(data.selectedCareer);
          if (data.activities) setActivities(data.activities);
          if (data.userResponse) setUserResponse(data.userResponse);
          if (data.evaluationResult) setEvaluationResult(data.evaluationResult);
          setCurrentCategory(data.currentCategory);
          setCurrentQuestionIndex(data.currentQuestionIndex);
          setActiveTab(data.activeTab);
        }
      } catch (error) {
        console.error("Error parsing saved assessment:", error);
        localStorage.removeItem('currentAssessment');
      }
    }
  }, []);
  
  // Save active tab and assessment state to local storage
  // This is to persist the state across page reloads 
  // and to ensure that the assessment state is saved when navigating away from the assessment tab
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
    
    const token = localStorage.getItem('token');
    if (token && activeTab !== 'dashboard' && activeTab !== 'reports') {
      const assessmentState = {
        level,
        questions,
        answers,
        result,
        selectedCareer,
        activities,
        userResponse,
        evaluationResult,
        currentCategory,
        currentQuestionIndex,
        activeTab,
        timestamp: Date.now()
      };
      localStorage.setItem('currentAssessment', JSON.stringify(assessmentState));
    }
  }, [
    activeTab,
    level,
    questions,
    answers,
    result,
    selectedCareer,
    activities,
    userResponse,
    evaluationResult,
    currentCategory,
    currentQuestionIndex
  ]);
  
  // Clear assessment state when navigating to dashboard or reports
  // This is to ensure that the assessment state is cleared when navigating away from the assessment tab
  // and to handle the case when the user navigates directly to these tabs
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'reports') {
      localStorage.removeItem('currentAssessment');
    }
  }, [activeTab]);
  
  // Handle starting a new assessment
  const handleStartAssessment = () => {
    localStorage.removeItem('currentAssessment');
    setActiveTab("assessment");
    setLevel("");
    setQuestions({ personality: [], orientation: [], interest: [], aptitude: [] });
    setAnswers({});
    setResult(null);
    setSelectedCareer(null);
    setActivities([]);
    setUserResponse("");
    setEvaluationResult(null);
    navigate('/guidance/assessment');
  };

  // Reset assessment state
  const resetAssessmentState = () => {
    localStorage.removeItem('currentAssessment');
    setLevel("");
    setQuestions({ personality: [], orientation: [], interest: [], aptitude: [] });
    setAnswers({});
    setResult(null);
    setSelectedCareer(null);
    setActivities([]);
    setUserResponse("");
    setEvaluationResult(null);
    setCurrentCategory('personality');
    setCurrentQuestionIndex(0);
  };

  // Navigate to a specific report
  const navigateToReport = (reportId) => {
    navigate(`/reports/${reportId}`);
    setActiveTab('reports');
  };

  // Handle starting the quiz
  // This is to fetch the questions from the API and set the initial state for the assessment
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

  // Handle selecting an answer for a question
  // This is to update the answers state when the user selects an answer for a question
  const handleAnswerSelect = (category, questionId, selectedOption) => {
    setAnswers(prev => {
      if (selectedOption === null) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
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

  // Handle going to the previous question
  // This is to update the current question index when the user navigates to the previous question
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

  // Handle submitting the assessment
  // This is to format the answers and send them to the API for analysis
  const submitAssessment = async () => {
    setIsSubmittingAssessment(true);
    setShowUnansweredModal(false);

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

  // Handle submitting the quiz
  // This is to check if all questions are answered before submitting the assessment
  const handleSubmitQuiz = async () => {
    const totalQuestions = Object.values(questions).flat().length;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      setShowUnansweredModal(true);
      return;
    }

    await submitAssessment();
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
  
  // Handle submitting the activity response
  // This is to send the user's response to the API for evaluation
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

  // Handle saving the report
  // This is to send the assessment results and user data to the API for saving
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

  // Handle navigating to a specific tab
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex">
      <Sidebar
        activePage={activeTab}
        setActivePage={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
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
              userName={userName}
            />
          ) : activeTab === "reports" ? (
            <Reports
              savedReports={savedReports}
              setSavedReports={setSavedReports}
              setActiveTab={setActiveTab}
              navigate={navigate}
              isLoading={loadingReports}
              error={reportsError}
            />
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
                  resetAssessmentState={resetAssessmentState}
                />
              )}
            </>
          )}
        </div>
      </div>

      <CustomModal
        isOpen={showUnansweredModal}
        onClose={() => setShowUnansweredModal(false)}
        onConfirm={submitAssessment}
        title="Unanswered Questions"
        message={`You have unanswered questions. Are you sure you want to submit the test without completing all questions?`}
        confirmText="Submit Anyway"
        cancelText="Continue Test"
      />
    </div>
  );
};

export default Guidance;