// Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Define errorMessage state

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic email validation
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Password validation (just checking it's not empty here)
    if (password.trim() === '') {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      const actionResult = await dispatch(loginUser({ email, password })).unwrap();
      alert('Login successful!');
      window.location.href = '/'; // Redirect to home or another page after successful login
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while logging in' );
      // console.error('Login error:', error);
    }
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </main>
  );
};

export default Login;
