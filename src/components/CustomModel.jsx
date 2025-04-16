import { motion } from "framer-motion";

const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Removed the bg-black bg-opacity-50 from the backdrop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="whitespace-pre-line mb-6 text-gray-300">{message}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomModal;