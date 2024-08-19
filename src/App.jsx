import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Listings from "./components/Listings";
import "./index.css"; // Import the global CSS file
import AboutMe from "./components/AboutMe";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/listings" element={<Listings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
