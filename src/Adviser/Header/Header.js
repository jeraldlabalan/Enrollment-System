import React, { useContext, useState, useEffect } from "react"; // Import useContext
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from '../../contexts/SessionContext';
import styles from "./Header.module.css";


const Header = () => {
   const navigate = useNavigate(); // Hook for navigation
   const [activeDropdown, setActiveDropdown] = useState(null); // Manages active dropdown state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
        const toggleMenu = () => {
          setIsMenuOpen(!isMenuOpen);
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

      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 980) {
            setActiveDropdown(null); // Close the dropdown on large screens
          }
        };
      
        window.addEventListener("resize", handleResize);
      
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
    
      const toggleDropdown = (menu) => {
        setActiveDropdown((prev) => (prev === menu ? null : menu));
      };


      return (
        <div className={styles.header}>
          {/* Logos */}
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
    
          {/* Navigation links (desktop/laptop) */}
          <nav className={styles.nav}>
            <Link to="/aDashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/aSubmission" className={styles.navLink}>
              Submissions
            </Link>
            <Link to="/Advisee" className={styles.navLink}>
              Advisee
            </Link>
            <Link to="/login" className={styles.navLink} onClick={handleLogout}
              style={{ cursor: "pointer" }}>
              Log Out
            </Link>
            <div className={styles.notification} onClick={() => toggleDropdown("notification")}>
              <i className="fa-solid fa-bell"></i>
              <div className={styles.notification_mark}>
                10
              </div>
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
    
    
          </nav>
    
          {/* Hamburger menu and Notification bell */}
          <div className={styles.hamburgerContainer}>
    
    
              <div className={styles.notification}  onClick={() => toggleDropdown("notification")}>
                  <i className="fa-solid fa-bell"></i>
                  <div className={styles.notification_mark_mobile}>
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
    
                <button className={styles.hamburger} onClick={toggleMenu}>
                  <i className="fa-solid fa-bars"></i>
                </button>     
          </div>
          {/* Mobile navigation overlay */}
          <div
            className={`${styles.navOverlay} ${
              isMenuOpen ? styles.navOverlayOpen : ""
            }`}
          >
             <Link to="/aDashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/aSubmission" className={styles.navLink}>
              Submissions
            </Link>
            <Link to="/Advisee" className={styles.navLink}>
              Advisee
            </Link>
            <a
          className={styles.navLink}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Log Out
        </a>
          </div>
        </div>
      );
    }
  

export default Header;
