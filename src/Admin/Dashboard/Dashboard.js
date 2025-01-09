import React, { useState, useEffect, useContext } from "react";
import {useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user, isLoading: sessionLoading, logout } = useContext(SessionContext);
  const navigate = useNavigate();
 
  const [enrolledCount, setEnrolledCount] = useState(null);
  const [enrolledCountComSci, setEnrolledCountComSci] = useState(null); // Track enrolled Computer Science count
  const [enrolledCountIT, setEnrolledCountIT] = useState(null); // Track enrolled Information Technology count
  const [paidComSci, setpaidComSci] = useState(null); // Track enrolled Computer Science count
  const [paidIT, setpaidIT] = useState(null); // Track enrolled Information Technology count
  const [announcementText, setAnnouncementText] = useState('');

  const [course, setCourse] = useState(''); // Track selected course
  const [loading, setLoading] = useState(false); // Loading state for fetchEnrolledCount
  const [error, setError] = useState(null); // Error state for fetchEnrolledCount

  const [isLoading, setIsLoading] = useState(true);

  const data = [
    {
      category: "Regular Student",
      green: { value: 45, percentage: 75 },
      red: { value: 15, percentage: 25 },
    },
    {
      category: "Irregular Student",
      green: { value: 45, percentage: 50 },
      red: { value: 20, percentage: 50 },
    },
    {
      category: "Information Technology",
      blue: { value: 20, percentage: 57 },
      pink: { value: 15, percentage: 43 },
    },
    {
      category: "Computer Science",
      blue: { value: 20, percentage: 50 },
      pink: { value: 20, percentage: 50 },
    },
  ];

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login");
    }
  }, [sessionLoading, user, navigate]);

  const handleLogout = () => {
    logout(navigate); // Log out and redirect to login
  };

  const fetchEnrolledCounts = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:5000/enrolled-count');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Update state with fetched data
      setEnrolledCount(data.totalEnrolled);
      setEnrolledCountComSci(data.enrolledComSci);
      setEnrolledCountIT(data.enrolledIT);
      setpaidComSci(data.paidComSci);
      setpaidIT(data.paidIT);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnnouncementSubmit = async () => {

    if (!announcementText.trim()) {
      alert("Please enter an announcement.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookies
        body: JSON.stringify({ content: announcementText }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post announcement.");
      }
  
      const result = await response.json();
      alert(result.message);
      setAnnouncementText(""); // Clear the textarea
    } catch (error) {
      console.error("Failed to post announcement:", error);
      alert(error.message);
    }
  };
  // Fetch total enrolled count on initial render
  useEffect(() => {
    fetchEnrolledCounts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading spinner while validating session
  }

  return (
    <div className={styles.container}>
    <DashboardHeader />
    <div className={styles.dashboardHeader}>
    <h1>Dashboard</h1>
  </div>
  <div className={styles.dashboardContent}>
    <div className={styles.grid}>
          {/* Card 1: Enrolled Students */}
          <div className={`${styles.card} ${styles.enrolledStudents}`}>
  <h5 className={styles.cardTitle}>Enrolled Students</h5>

  {isLoading ? (
    <p>Loading...</p> // Show loading state
  ) : error ? (
    <p>Error: {error}</p> // Show error state
  ) : (
    <>
      <p>
        <span>Total Enrolled</span>{' '}
        <strong>{enrolledCount ?? 'N/A'}</strong>
      </p>
      <p>
        <span>Total Enrolled Computer Science</span>{' '}
        <strong>{enrolledCountComSci ?? 'N/A'}</strong>
      </p>
      <p>
        <span>Total Enrolled Information Technology</span>{' '}
        <strong>{enrolledCountIT ?? 'N/A'}</strong>
      </p>
    </>
  )}

  <a href="#" className={styles.viewList}>View List</a>
</div>

          {/* Card 2: Regular and Irregular Students + Gender Distribution */}
          <div className={`${styles.card} ${styles.regularIrregularGender} ${styles.genderCard}`}>
          <p>Regular Student</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarGreen} style={{ width: "75%" }}>45</div>
              <div className={styles.progressBarRed} style={{ width: "25%" }}>15</div>
            </div>

            <p>Irregular Student</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarGreen} style={{ width: "50%" }}>45</div>
              <div className={styles.progressBarRed} style={{ width: "50%" }}>20</div>
            </div>

            <strong><h5 className={styles.cardTitle}>Gender</h5></strong>
            <p>Information Technology</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarBlue} style={{ width: "57%" }}>20</div>
              <div className={styles.progressBarPink} style={{ width: "43%" }}>15</div>
            </div>
            <p>Computer Science</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarBlue} style={{ width: "50%" }}>20</div>
              <div className={styles.progressBarPink} style={{ width: "50%" }}>20</div>
            </div>
          </div>

          {/* Card 3: Announcement */}
          <div className={`${styles.card} ${styles.announcementCard}`}>
            <h5 className={styles.cardTitle} >Announcement</h5>
            <textarea
              className={styles.announcementBox}
              placeholder="Make an announcement..."
              value={announcementText} // Bind the state to the textarea
              onChange={(e) => setAnnouncementText(e.target.value)} // Update state on input
            ></textarea>
           <button
            className={styles.announcementButton}
            onClick={handleAnnouncementSubmit} // Attach the function to the button
          >
            Send
          </button>
          </div>

          {/* Card 4: Total Paid (IT) */}
          <div className={`${styles.card} ${styles.totalPaid}`}>
            <h5 className={styles.cardTitle}>Total Paid (IT)</h5>
            <p className={`${styles.paidValue} ${styles.green}`}>{paidIT ?? '0'}</p>
          </div>

          {/* Card 5: Total Paid (CS) */}
          <div className={`${styles.card} ${styles.totalPaidCS}`}>
            <h5 className={styles.cardTitle}>Total Paid (CS)</h5>
            <p className={`${styles.paidValue} ${styles.green}`}>{paidComSci ?? '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
