import React from "react";
import logo from "../assets/PRALogo.jpg"; 
import "./Home.css"; 

const Home = () => {
  return (
    <main className="home">
      <img id="myLogo" src={logo} alt="PRALogo" />
      <h1>CSREI Group</h1>
      <h4>
        Providing Services in Commercial And Residential Real Estate Investment guidance
      </h4>
    </main>
  );
};

export default Home;