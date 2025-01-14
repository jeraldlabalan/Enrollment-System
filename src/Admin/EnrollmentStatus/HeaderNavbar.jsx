import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify"; // Ensure toast notifications are set up

const HeaderNavbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Include cookies/session
      });

      if (response.ok) {
        toast.success("Logout successful!");
        navigate("/login", { replace: true }); // Redirect to login and replace history
      } else {
        const result = await response.json();
        throw new Error(result.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
      toast.error(error.message || "Failed to connect to server.");
    }
  };

  const handleLogout = () => {
    logout(); // Call the logout function
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#333" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="src/assets/images/bscs.png" // Updated path for public folder
            alt="Logo1"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <img
            src="src/assets/images/itlogo.png" // Updated path for public folder
            alt="Logo2"
            style={{ height: "40px" }}
          />
        </Box>
        <Box>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Schedules</Button>
          <Button color="inherit">Enrollment</Button>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNavbar;