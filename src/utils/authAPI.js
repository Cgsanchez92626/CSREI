// utils/authAPI.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Check if environment variable is correctly loaded
// console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Login failed");
  }

  const data = await response.json();
  console.log("API Response:", data); // Log the response data to check its structure
  return data;

};
