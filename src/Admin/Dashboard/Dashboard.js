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
  const [genderStudentTypeCounts, setGenderStudentTypeCounts] = useState({});

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
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);


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

  const fetchGenderStudentTypeCounts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/progressbar");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGenderStudentTypeCounts(data); // Set the fetched gender and student type counts
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch total enrolled count on initial render
  useEffect(() => {
    
    fetchEnrolledCounts();
  }, []);

  
  if (isLoading) {
    return <div>Loading...</div>; // Show loading spinner while validating session
  }

  const maleRegular = genderStudentTypeCounts.male?.regular || 0;
  const maleIrregular = genderStudentTypeCounts.male?.irregular || 0;
  const femaleRegular = genderStudentTypeCounts.female?.regular || 0;
  const femaleIrregular = genderStudentTypeCounts.female?.irregular || 0;

  const maleComSci = genderStudentTypeCounts.male?.comsci || 0;
  const maleIT = genderStudentTypeCounts.male?.it || 0;
  const femaleComSci = genderStudentTypeCounts.female?.comsci || 0;
  const femaleIT = genderStudentTypeCounts.female?.it || 0;

  // Calculate total male and female for regular/irregular
  const totalMaleRegularIrregular = maleRegular + maleIrregular;
  const totalFemaleRegularIrregular = femaleRegular + femaleIrregular;

  // Calculate total male and female for ComSci/IT
  const totalMaleComSciIT = maleComSci + maleIT;
  const totalFemaleComSciIT = femaleComSci + femaleIT;

  // Calculate percentages for each category
  const maleRegularPercentage = totalMaleRegularIrregular > 0 ? (maleRegular / totalMaleRegularIrregular) * 100 : 0;
  const maleIrregularPercentage = totalMaleRegularIrregular > 0 ? (maleIrregular / totalMaleRegularIrregular) * 100 : 0;
  const femaleRegularPercentage = totalFemaleRegularIrregular > 0 ? (femaleRegular / totalFemaleRegularIrregular) * 100 : 0;
  const femaleIrregularPercentage = totalFemaleRegularIrregular > 0 ? (femaleIrregular / totalFemaleRegularIrregular) * 100 : 0;

  const maleComSciPercentage = totalMaleComSciIT > 0 ? (maleComSci / totalMaleComSciIT) * 100 : 0;
  const maleITPercentage = totalMaleComSciIT > 0 ? (maleIT / totalMaleComSciIT) * 100 : 0;
  const femaleComSciPercentage = totalFemaleComSciIT > 0 ? (femaleComSci / totalFemaleComSciIT) * 100 : 0;
  const femaleITPercentage = totalFemaleComSciIT > 0 ? (femaleIT / totalFemaleComSciIT) * 100 : 0;

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
              <div className={styles.progressBarGreen} style={{ width: `${maleRegularPercentage}%` }}>{maleRegular}</div>
              <div className={styles.progressBarRed} style={{ width: `${femaleRegularPercentage}%` }}>{femaleRegular}</div>
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
