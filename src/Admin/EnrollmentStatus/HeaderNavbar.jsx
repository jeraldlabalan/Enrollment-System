import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { SessionContext } from './context/SessionContext'; // Import SessionContext
import { toast } from "react-toastify"; // Ensure toast notifications are set up

const HeaderNavbar = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { setUser } = useContext(SessionContext); // Access setUser from context

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        // Clear user session context
        setUser(null); // Update session context to null (logged out)
        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
            Lf
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderNavbar;