import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Header from "../Header/Header";
import styles from "./Dashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const {
    user,
    isLoading: sessionLoading,
    setUser,
  } = useContext(SessionContext);
  const navigate = useNavigate();

  // State for enrollment data
  const [enrollmentData, setEnrollmentData] = useState({ cs: 0, it: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const pieData = {
    labels: ["CS", "IT"],
    datasets: [
      {
        label: "Enrollment Distribution",
        data: [50, 50], // Replace with dynamic data if needed
        backgroundColor: ["#640404", "#28a745"],
        borderColor: ["#", "#"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true, // Ensure aspect ratio is maintained
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 10,
          font: {
            size: 20,
          },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value}%`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  };

  // Fetch enrollment data
  const fetchEnrollmentData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/enrolled-count", {
        method: "GET",
        credentials: "include", // Include cookies/session
      });

      if (!response.ok) {
        throw new Error("Failed to fetch enrollment data");
      }

      const data = await response.json();
      setEnrollmentData({ cs: data.enrolledComSci, it: data.enrolledIT });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch protected endpoint to validate session
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

  // Redirect if session is invalid
  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);

  // Fetch data on initial render
  useEffect(() => {
    fetchProtectedEndpoint();
    fetchEnrollmentData();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Header />
      </header>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.dashboardContent}>
        <div className={styles.grid}>
          {/* Card 1: Enrolled Students */}
          <div className={`${styles.card} ${styles.enrolledStudents}`}>
            <h5 className={styles.cardTitle}>Enrolled Students</h5>

            <div className={styles.pieChartContainer}>
              {/* Chart Canvas */}
              <div className={styles.chartCanvas}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            <a href="#view-list" className={styles.viewList}>
              View List
            </a>
          </div>

          {/* Card 2: Regular and Irregular Students + Gender Distribution */}
          <div
            className={`${styles.card} ${styles.regularIrregularGender} ${styles.genderCard}`}
          >
            <p>Regular Student</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarGreen} style={{ width: "75%" }}>
                45
              </div>
              <div className={styles.progressBarRed} style={{ width: "25%" }}>
                15
              </div>
            </div>

            <p>Irregular Student</p>
            <div className={styles.progressBar}>
              <div className={styles.progressBarGreen} style={{ width: "50%" }}>
                45
              </div>
              <div className={styles.progressBarRed} style={{ width: "50%" }}>
                20
              </div>
            </div>

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

          {/* Card 3: Announcement */}
          <div className={`${styles.card} ${styles.announcementCard}`}>
            <h5 className={styles.cardTitle}>Announcement</h5>
            <textarea
              className={styles.announcementBox}
              placeholder="Make an announcement..."
            ></textarea>
            <button className={styles.announcementButton}>Send</button>
          </div>

          {/* Card 4: Total Paid (IT) */}
          <div className={`${styles.card} ${styles.totalPaid}`}>
            <h5 className={styles.cardTitle}>Total Paid (IT)</h5>
            <p className={`${styles.paidValue} ${styles.green}`}>23</p>
          </div>

          {/* Card 5: Total Paid (CS) */}
          <div className={`${styles.card} ${styles.totalPaidCS}`}>
            <h5 className={styles.cardTitle}>Total Paid (CS)</h5>
            <p className={`${styles.paidValue} ${styles.green}`}>23</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
