import React from "react";
import Header from "../Header/Header";
import styles from "./Success.module.css";

const SuccessIrregular = () => {
  return (
    <div className={styles.container}>
    {/* Header Section */}
    <header className={styles.header}>
      <Header />
    </header>

    {/* Main Content */}
    
      <h1 className={styles.title}>Submissions and Subjects</h1>
      <div className={styles.successMessage}>
        {/* Animated Checkmark */}
        <div className={styles.checkmark} data-testid="checkmark"></div>
        <h2 className={styles.status}>CREDENTIALS SUBMITTED</h2>
        <p className={styles.description}>
        You may check back for a copy of your pre-enrollment form or errors in file submissions.
        </p>
        <div className={styles.buttons}>
          <button className={styles.button}>Status and Scheduling</button>
          <button className={styles.button}>Go Back</button>
        </div>
      </div>
    
  </div>
);
};

export default SuccessIrregular;
