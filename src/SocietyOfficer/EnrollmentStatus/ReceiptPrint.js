import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Receipt.module.css";

const ReceiptPrint = ({ student, onClose }) => {
    useEffect(() => {
      window.print(); // Trigger print dialog
      if (onClose) onClose(); // Close the modal after printing
    }, [onClose]);

  return ReactDOM.createPortal(
    <div className={styles.printContainer}>
      <div className={styles.receipt}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.logos}>
            <img
              src="./images/CSlogo.png" // Replace with your first logo path
              alt="Logo 1"
              className={styles.logo}
            />
            <img
              src="./images/ITlogo.png" // Replace with your second logo path
              alt="Logo 2"
              className={styles.logo}
            />
          </div>
          <h2>CAVITE STATE UNIVERSITY</h2>
          <h3>BACOOR CITY CAMPUS</h3>
          <p>Department of Computer Studies</p>
          <h2 className={styles.formTitle}>SOCIETY FEE RECEIPT</h2>
        </div>

        {/* Receipt Details */}
        <div className={styles.details}>
          <p>
            <strong>Student Number:</strong> {student?.student_id || "202211456"}
          </p>
          <p>
            <strong>Student Name:</strong> {student?.name || "DELA CRUZ, JUAN CRUZ"}
          </p>
          <p>
            <strong>Program:</strong> {student?.program || "INFORMATION TECHNOLOGY"}
          </p>
          <p>
            <strong>Amount Paid:</strong> {student?.amount || "100.00 PESOS ONLY"}
          </p>
          <p>
            <strong>Academic Year:</strong> {student?.year || "2023-2024"}
          </p>
          <p>
            <strong>Semester:</strong> {student?.semester || "1st Semester"}
          </p>
          <p>
            <strong>Received by:</strong> {student?.receiver || "Claire Ferrer"}
          </p>
          <p>
            <strong>Signature:</strong> ______________________
          </p>
        </div>
      </div>
    </div>,
    document.getElementById("print-root")
  );
};

export default ReceiptPrint;
