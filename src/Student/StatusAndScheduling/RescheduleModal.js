
import { ChevronDown } from 'lucide-react';
import styles from './StatusAndScheduling.module.css'
import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const RescheduleModal = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, validateSession, sessionLoading } = useContext(SessionContext);
  const [selectedDate, setSelectedDate] = useState("September 15");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const userId = location.state?.userId;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      console.log("User state:", user);
      if (!sessionLoading && !user) {
        navigate("/login", { replace: true });
      }
    }, [sessionLoading, user, navigate]);
  

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!user) {
      setError("Session expired. Please log in again.");
      return;
    }

    if (!selectedDate || !reason.trim()) {
      toast.warning("Please select a date and provide a reason for rescheduling.");
      return;
    }

    if (selectedDate === "September 15") {
      toast.error("Selected date is full, please choose another date.");
      return;
    }

    setError("");
    toast.success("Reschedule confirmed with date:", selectedDate, "and reason:", reason);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setError("");
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setError("");
  };
  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <h2 className={styles.modal_title}>Reschedule Enrollment Date</h2>
        <div className={styles.modal_form}>
        <hr />
          <div className={styles.form_group}>
            <label>Select an advising date</label>
            <div className={styles.select_wrapper}>
              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.date_select}
              >
                <option value="September 15">September 15</option>
                <option value="September 16">September 16</option>
                <option value="September 17">September 17</option>
              </select>
              <ChevronDown className={styles.select_icon} />
            </div>
          </div>

          <div className={styles.form_group}>
            <label className={styles.reason}>Reason for Rescheduling Date</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.reason_textarea}
              rows={4}
            />
          </div>
          {/* {error && <span className={styles.error_message}>{error}</span>} */}
          <div className={styles.modal_actions}>
            <button className={`${styles.modal_button} ${styles.confirm}`} onClick={handleConfirm}>
              Confirm
            </button>
            <button className={`${styles.modal_button} ${styles.cancel}`} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default RescheduleModal;