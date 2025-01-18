import styles from "./SubmissionAndSubject.module.css";
import Header from "../Header/Header";
import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { toast, ToastContainer } from "react-toastify";
import upload_file from "../../assets/upload-file.png";
import pdfIcon from "../../assets/pdf-icon.png";
import close from "../../assets/close-icon.png";

const SubmissionAndSubject = () => {
  const [AdvisingDate, setAdvisingDate] = useState(""); // State for enrollment date
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, validateSession, sessionLoading } =
    useContext(SessionContext);
  const [step, setStep] = useState(1);
  const [subjectRows, setSubjectRows] = useState([{ subject: "", units: 3 }]); // Example initial state
  const lastRowRef = useRef(null);

  const userId = location.state?.userId;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentFiles, setRecentFiles] = useState({
    curriculumChecklist: [],
    certificateOfRegistration: [],
    transcriptOfRecords: [],
  });
  useEffect(() => {
    console.log("User state:", user);
    if (!sessionLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);

  const handleNext = () => {
    setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...subjectRows];
    newRows[index][name] = value;
    setSubjectRows(newRows);
  };

  const addSubjectRow = () => {
    const totalUnits = subjectRows.reduce(
      (sum, row) => sum + parseFloat(row.units || 0),
      0
    );
    if (totalUnits > 35) {
      toast.error("You can only take up to 35 units.");
      return;
    }

    setSubjectRows([...subjectRows, { subject: "", units: 3 }]); // Add a new row with default units
  };

  const handleRemoveRow = (index) => {
    const newRows = subjectRows.filter((_, rowIndex) => rowIndex !== index);
    setSubjectRows(newRows);
  };

  useEffect(() => {
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [subjectRows]);

  const totalUnits = subjectRows.reduce(
    (sum, row) => sum + parseFloat(row.units || 0),
    0
  ); // Calculate total units

  // Logic for upload file
  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      setRecentFiles((prevFiles) => ({
        ...prevFiles,
        [fileType]: [...prevFiles[fileType], file.name],
      }));
      // Reset the file input value to allow re-uploading the same file
      event.target.value = "";
    }
  };

  // Logic for remove uploaded file
  const handleRemoveFile = (fileType, index) => {
    setRecentFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: prevFiles[fileType].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <header className={styles.header}>
        <Header />
      </header>

      <div className={styles.page_title}>
        <h1>Submission and Subjects</h1>
      </div>

      <div className={styles.content}>
        {step === 1 && (
          <div className={styles.category}>
            <div className={styles.student_info_left}>
              <div className={styles.student_categorization}>
                <h2>Student Categorization</h2>
                <p className={styles.student_category_code}>
                  S1 - Regular students
                </p>
                <p className={styles.student_category_code}>
                  S2 - Incoming First Year Student
                </p>
                <p className={styles.student_category_code}>S3 - Irregulars</p>
                <p className={styles.student_category_code}>S4 - Shiftee</p>
                <p className={styles.student_category_code}>S5 - Returnee</p>
                <p className={styles.student_category_code}>S6 - Transferee</p>
              </div>

              <div className={styles.student_type}>
                <h2>Select Student Type</h2>
                <p className={styles.student_type_label}>
                  You may refer to the categories above.
                </p>

                <div className={styles.student_category}>
                  <div>
                    <input type="radio" id="S1" name="category" value="S1" />
                    <label className={styles.radio_label} htmlFor="S1">
                      <span className={styles.custom_radio}></span>
                      S1
                    </label>
                  </div>

                  <div>
                    <input type="radio" id="S2" name="category" value="S2" />
                    <label className={styles.radio_label} htmlFor="S2">
                      S2
                    </label>
                  </div>
                  <div>
                    <input type="radio" id="S3" name="category" value="S3" />
                    <label className={styles.radio_label} htmlFor="S3">
                      S3
                    </label>
                  </div>
                  <div>
                    <input type="radio" id="S4" name="category" value="S4" />
                    <label className={styles.radio_label} htmlFor="S4">
                      S4
                    </label>
                  </div>
                  <div>
                    <input type="radio" id="S5" name="category" value="S5" />
                    <label className={styles.radio_label} htmlFor="S5">
                      S5
                    </label>
                  </div>
                  <div>
                    <input type="radio" id="S6" name="category" value="S6" />
                    <label className={styles.radio_label} htmlFor="S6">
                      S6
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.student_info_right}>
              <div className={styles.enrollment_data}>
                <div className={styles.field}>
                  <label className={styles.label}>Student ID</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    placeholder="Format: 202511111"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Year Level</label>
                  <select className={styles.input}>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="first year">First Year</option>
                    <option value="second year">Second Year</option>
                    <option value="third year">Third Year</option>
                    <option value="fourth year">Fourth Year</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Program</label>
                  <select className={styles.input}>
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="first year">Computer Science</option>
                    <option value="second year">Information Technology</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step2_container}>
            <div className={styles.step2_header}>
              <h2>Select Subjects</h2>
              <p>
                Minimum of 15 units. Please note that the selected subjects will
                be subjected to advising. It will change depending on schedule
                discrepancies and prerequisite subject conflicts.
              </p>
              <p>Total units: {totalUnits}</p>
            </div>

            <div className={styles.step2_content}>
              <div className={styles.subject_container}>
                <div className={styles.add_subject}>
                  <table className={styles.subject_table}>
                    <thead>
                      <tr>
                        <th>Class Code</th>
                        <th>No. Of Units</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectRows.map((row, index) => (
                        <tr key={row.id}>
                          <td>
                            <select
                              name="subject"
                              value={row.subject}
                              onChange={(e) => handleInputChange(index, e)}
                              className={styles.dropdown}
                            >
                              <option value="" disabled>
                                Select Subject
                              </option>
                              <option value="math101">Math 101</option>
                              <option value="eng102">English 102</option>
                              <option value="cs103">
                                Computer Science 103
                              </option>
                              <option value="bio104">Biology 104</option>
                              <option value="phys105">Physics 105</option>
                            </select>
                          </td>
                          <td>
                            <div
                              className={styles.num_units}
                              value={row.units}
                              onChange={(e) => handleInputChange(index, e)}
                            >
                              <p>3</p>
                            </div>
                          </td>
                          <td>
                            {index === 0 ? (
                              <div className={styles.candunits2}>
                                <button
                                  type="button"
                                  className={styles.add_subject_button}
                                  onClick={addSubjectRow}
                                >
                                  Add Subject
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className={styles.remove_button}
                                onClick={() => handleRemoveRow(index)}
                              >
                                <i className="fa-solid fa-x"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step3_container}>
            <div className={styles.upload_file_section}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Curriculum Curriculum Checklist
                </h2>
                <div className={styles.sectionContent}>
                  <label htmlFor="file" className={styles.uploadBox}>
                    <input
                      type="file"
                      className={styles.hiddenInput}
                      id="file"
                      // accept=".pdf"
                      onChange={(e) =>
                        handleFileChange(e, "curriculumChecklist")
                      }
                    />

                    <img src={upload_file} />
                  </label>

                  <div className={styles.feedback}>
                    <p>FEEDBACK FROM</p>
                    <p>
                      <span>{/* Author */}</span>
                    </p>
                    <p>
                      <span>{/* Actual Feedback */}</span>
                    </p>
                  </div>

                  <div className={styles.recentFiles}>
                    <p className={styles.file_header}>Recently Uploaded File</p>
                    <ul>
                      {recentFiles.curriculumChecklist.map((file, index) => (
                        <li key={index} className={styles.file}>
                          <img
                            src={pdfIcon}
                            alt="PDF"
                            className={styles.pdfIcon}
                          />
                          <p>{file}</p>
                          <img
                            src={close}
                            onClick={() =>
                              handleRemoveFile("curriculumChecklist", index)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Last Issued COR</h2>
                <div className={styles.sectionContent}>
                  <label htmlFor="cor" className={styles.uploadBox}>
                    <input
                      type="file"
                      className={styles.hiddenInput}
                      id="cor"
                      // accept=".pdf"
                      onChange={(e) =>
                        handleFileChange(e, "certificateOfRegistration")
                      }
                    />

                    <img src={upload_file} />
                  </label>

                  <div className={styles.feedback}>
                    <p>FEEDBACK FROM</p>
                    <p>
                      <span>{/* Author */}</span>
                    </p>
                    <p>
                      <span>{/* Actual Feedback */}</span>
                    </p>
                  </div>

                  <div className={styles.recentFiles}>
                    <p className={styles.file_header}>Recently Uploaded File</p>
                    <ul>
                      {recentFiles.certificateOfRegistration.map(
                        (file, index) => (
                          <li key={index} className={styles.file}>
                            <img
                              src={pdfIcon}
                              alt="PDF"
                              className={styles.pdfIcon}
                            />
                            <p>{file}</p>
                            <img
                              src={close}
                              onClick={() =>
                                handleRemoveFile(
                                  "certificateOfRegistration",
                                  index
                                )
                              }
                            />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Transcript of Records</h2>
                <div className={styles.sectionContent}>
                  <label htmlFor="tor" className={styles.uploadBox}>
                    <input
                      type="file"
                      className={styles.hiddenInput}
                      id="tor"
                      // accept=".pdf"
                      onChange={(e) =>
                        handleFileChange(e, "transcriptOfRecords")
                      }
                    />

                    <img src={upload_file} />
                  </label>

                  <div className={styles.feedback}>
                    <p>FEEDBACK FROM</p>
                    <p>
                      <span>{/* Author */}</span>
                    </p>
                    <p>
                      <span>{/* Actual Feedback */}</span>
                    </p>
                  </div>

                  <div className={styles.recentFiles}>
                    <p className={styles.file_header}>
                      {" "}
                      Recently Uploaded File
                    </p>
                    <ul>
                      {recentFiles.transcriptOfRecords.map((file, index) => (
                        <li key={index} className={styles.file}>
                          <img
                            src={pdfIcon}
                            alt="PDF"
                            className={styles.pdfIcon}
                          />
                          <p>{file}</p>
                          <img
                            src={close}
                            onClick={() =>
                              handleRemoveFile("transcriptOfRecords", index)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.schedule_section}>
              <div className={styles.select_advising_date}>
                <h2>Select an Advising Date</h2>
                <input
                  type="date"
                  className={styles.input}
                  value={AdvisingDate}
                  onChange={(e) => setAdvisingDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.navigate_buttons}>
          {step === 1 && (
            <button
              type="button"
              className={`${styles.button} ${styles.next_button}`}
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {step === 2 && (
            <>
              <button
                type="button"
                className={`${styles.button} ${styles.back_button}`}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.next_button}`}
                onClick={handleNext}
              >
                Next
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <button
                type="button"
                className={`${styles.button} ${styles.back_button}`}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.submit_button}`}
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionAndSubject;
