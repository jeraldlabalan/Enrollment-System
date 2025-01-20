import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./Home.module.css";
import Header from "../Header/Header";
import default_profile from "../../assets/default-profile-photo.jpg"

const Home = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoading: sessionLoading,
    logout,
  } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  
    useEffect(() => {
      fetch('http://localhost:5000/latest-announcement')
        .then(response => response.json())
        .then(data => {
          console.log('Fetched Announcement:', data); // Log for debugging
          setLatestAnnouncement(data);
        })
        .catch(error => console.error('Error fetching the latest announcement:', error));
    }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/${user.user_id}`,
          {
            credentials: "include",
          }
        );

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
      <div className={styles.page_title}>
        <h1>Home</h1>
      </div>
      <main className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <img src={default_profile} alt="profile picture">
            </img>
          </div>

          <div className={styles.info_container}>
            <strong className={styles.infoName}>Name</strong>
            <p className={`${styles.info} ${styles.marginBelow}`}>
              {userData.last_name}, {userData.first_name} {userData.middle_name}
            </p>
            <strong className={styles.infoName}>Student Number</strong>
            <p className={`${styles.info} ${styles.marginBelow}`}>{userData.student_id}</p>
            <strong className={styles.info}>Program</strong>
            <p className={`${styles.info} ${styles.marginBelow}`}>{userData.program_name}</p>
            <strong className={styles.info}>Year Level</strong>
            <p className={`${styles.info} ${styles.marginBelow}`}>{userData.year_level}</p>
            <Link to="/profile" target="_blank">
              <button className={styles.view_button}>View Details</button>
            </Link>
          </div>
        </div>

        <div className={styles.content_right}>
          <div className={styles.statusCard}>

            <div className={styles.statusGroup}>
              <h3 className={styles.boldHeader}>Enrollment Status</h3>
              <h1 className={styles.enrollmentStatus}>{userData.status}</h1>
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
              <div className={styles.announcement_item}>
                <h4>{latestAnnouncement.author || 'Unknown Author'}</h4>
                <p className={styles.announcementContent}>
                {latestAnnouncement.content}
                </p>
              </div>
            </div>
            <div className={styles.viewAllButtonContainer}>
              <Link to="/announcements">
                <a className={styles.viewAllButton}>View All</a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
