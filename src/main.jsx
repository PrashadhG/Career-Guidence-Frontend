import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Guidance from "./pages/Guidance";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportDetailPage from './pages/ReportDetailPage';
import ProtectedRoute from './components/protected';
import PageNotFound from "./pages/PageNotFound";

const ReverseProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    if (token) {
      // Optional: Verify token validity here if needed
      setIsCheckingAuth(false);
    } else {
      setIsCheckingAuth(false);
    }
  }, [token]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return token ? <Navigate to="/guidance" replace /> : children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ReverseProtectedRoute>
            <Home />
          </ReverseProtectedRoute>
        } />

        <Route path="/login" element={
          <ReverseProtectedRoute>
            <Login />
          </ReverseProtectedRoute>
        } />
        <Route path="/register" element={
          <ReverseProtectedRoute>
            <Register />
          </ReverseProtectedRoute>
        } />

        {/* Protected Routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);