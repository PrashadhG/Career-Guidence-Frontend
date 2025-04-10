import { FiActivity, FiBookmark, FiLogOut } from "react-icons/fi";

const Navigation = ({ navigate, setActiveTab, handleLogout }) => {
  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button
          onClick={() => navigate("/home")}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer"
        >
          CareerPath finder
        </button>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("assessment")}
            className="flex items-center px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition cursor-pointer"
          >
            <FiActivity className="mr-2" /> Assessment
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className="flex items-center px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition cursor-pointer"
          >
            <FiBookmark className="mr-2" /> My Reports
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 transition cursor-pointer"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;