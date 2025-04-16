import { motion } from "framer-motion";
import { FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import CustomModal from "../CustomModel";
import api from "../../utils/api";
import { Loader2 } from "lucide-react";
import useDocumentTitle from '../title';


const Reports = ({
  savedReports,
  setSavedReports,
  setActiveTab,
  navigate,
  isLoading,
  error
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useDocumentTitle('Reports');

  const handleDeleteClick = (report, e) => {
    e.stopPropagation();
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(`/reports/${reportToDelete._id}`);

      if (response.status === 200) {
        setSavedReports(prevReports =>
          prevReports.filter(r => r._id !== reportToDelete._id)
        );
      } else {
        throw new Error(response.data?.error || 'Failed to delete report');
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm relative min-h-[400px]">
      <h2 className="text-3xl font-bold mb-6">📚 My Saved Reports</h2>

      <CustomModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Report"
        message={`Are you sure you want to delete the report for "${reportToDelete?.selectedCareer || 'Career Assessment'}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />

      {error ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl">
          <div className="h-16 w-16 text-red-400 mx-auto mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-white mb-2">Error Loading Reports</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="grid place-items-center h-64">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      ) : savedReports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">You don't have any saved reports yet</p>
          <button
            onClick={() => {
              setActiveTab("assessment");
              navigate('/guidance/assessment');
            }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium cursor-pointer"
          >
            Take New Assessment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedReports.map(report => (
            <motion.div
              key={report._id}
              className="bg-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer relative group flex flex-col h-full"
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/reports/${report._id}`)}
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold pr-6">{report.selectedCareer || "Career Assessment"}</h3>
                  <span className="text-sm bg-gray-600 px-2 py-1 rounded">
                    {report.level}th Grade
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className={`text-sm ${report.evaluationResults?.length ? "text-green-300" : "text-yellow-300"
                  }`}>
                  {report.evaluationResults?.length ? "Completed" : "In Progress"}
                </span>
                <button
                  onClick={(e) => handleDeleteClick(report, e)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Delete report"
                >
                  {isDeleting ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <FiTrash2 className="h-6 w-6" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;