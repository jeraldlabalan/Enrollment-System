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
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      });
  
      if (response.ok) {
        console.log("Logout successful");
        setUser(null); // Update user context to null
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  useEffect(() => {
    checkSession(); // Automatically check session on app load
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoading, handleLogout, error }}>
      {children}
    </SessionContext.Provider>
  );
};
