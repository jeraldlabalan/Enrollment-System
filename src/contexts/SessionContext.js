import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the logged-in user data
  const [isLoading, setIsLoading] = useState(true); // Indicates whether session data is being fetched
  const [error, setError] = useState(null); // Stores session-related errors, if any

  // Function to check the session from the backend
  const checkSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/session", {
        credentials: "include", // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Save user data from the session
      } else {
        setUser(null);
        console.error("Session check failed.");
      }
    } catch (err) {
      console.error("Error checking session:", err);
      setError(err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null); // Clear session data on logout
      } else {
        console.error("Logout failed.");
        throw new Error("Failed to log out.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkSession(); // Automatically check session on app load
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoading, logout, error }}>
      {children}
    </SessionContext.Provider>
  );
};
