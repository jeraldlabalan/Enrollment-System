import React, { createContext, useState, useEffect } from "react";

// Create the context
export const SessionContext = createContext();

// Session Provider Component
export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store session user
  const [isLoading, setIsLoading] = useState(true); // Loading state for session check

  // Function to check the session on page load
  const fetchSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/check-session", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Set the user from the session
      } else {
        setUser(null); // No valid session
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setUser(null);
    } finally {
      setIsLoading(false); // Stop loading after the request
    }
  };

  // Run fetchSession on component mount
  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};
