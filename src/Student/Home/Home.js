import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./Home.module.css";
import Header from "../Header/Header";

const Home = () => {
  const navigate = useNavigate();
  const { user, isLoading: sessionLoading, logout } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${user.user_id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data.");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!sessionLoading && user) {
      fetchUserData();
    } else if (!sessionLoading && !user) {
      navigate("/login", { replace: true }); // Redirect to login if no session
    }
  }, [sessionLoading, user, navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included
      });

      if (response.ok) {
        logout(); // Clear session context
        navigate("/login", { replace: true }); // Redirect to login page
      } else {
        throw new Error("Failed to log out.");
      }
    } catch (err) {
      console.error("Logout error:", err.message);
      alert("Error logging out. Please try again.");
    }
  };

  if (isLoading || sessionLoading) {
    return <div>Loading...</div>; // Show loading spinner
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  if (!userData) {
    return <div>Error loading user data. Please try again.</div>; // Fallback if no user data
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <Header />
      </header>
      <h1 className={styles.title}>Home</h1>
      <main className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}></div>
          <strong className={styles.infoName}>Name</strong>
          <p className={`${styles.info} ${styles.marginBelow}`}>
            {userData.last_name}, {userData.first_name} {userData.middle_name}
          </p>
          <strong className={styles.infoName}>Student Number</strong>
          <p className={`${styles.info} ${styles.marginBelow}`}>N/A</p>
          <strong className={styles.info}>Program</strong>
          <p className={`${styles.info} ${styles.marginBelow}`}>N/A</p>
          <strong className={styles.info}>Year Level</strong>
          <p className={`${styles.info} ${styles.marginBelow}`}>N/A</p>
          <Link to="/profile" target="_blank">
          <button className={styles.view_button}>View Details</button>
          </Link>
        </div>

        <div className={styles.content_right}>
          <div className={styles.statusCard}>
            <div className={styles.statusGroup}>
              <h3 className={styles.boldHeader}>Enrollment Status</h3>
              <h1 className={styles.enrollmentStatus}>Not Enrolled</h1>
              <p className={styles.statusInfo}>No Enrollment Schedule Date</p>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.printButton}>Print COR</button>
              <button className={styles.printButton}>Print COE</button>
            </div>
          </div>

          <div className={styles.announcementCard}>
            <h3 className={styles.announcementTitle}>Announcements</h3>
            <div className={styles.announcementContainer}>
              <h4>Society President</h4>
              <p className={styles.announcementContent}>
                Sa mga students na late mag-enroll... Paano kayo maggrow niyan,
                hindi kayo naghihiwalay.
              </p>
              <div className={styles.viewAllButtonContainer}>
                <button className={styles.viewAllButton}>VIEW ALL</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
