import React, { useEffect } from 'react';
import {
  ClipboardList,
  LogOut,
  LayoutDashboard,
  X,
  Menu,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logoWhite.png"

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  // Close sidebar when assessment tab is active
  useEffect(() => {
    if (activePage === 'assessment') {
      setSidebarOpen(false);
    }
  }, [activePage, setSidebarOpen]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('currentAssessment');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/guidance/${page}`);
    
    if (page === 'assessment') {
      setSidebarOpen(false);
    } else if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar Toggle Button (visible when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#364153] text-white hover:bg-[#4a5568] transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Main Sidebar */}
      <aside className={`w-64 bg-[#364153] shadow-lg flex flex-col h-screen fixed transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-64'}`}>
        {/* Logo/Header Section with Close Button */}
        <div className="h-20 flex items-center justify-between border-b border-gray-700 p-4">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />
            {sidebarOpen && (
              <span className="ml-2 text-xl font-semibold text-white ">CareerPulse AI</span>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-600 transition-colors duration-200 cursor-pointer group"
            >
              <X className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-200" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-grow overflow-y-auto">
          <button
            onClick={() => handlePageChange('dashboard')}
            className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-2 transition-colors ${
              activePage === 'dashboard'
                ? 'bg-white/10 text-white'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => handlePageChange('assessment')}
            className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-2 transition-colors ${
              activePage === 'assessment'
                ? 'bg-white/10 text-white'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            {sidebarOpen && <span>Assessment</span>}
          </button>

          {/* Reports Tab */}
          <button
            onClick={() => handlePageChange('reports')}
            className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-2 transition-colors ${
              activePage === 'reports'
                ? 'bg-white/10 text-white'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <FileText className="h-5 w-5" />
            {sidebarOpen && <span>Reports</span>}
          </button>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;