import React, { useContext } from "react"; // Import useContext
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from '../../contexts/SessionContext';
import styles from "./Header.module.css";


const Header = () => {
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
        <Link to="/aDashboard">
          <a className={styles.navLink}>Dashboard</a>
        </Link>
        <Link to="/aSubmission">
          <a className={styles.navLink}>Submissions</a>
        </Link>
        <Link to="/Advisee">
          <a className={styles.navLink}>Advisee</a>
        </Link>
        <Link to="/login">
          
          <a className={styles.navLink} onClick={handleLogout}>Log Out</a>
        </Link>
        <Link to="">
          <a className={styles.navLink}>
            <i class="fa-solid fa-bell"></i>
          </a>
        </Link>
      </nav>
    </div>
  );
}

export default Header;
