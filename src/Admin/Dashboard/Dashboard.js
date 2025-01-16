import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { toast, ToastContainer } from "react-toastify";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  // Session context and navigation
  const {
    user,
    isLoading: sessionLoading,
    logout,
  } = useContext(SessionContext);
  const navigate = useNavigate();

  // State variables for enrolled counts, gender and student type counts, etc.
  const [enrolledCount, setEnrolledCount] = useState(null);
  const [enrolledCountComSci, setEnrolledCountComSci] = useState(null);
  const [enrolledCountIT, setEnrolledCountIT] = useState(null);
  const [paidComSci, setPaidComSci] = useState(null);
  const [paidIT, setPaidIT] = useState(null);
  const [announcementText, setAnnouncementText] = useState("");
  const [genderStudentTypeCounts, setGenderStudentTypeCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProtectedEndpoint = async () => {
    try {
      const response = await fetch("http://localhost:5000/protected-endpoint", {
        method: "GET",
        credentials: "include", // Include cookies/session
      });

      if (!response.ok) {
        throw new Error("Unauthorized or session expired");
      }

      const data = await response.json();
      console.log("Protected data:", data);
    } catch (error) {
      console.error("Error fetching protected endpoint:", error.message);
    }
  };

  // Call the function
  fetchProtectedEndpoint();

  useEffect(() => {
    console.log("User state:", user);
    if (!sessionLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);

  // Fetch enrolled counts from the backend
  const fetchEnrolledCounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/enrolled-count");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Update state with fetched data
      setEnrolledCount(data.totalEnrolled);
      setEnrolledCountComSci(data.enrolledComSci);
      setEnrolledCountIT(data.enrolledIT);
      setPaidComSci(data.paidComSci);
      setPaidIT(data.paidIT);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch gender and student type counts from the backend
  const fetchGenderStudentTypeCounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/progressbar");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGenderStudentTypeCounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle announcement submission
  const handleAnnouncementSubmit = async () => {
    if (!announcementText.trim()) {
      toast.warning("Please enter an announcement.");
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

  // Fetch data on initial render
  useEffect(() => {
    fetchEnrolledCounts();
    fetchGenderStudentTypeCounts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading spinner while validating session
  }

  // Gender and student type counts calculations
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
  const maleRegularPercentage =
    totalMaleRegularIrregular > 0
      ? (maleRegular / totalMaleRegularIrregular) * 100
      : 0;
  const maleIrregularPercentage =
    totalMaleRegularIrregular > 0
      ? (maleIrregular / totalMaleRegularIrregular) * 100
      : 0;
  const femaleRegularPercentage =
    totalFemaleRegularIrregular > 0
      ? (femaleRegular / totalFemaleRegularIrregular) * 100
      : 0;
  const femaleIrregularPercentage =
    totalFemaleRegularIrregular > 0
      ? (femaleIrregular / totalFemaleRegularIrregular) * 100
      : 0;

  const maleComSciPercentage =
    totalMaleComSciIT > 0 ? (maleComSci / totalMaleComSciIT) * 100 : 0;
  const maleITPercentage =
    totalMaleComSciIT > 0 ? (maleIT / totalMaleComSciIT) * 100 : 0;
  const femaleComSciPercentage =
    totalFemaleComSciIT > 0 ? (femaleComSci / totalFemaleComSciIT) * 100 : 0;
  const femaleITPercentage =
    totalFemaleComSciIT > 0 ? (femaleIT / totalFemaleComSciIT) * 100 : 0;

  return (
    <div className={styles.container}>
      <DashboardHeader />

      <div className={styles.title}>
      <h1>
        Dashboard
      </h1>

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
                  <span>Total Enrolled</span>{" "}
                  <strong>{enrolledCount ?? "N/A"}</strong>
                </p>
                <p>
                  <span>Total Enrolled Computer Science</span>{" "}
                  <strong>{enrolledCountComSci ?? "N/A"}</strong>
                </p>
                <p>
                  <span>Total Enrolled Information Technology</span>{" "}
                  <strong>{enrolledCountIT ?? "N/A"}</strong>
                </p>
              </>
            )}

            <a href="#" className={styles.viewList}>
              View List
            </a>
          </div>

          {/* Card 2: Regular and Irregular Students + Gender Distribution */}
          <div
            className={`${styles.card} ${styles.regularIrregularGender} ${styles.genderCard}`}
          >
            
            <div>
            <p>Regular Student</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressBarGreen}
                style={{ width: `${maleRegularPercentage}%` }}
              >
                {maleRegular}
              </div>
              <div
                className={styles.progressBarRed}
                style={{ width: `${femaleRegularPercentage}%` }}
              >
                {femaleRegular}
              </div>
            </div>
            </div>

            <div>
            <p>Irregular Student</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarGreen} style={{ width: "50%" }}>
                45
              </div>
              <div className={styles.progressBarRed} style={{ width: "50%" }}>
                20
              </div>
            </div>
            </div>

            <div>
            <strong>
              <h5 className={styles.cardTitle}>Gender</h5>
            </strong>
            <p>Information Technology</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarBlue} style={{ width: "57%" }}>
                20
              </div>
              <div className={styles.progressBarPink} style={{ width: "43%" }}>
                15
              </div>
            </div>
            </div>
            
            <div>
            <p>Computer Science</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarBlue} style={{ width: "50%" }}>
                20
              </div>
              <div className={styles.progressBarPink} style={{ width: "50%" }}>
                20
              </div>
            </div>
            </div>

          </div>

          {/* Card 3: Announcement */}
          <div className={`${styles.card} ${styles.announcementCard}`}>
            <h5 className={styles.cardTitle}>Announcement</h5>
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

          {/* Card 4: Total Paid */}
          <div className={styles.total_paid}>
            <div className={`${styles.card} ${styles.totalPaid}`}>
              <h5 className={styles.cardTitle}>Total Paid (IT)</h5>
              <p className={`${styles.paidValue} ${styles.green}`}>
                {paidIT ?? "0"}
              </p>
            </div>
            
            <div className={`${styles.card} ${styles.totalPaidCS}`}>
              <h5 className={styles.cardTitle}>Total Paid (CS)</h5>
              <p className={`${styles.paidValue} ${styles.green}`}>
                {paidComSci ?? "0"}
              </p>
            </div>
          </div>
        </div>

      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Dashboard;
