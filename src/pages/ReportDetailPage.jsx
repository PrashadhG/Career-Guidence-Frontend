import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiDownload, FiPrinter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setReport(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF generation/download
    alert('PDF download functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/guidance')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <div className="flex space-x-4">
            
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiPrinter className="mr-2" /> Download PDF
            </button>
          </div>
        </div>

        {/* Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Career Assessment Report</h1>
            <div className="flex flex-wrap items-center justify-between">
              <p className="text-purple-100">
                Completed on: {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                Grade {report.level}
              </span>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6 space-y-8">
            {/* Selected Career */}
            {report.selectedCareer && (
              <section className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                  Recommended Career Path
                </h2>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <span className="text-blue-600 text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{report.selectedCareer}</h3>
                    <p className="text-gray-600">
                      Based on your assessment results
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Personality Traits */}
            {report.results?.individual_results?.personality?.dominant_traits && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Personality Traits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.results.individual_results.personality.dominant_traits).map(([trait, value]) => (
                    <div key={trait} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium text-gray-800 capitalize">
                        {trait.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-purple-600 capitalize mt-1">
                        {value.replace(/_/g, ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Assessment Results */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Detailed Results
              </h2>
              
              {/* Aptitude Scores */}
              {report.results?.individual_results?.aptitude?.scores && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Aptitude Scores
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(report.results.individual_results.aptitude.scores).map(([aptitude, score]) => (
                      <div key={aptitude}>
                        <div className="flex justify-between mb-1">
                          <span className="capitalize text-gray-700">
                            {aptitude.replace(/_/g, ' ')}
                          </span>
                          <span className="font-medium">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject Recommendations */}
              {report.results?.subject_recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Core Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.results.subject_recommendations.core.map((subject, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Elective Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.results?.subject_recommendations?.elective?.map((subject, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Activities */}
            {report.activities?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Recommended Activities
                </h2>
                <div className="space-y-4">
                  {report.activities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-lg">{activity.title}</h3>
                      <p className="text-gray-600 mt-1">{activity.instructions}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Evaluation Results */}
            {report.evaluationResults?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Activity Evaluation
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  {Object.entries(report.evaluationResults[0]).map(([key, value]) => (
                    <div key={key} className="mb-4 last:mb-0">
                      <h3 className="font-medium capitalize text-gray-700 mb-1">
                        {key.replace(/_/g, ' ')}:
                      </h3>
                      {typeof value === 'object' ? (
                        <div className="ml-4">
                          <p className="text-gray-600">
                            <span className="font-medium">Score:</span> {value.score}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Feedback:</span> {value.feedback}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-600">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportDetailPage;