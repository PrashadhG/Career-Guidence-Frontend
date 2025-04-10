import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Guidance from "./pages/Guidance";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportDetailPage from './pages/ReportDetailPage';
import ProtectedRoute from './components/protected';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);