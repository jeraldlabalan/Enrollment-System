import React, { useRef } from "react";
import styles from './Upload.module.css';
import Header from "../Header/Header";

const SubmissionsAndSubjects = () => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      console.log("Uploaded file:", files[0].name);
    }
  };

  const recentFiles = [
    "CC_DELACRUZ (3).pdf",
    "CC_DELACRUZ (2).pdf",
    "CC_DELACRUZ (1).pdf",
    "CC_DELACRUZ.pdf",
  ];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <Header />
      </header>

      <h1 className={styles.title}>Submissions and Subjects</h1>

      {/* Curriculum Checklist */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Curriculum Checklist</h2>
        <div className={styles.sectionContent}>
          <div className={styles.uploadBox} onClick={handleUploadClick}>
            <button className={styles.uploadButton}>+</button>
            <input
              type="file"
              className={styles.hiddenInput}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className={styles.feedback}>
            <strong>Feedback</strong>
            <p>
              <span className={styles.feedbackName}>Princess Mae Binalagbag</span> <br/>
              <span className={styles.feedbackText}>"Labo amputa send mo ulit"</span>
            </p>
          </div>
          <div className={styles.recentFiles}>
            <strong>Recent Uploaded Files</strong>
            <ul>
              {recentFiles.map((file, index) => (
                <li key={index} className={styles.file}>
                  <img src="./images/pdf.png" alt="PDF" className={styles.pdfIcon} />
                  {file}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Certificate of Recognition */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Certificate of Recognition</h2>
        <div className={styles.sectionContent}>
          <div className={styles.uploadBox} onClick={handleUploadClick}>
            <button className={styles.uploadButton}>+</button>
            <input
              type="file"
              className={styles.hiddenInput}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className={styles.feedback}>
            <strong>Feedback</strong>
            <p>
              <span className={styles.feedbackName}>Princess Mae Binalagbag</span> <br />
              <span className={styles.feedbackStatus}>APPROVED</span>
            </p>
          </div>
          <div className={styles.recentFiles}>
            <strong>Recent Uploaded Files</strong>
            <ul>
              {recentFiles.map((file, index) => (
                <li key={index} className={styles.file}>
                  <img src="./images/pdf.png" alt="PDF" className={styles.pdfIcon} />
                  {file}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pre-Enrollment Form */}
      <div className={styles.preEnrollment}>
        <p className={styles.paragraph}>Pre-Enrollment Form</p>
        <div className={styles.formButtons}>
          <button className={styles.formButton}>Print</button>
          <button className={styles.formButton}>Download</button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsAndSubjects;
