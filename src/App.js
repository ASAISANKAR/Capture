import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import CameraCapture from "./components/CameraCapture"; 
import EmptyPage from "./components/EmptyPage";

export default function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
          <Link to="/" style={navLinkStyle}>Home</Link>
          <Link to="/camera" style={navLinkStyle}>Camera Capture</Link>
          <Link to="/empty" style={navLinkStyle}>People Count</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/camera" element={<CameraCapture />} />
          <Route path="/empty" element={<EmptyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Style for navbar links
const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  margin: "0 15px",
  fontSize: "18px"
};
