// Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import "./Login.css";

const allowedUsers = [
  { email: "CarmenSanchezREI@gmail.com", password: "pw123" },
  { email: "User1@CSREI.com", password: "pw123" },
  { email: "User2@CSREI.com", password: "pw123" },
];

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic email validation
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const user = allowedUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) {
      alert("Access denied. You are not authorized to sign in.");
      return;
    }

    // Password validation (just checking it's not empty here)
    if (password.trim() === "") {
      alert("Please enter your password.");
      return;
    }

    if (user.password !== password) {
      alert("Incorrect password.");
      return;
    }

    // Successful login
    dispatch(login());
    alert("Login successful!");
    // Redirect to home or another page after successful login
    window.location.href = "/";
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <main className="login">
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </main>
  );
};

export default Login;
