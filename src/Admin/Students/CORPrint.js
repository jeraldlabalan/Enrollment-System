import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./CORPrint.module.css";

const CORPrint = ({ student, onClose }) => {
  useEffect(() => {
    const handlePrint = () => {
      window.print(); // Trigger print dialog
      setTimeout(() => {
        if (onClose) onClose(); // Close the modal after printing
      }, 500); // Delay to ensure print dialog has time to open and close
    };

    handlePrint();
  }, [onClose]);;

  return ReactDOM.createPortal(
    <div className={styles.printContainer}>
      <div className={styles.cor}>
        {/* Header Section */}
        <div className={styles.header}>
          <img
            src="./images/cvsu.png" // Replace with the correct logo path
            alt="CVSU Logo"
            className={styles.logo}
          />
          <h1>Republic of the Philippines</h1>
          <h2>CAVITE STATE UNIVERSITY</h2>
          <h3>BACOOR CITY CAMPUS</h3>
          <p>BWIV, Molino IV, City of Bacoor</p>
          <p>(046) 476-5029</p>
          <p>cvsu.bacoor@cvsu.edu.ph</p>
          <h2 className={styles.formTitle}>REGISTRATION FORM</h2>
        </div>

        {/* Student Information Section */}
        <div className={styles.studentInfo}>
          <p>
            <strong>Student Number:</strong> {student?.id || "202211456"}
            <span className={styles.floatRight}>
              <strong>Semester:</strong> 1st Semester
            </span>
          </p>
          <p>
            <strong>Student Name:</strong> {student?.name || "DELA CRUZ, JUAN CRUZ"}
            <span className={styles.floatRight}>
              <strong>Academic Year:</strong> 2023-2024
            </span>
          </p>
          <p>
            <strong>Program:</strong> INFORMATION TECHNOLOGY
            <span className={styles.floatRight}>
              <strong>Encoder:</strong> via DCS Enrollment System
            </span>
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {student?.address || "#12 Yellow St, Makatang Subdivision, Molino II, Bacoor"}
          </p>
        </div>

        {/* Certification Section */}
        <p className={styles.certification}>
          This certificate is to certify that ____ is a bona fide student of Cavite State
          University - Bacoor City Campus, academic year ____ - ____ semester. Note that
          this certificate is not valid without dry seal or stamp.
        </p>

        {/* Course Table Section */}
        <table className={styles.courseTable}>
          <thead>
            <tr>
              <th>Class Code</th>
              <th>LEC</th>
              <th>LAB</th>
              <th>Course Title</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PSY50</td>
              <td>2</td>
              <td>1</td>
              <td>Philosophy in Amnesia</td>
            </tr>
            <tr>
              <td colSpan="4" className={styles.total}>
                TOTAL: 20
              </td>
            </tr>
          </tbody>
        </table>
        <p className={styles.nothingFollows}>*** NOTHING FOLLOWS ***</p>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <p>
            <strong>Registration Status/ Student Category:</strong> Regular
          </p>
          <p>
            <strong>Date of Birth:</strong> June 12, 2003
          </p>
          <p>
            <strong>Contact Number:</strong> 09178129083
          </p>
          <p>
            <strong>Email Address:</strong> juanbldg@gmail.com
          </p>
          <p>
            <strong>Student's Signature:</strong> _______________
          </p>
        </footer>
      </div>
    </div>,
    document.getElementById("print-root")
  );
};

export default CORPrint;
