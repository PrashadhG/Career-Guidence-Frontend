import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../utils/api";
import { FiArrowLeft, FiDownload, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useDocumentTitle from '../components/title';
import html2canvas from 'html2canvas-pro';
import { PDFDocument } from 'pdf-lib';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  useDocumentTitle('Report Details');

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
        setError(err.response?.data?.message || 'Failed to load user name');
        setUserName('');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserName();
    } else {
      setError('Authentication required');
    }
  }, []);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    try {
      setIsLoading(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff'
      });

      const pdfDoc = await PDFDocument.create();

      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const margin = 40;
      const contentWidth = pdfWidth - 2 * margin;
      const contentHeight = pdfHeight - 2 * margin;
      const scale = contentWidth / canvas.width;
      const pageHeightInCanvas = contentHeight / scale;

      let startY = 0;

      while (startY < canvas.height) {
        const remainingHeight = canvas.height - startY;
        let sliceHeight = Math.min(pageHeightInCanvas, remainingHeight);
        const safeY = findSafeSplit(canvas, startY + sliceHeight, 40);
        sliceHeight = safeY - startY;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(
          canvas,
          0,
          startY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        const sliceImgData = pageCanvas.toDataURL('image/png');
        const pngImage = await pdfDoc.embedPng(sliceImgData);
        const imageHeight = sliceHeight * scale;

        const page = pdfDoc.addPage([pdfWidth, pdfHeight]);
        page.drawImage(pngImage, {
          x: margin,
          y: pdfHeight - margin - imageHeight,
          width: contentWidth,
          height: imageHeight,
        });

        startY = safeY;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `career_pulse_ai_${userName || 'user'}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const findSafeSplit = (canvas, proposedY, searchRange = 40) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const maxNonEmpty = Math.floor(width * 0.05);
    let bestY = proposedY;

    for (let y = proposedY; y > proposedY - searchRange && y > 0; y--) {
      const rowData = ctx.getImageData(0, y, width, 1).data;
      let countNonEmpty = 0;
      for (let x = 0; x < width; x++) {
        const alpha = rowData[x * 4 + 3];
        if (alpha > 20) {
          countNonEmpty++;
          if (countNonEmpty > maxNonEmpty) break;
        }
      }
      if (countNonEmpty <= maxNonEmpty) {
        bestY = y;
        break;
      }
    }
    return bestY;
  };

  const handlePrint = () => window.print(); 

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
            <motion.button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <FiDownload className="mr-2" /> Download PDF
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Report Card */}
        <motion.div
          ref={reportRef}
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
                  {Object.entries(report.results.individual_results.personality.dominant_traits).map(
                    ([trait, value]) => (
                      <div key={trait} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-gray-800 capitalize">
                          {trait.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-purple-600 capitalize mt-1">
                          {value.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Detailed Results */}
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
                    {Object.entries(report.results.individual_results.aptitude.scores).map(
                      ([aptitude, score]) => (
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
                      )
                    )}
                  </div>
                </div>
              )}
              
              {/* Subject Recommendations */}
              {report.results?.subject_recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Core Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {report.results.subject_recommendations.core.map((subject, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Elective Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {report.results?.subject_recommendations?.elective?.map(
                        (subject, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Recommended Activities */}
            {report.activities?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Recommended Activities
                </h2>
                <div className="space-y-4">
                  {report.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <h3 className="font-semibold text-lg">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {activity.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activity Evaluation */}
            {report.evaluationResults?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Activity Evaluation
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  {Object.entries(report.evaluationResults[0]).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="mb-4 last:mb-0"
                      >
                        <h3 className="font-medium capitalize text-gray-700 mb-1">
                          {key.replace(/_/g, ' ')}
                        </h3>
                        {typeof value === 'object' ? (
                          <div className="ml-4">
                            <p className="text-gray-600">
                              <span className="font-medium">
                                Score:
                              </span>{' '}
                              {value.score}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">
                                Feedback:
                              </span>{' '}
                              {value.feedback}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-600">{value}</p>
                        )}
                      </div>
                    )
                  )}
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
