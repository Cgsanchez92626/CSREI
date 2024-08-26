import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Listings from "./components/Listings";
import "./index.css"; // Import the global CSS file
import AboutMe from "./components/AboutMe";
import CRM from './components/CRM';
import startTokenRefresh from "./utils/tokenManager"; // Import the token manager

function App() {
  useEffect(() => {
    // Start the token refresh process when the app mounts
    startTokenRefresh();
  }, []);
  
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/crm" element={<CRM />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
