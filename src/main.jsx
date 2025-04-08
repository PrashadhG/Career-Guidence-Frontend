import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Guidance from "./pages/Guidance"; // We'll create this next
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportDetailPage from './pages/ReportDetailPage';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/guidance" element={<Guidance />} />
        <Route path="/reports/:id" element={<ReportDetailPage />} />
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
