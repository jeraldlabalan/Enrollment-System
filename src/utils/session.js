// src/utils/session.js

export const checkSession = async (navigate) => {
  try {
    const response = await fetch("http://localhost:5000/check-session", {
      method: "GET",
      credentials: "include", // Include cookies
    });

    if (response.ok) {
      return true; // Session is valid
    } else {
      navigate("/login"); // Redirect if session is invalid
      return false;
    }
  } catch (error) {
    console.error("Error checking session:", error);
    navigate("/login"); // Redirect on error
    return false;
  }
};
  
  export const logout = async (navigate) => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("Logout successful. Redirecting to login...");
        navigate("/login");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  