import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./CORPrint.module.css";

const CORPrint = ({ student, onClose }) => {
  console.log("Student object:", student);
  function formatDateToWords(dateString) {
    const date = new Date(dateString); // Convert string to Date object
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  useEffect(() => {
    window.print(); // Trigger print dialog
    if (onClose) onClose(); // Close the modal after printing
  }, [onClose]);

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
            <strong>Student Number:</strong> {student.student_id}
            <span className={styles.floatRight}>
              <strong>Semester:</strong> 1st Semester
            </span>
          </p>
          <p>
            <strong>Student Name:</strong> {`${student.last_name}, ${student.first_name} ${student.middle_name} ${student.suffix}`}
            <span className={styles.floatRight}>
              <strong>Academic Year:</strong> 2023-2024
            </span>
          </p>
          <p>
            <strong>Program:</strong> {student.program_name}
            <span className={styles.floatRight}>
              <strong>Encoder:</strong> via DCS Enrollment System
            </span>
          </p>
          <p>
            <strong>Address:</strong>{" "}
             {`${student.house_number} ${student.street}, ${student.barangay}, ${student.city}`}
          </p>
        </div>

        {/* Certification Section */}
        <p className={styles.certification}>
          This certificate is to certify that {`${student.last_name}, ${student.first_name} ${student.middle_name} ${student.suffix}`} is a bona fide student of Cavite State
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
            <strong>Registration Status/ Student Category:</strong> {student.student_type}
          </p>
          <p>
            <strong>Date of Birth:</strong> {student.date_of_birth ? formatDateToWords(student.date_of_birth) : "N/A"}
          </p>
          <p>
            <strong>Contact Number:</strong> {student.phone_number || "N/A"}
          </p>
          <p>
            <strong>Email Address:</strong> {student.email || "N/A"}
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
