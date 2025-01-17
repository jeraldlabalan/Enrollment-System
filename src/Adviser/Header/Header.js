import React, { useContext, useState } from "react"; // Import useContext
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from '../../contexts/SessionContext';
import styles from "./Header.module.css";


const Header = () => {
   const navigate = useNavigate(); // Hook for navigation


       const [activeDropdown, setActiveDropdown] = useState(null); // Manages active dropdown state
      
          
          const toggleDropdown = (menu) => {
            setActiveDropdown((prev) => (prev === menu ? null : menu));
          };

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
        
        <div 
        className={`${styles.navLink} ${styles.bell_button}`}
        onClick={() => toggleDropdown("notification")}
        >
          <i  className={`fa-solid fa-bell`}></i>
          <div className={styles.notification_mark}>
            10
          </div>
          {activeDropdown === "notification" && (
        <div className={styles.dropdown_menu}>
          <div className={styles.notification}>    
              <div className={styles.notification_subject}>
                <p>
                  Advising Date
                </p>
                <p>
                  10:02AM
                </p>
              </div>
              <div className={styles.notification_message}>
              <p>
              John Doe assigned enrollment date to: September 20
              </p>
              </div>
          </div>
        </div>
      )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
