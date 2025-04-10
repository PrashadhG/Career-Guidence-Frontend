import React from 'react';
import {
  ClipboardList,
  LogOut,
  LayoutDashboard,
  X,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedEmail');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to handle page change and close sidebar if assessment is selected
  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === 'assessment') {
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
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
              width="40" height="60" viewBox="0 0 254.000000 280.000000"
              preserveAspectRatio="xMidYMid meet">

              <g transform="translate(0.000000,280.000000) scale(0.100000,-0.100000)"
                fill="#FFFFFF" stroke="none">

                <path d="M1100 2781 c-150 -48 -268 -149 -335 -283 -33 -68 -39 -90 -45 -175
             -8 -132 8 -224 54 -308 61 -109 171 -205 278 -243 l48 -17 0 -200 0 -200
             -372 3 c-205 2 -388 0 -406 -3 -23 -4 -75 -42 -167 -121 -126 -109 -145
             -129 -145 -158 0 -19 246 -239 283 -253 23 -9 140 -12 407 -12 206 0 381 -1
             388 -1 9 0 12 -88 12 -405 l0 -405 155 0 155 0 0 210 0 209 268 3 268 3 94 84
             c146 129 160 142 177 167 14 21 13 26 -6 53 -12 16 -40 44 -64 62 -40 32 -157
             130 -185 157 -10 9 -81 12 -283 12 l-269 0 0 124 0 125 414 3 414 3 34 24
             c58 43 248 225 248 238 0 14 -118 129 -214 207 l-69 56 -418 0 c-231 0 -419 3
             -419 8 0 4 22 15 49 25 112 40 224 140 285 256 46 89 65 214 48 322 -33 203
             -196 382 -397 435 -72 20 -218 17 -285 -5z 
             m249 -86 c301 -71 437 -412 267 -668 -70 -106 -150 -158 -278 -183 -83 -16
             -93 -16 -175 0 -106 21 -171 54 -228 118 -111 124 -148 264 -110 413 43 162
             164 281 328 321 71 17 120 16 196 -1z 
             m952 -1133 c48 -42 87 -82 86 -89 -1 -7 -42 -46 -92 -87 l-90 -75 -201 -1
             c-110 0 -289 -3 -396 -7 l-196 -6 -4 169 c-3 93 -4 171 -2 174 1 3 183 4 405
             2 l402 -3 88 -77z 
             m-1211 -431 c0 -70 3 -148 6 -173 l6 -45 -383 -5 -384 -5 -40 37 c-22 20 -66
             58 -98 85 -32 26 -56 52 -55 57 2 5 46 47 98 93 l95 84 378 1 377 0 0 -129z 
             m918 -354 l98 -82 -98 -88 -97 -87 -251 0 -250 0 0 73 c0 39 -3 116 -7 170
             l-6 97 257 0 257 0 97 -83z"/>

                <path d="M1128 2463 c-60 -69 -108 -134 -108 -144 0 -25 44 -52 70 -44 11 3
             40 31 65 62 l45 55 0 -209 c0 -221 2 -233 46 -233 50 0 54 15 54 238 l1 207
             21 -30 c37 -50 85 -95 102 -95 20 0 56 35 56 54 0 13 -52 79 -168 214 -25 28
             -52 52 -61 52 -9 0 -64 -57 -123 -127z"/>

              </g>
            </svg>

            {sidebarOpen && (
              <span className="ml-2 text-xl font-semibold text-white ">Career Pathfinder</span>
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
            className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-2 transition-colors ${activePage === 'dashboard'
              ? 'bg-white/10 text-white'
              : 'text-gray-300 hover:bg-white/5'
              }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => handlePageChange('assessment')}
            className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-2 transition-colors ${activePage === 'assessment'
              ? 'bg-white/10 text-white'
              : 'text-gray-300 hover:bg-white/5'
              }`}
          >
            <ClipboardList className="h-5 w-5" />
            {sidebarOpen && <span>Assessment</span>}
          </button>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
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