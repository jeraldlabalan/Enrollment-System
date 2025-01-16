
import styles from "./SubmissionAndSubject.module.css";
import Header from "../Header/Header";
import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../contexts/SessionContext";

const SubmissionAndSubject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, validateSession, sessionLoading } = useContext(SessionContext);
  const [step, setStep] = useState(1);
  const [subjectRows, setSubjectRows] = useState([
    { id: 1, subject: "", units: "" },
  ]);
  const userId = location.state?.userId;
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Validate session on component mount
  useEffect(() => {
      console.log("User state:", user);
      if (!sessionLoading && !user) {
        navigate("/login", { replace: true });
      }
    }, [sessionLoading, user, navigate]);
    
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...subjectRows];
    newRows[index][name] = value;
    setSubjectRows(newRows);
  };

  const addSubjectRow = () => {
    if (subjectRows.length >= 12) {
      alert("You can only add up to 12 subjects.");
      return;
    }

    setSubjectRows([
      ...subjectRows,
      { id: Date.now(), subject: "", units: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = subjectRows.filter((_, rowIndex) => rowIndex !== index);
    setSubjectRows(newRows);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Header />
      </header>

      <h1 className={styles.title}>Subjects and Submission</h1>

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
                    placeholder=""
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Year Level</label>
                  <input
                    type="text"
                    id="yearlvl"
                    name="studentId"
                    placeholder=""
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Program</label>
                  <input
                    type="text"
                    id="program"
                    name="program"
                    placeholder=""
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.next_button}>
                <button
                  type="button"
                  className={styles.submitbtn}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step2_container}>
            <div className={styles.step2_header}>
              <h1>Select subjects</h1>
              <p>
                Minimum of 15 units. Please note that the selected subjects will
                be subjected to advising. It will change depending on schedule
                discrepancies and prerequisite subject conflicts.
              </p>
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
                            <input
                              type="text"
                              name="units"
                              placeholder="3.00"
                              className={styles.num_units}
                              value={row.units}
                              onChange={(e) => handleInputChange(index, e)}
                            />
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
            <div className={styles.navigate_buttons}>
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
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step3_container}>
            <div className={styles.upload_file_section}>
              <div className={styles.upload_checklist}>
                <p className={styles.upload_description}>
                  Submit a signed copy of the curriculum checklist.
                </p>
                <label className={styles.upload_button}>
                <i class="fa-solid fa-plus"></i>
                  Upload File
                  <input
                    type="file"
                    className={styles.hidden_input}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </label>
              </div>

              <div className={styles.upload_cor}>
                <p className={styles.upload_description}>
                  Submit the last semester's certificate of registration.
                </p>
                <label className={styles.upload_button}>
                <i class="fa-solid fa-plus"></i>
                  Upload File
                  <input
                    type="file"
                    className={styles.hidden_input}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </label>
              </div>
            </div>

            <div className={styles.schedule_section}>
              <div className={styles.select_advising_date}>
                <p>Select an advising date</p>
                <select id="sched" name="sched" className={styles.sched}>
                  <option value="">Select Date</option>
                  <option value="2024-12-01">2024-12-01</option>
                  <option value="2024-12-02">2024-12-02</option>
                  <option value="2024-12-03">2024-12-03</option>
                </select>
              </div>
            </div>

            <div className={styles.button_container_section}>
              <button
                type="button"
                className={styles.back_button}
                onClick={handleBack}
              >
                Back
              </button>
              <button type="button" className={styles.submit_button}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmissionAndSubject;
