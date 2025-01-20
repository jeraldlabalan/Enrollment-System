import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import RescheduleModal from "./RescheduleModal";
import styles from "./StatusAndScheduling.module.css";
import Header from "../Header/Header";
import check_icon from "../../assets/check.png";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function StatusAndScheduling() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
    const {
      user,
      isLoading: sessionLoading,
      logout,
    } = useContext(SessionContext);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

  return (
    <main className={styles.content}>
      <div>
        <Header />
      </div>

      <div className={styles.page_title}>
        <h1>Status and Scheduling</h1>
      </div>

      <div className={styles.main_content}>
        
        <div className={styles.status_container}>

        <h2 className={styles.section_title}>Enrollment Status</h2>
          <ul>
            <li>
              <div
                className={`${styles.progress} ${styles.one} ${styles.active}`}
              >
                <p>1</p>
                <img src={check_icon} alt="check" />
              </div>
              <label>Submission of Necessary Credentials</label>
            </li>

            <li>
              <div
                className={`${styles.progress} ${styles.two}  ${styles.active} `}
              >
                <p>2</p>
                <img src={check_icon} alt="check" />
              </div>
              <label>
                Advising and Face-to-Face Submission of Requirements
              </label>
            </li>

            <li>
              <div className={`${styles.progress} ${styles.three}`}>
                <p>3</p>
                <img src={check_icon} alt="check" />
              </div>
              <label>Scheduled for Enrollment</label>
            </li>

            <li>
              <div className={`${styles.progress} ${styles.four} `}>
                <p>4</p>
                <img src={check_icon} alt="check" />
              </div>
              <label>Face-to-Face Enrollment</label>
            </li>

            <li>
              <div id="first" className={`${styles.progress} ${styles.five}`}>
                <p>5</p>
                <img src={check_icon} alt="check" />
              </div>
              <label>Officially Enrolled</label>
            </li>
          </ul>
        </div>

      </div>

      <section className={styles.status_section}>
        <h2 className={styles.section_title}>Enrollment Date</h2>

        <div className={styles.enrollment_date_container}>


          <div className={styles.enrollment_date_content}>
              <h3 className={styles.enrollment_date}>{userData?.Advising_date || "N/A"}</h3>
              <button
                className={styles.appeal_button}
                onClick={() => setIsModalOpen(true)}
              >
                Appeal for Reschedule
              </button>
          </div>

          <div className={styles.feedback_header}>
            <h4>Rescheduling Feedback</h4>
            <span>
              <p className={styles.feedback_name}>Princess Mae Binalagbag</p>
              <p className={styles.not_schedule_pending}>Pending</p>
            </span>
          </div>

        </div>

      </section>

      <RescheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
       <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </main>
  );
}

export default StatusAndScheduling;
