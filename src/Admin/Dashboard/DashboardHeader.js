import React, { useContext } from "react"; // Import useContext
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from '../../contexts/SessionContext';

import styles from "./Dashboard.module.css"; // Import custom styles

const DashboardHeader = () => {
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
    <div className={styles.header}>
      <div className={styles.logos}>
        <Link to="/">
          <img
            src="./images/CSlogo.png"
            alt="BSCS Logo"
            className={styles.logo_shield}
          />
        </Link>
        <Link to="/">
          <img
            src="./images/ITlogo.png"
            alt="BSIT Logo"
            className={styles.logo_its}
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>
        <Link to="/enrollees" className={styles.navLink}>
          Enrollees
        </Link>
        <Link to="/students" className={styles.navLink}>
          <a className={styles.navLink}>Students</a>
        </Link>

        <Link to="/enrollmentteam">
          <a className={styles.navLink}>Enrollment Team</a>
        </Link>
        <a
          className={styles.navLink}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Log Out
        </a>
        <a className={styles.navLink}>
          <i className="fa-solid fa-bell"></i>
        </a>
      </nav>
    </div>
  );
};

export default DashboardHeader;
