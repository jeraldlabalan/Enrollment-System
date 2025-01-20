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
  const navigate = useNavigate();
    const {
      user,
      isLoading: sessionLoading,
      logout,
    } = useContext(SessionContext);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [subjectRows, setSubjectRows] = useState([
    { subject: '', units: 3  }, // initial state for each row
    // Add more rows as needed
  ]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const lastRowRef = useRef(null);
  const [formData, setFormData] = useState({
    studentCategory: "",
    studentId: "",
    yearLevel: "",
    program: "",
    selectedSubjects: [],
    uploadedFiles: {
      curriculumChecklist: [],
      certificateOfRegistration: [],
      transcriptOfRecords: [],
    },
    advisingDate: "",
  });

  const [recentFiles, setRecentFiles] = useState({
    curriculumChecklist: [],
    certificateOfRegistration: [],
    transcriptOfRecords: [],
  });
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

    const handleNext = () => {
      if (step === 1) {
        // Validate step 1 data
        if (!formData.studentCategory || !formData.studentId) {
          toast.error("Please fill all required fields.");
          return;
        }
      }
    
      if (step === 2) {
        // Validate step 2 data (e.g., subjects)
        if (formData.selectedSubjects.length < 1) {
          toast.error("Please select at least one subject.");
          return;
        }
      }
    
      setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep));
    };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    

    setSelectedSubjects((prevState) => ({
      ...prevState, // Preserve the existing values
      [name]: value, // Update the field being changed
  }));
  
    // Check if the field belongs to `formData`
    if (formData.hasOwnProperty(name)) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      console.warn(`Unhandled input field: ${name}`);
    }
  };

 const addSubjectRow = () => {
    setSubjectRows((prevRows) => [
      ...prevRows,
      { subject: '', units: 3  } , // Add a new row with an empty subject
    ]);
  };

  const handleSubjectChange = (index, event) => {
  const { value } = event.target;
  
  setSubjectRows((prevRows) => {
    const updatedRows = [...prevRows];
    updatedRows[index] = { ...updatedRows[index], subject: value };

    // Update the selectedSubjects with name and units
    const updatedSelectedSubjects = [...formData.selectedSubjects];
    updatedSelectedSubjects[index] = {
      name: value,  // Set the subject name
      units: 3,  // Assuming the units are 3 for now, you can adjust as needed
    };

    setFormData((prevState) => ({
      ...prevState,
      selectedSubjects: updatedSelectedSubjects,
    }));

    return updatedRows;
  });
};


  const handleRemoveRow = (index) => {
    setSubjectRows((prevRows) => prevRows.filter((_, i) => i !== index));
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
  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setRecentFiles((prevState) => ({
      ...prevState,
      [type]: files,
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      uploadedFiles: {
        ...prevFormData.uploadedFiles,
        [type]: files,
      },
    }));
  };

  const handleDateChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      advisingDate: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered"); // Debugging log
    console.log("Advising Date in handleSubmit:", formData.advisingDate); // Debugging log to check advisingDate value
  
    try {
      console.log("Form Data:", formData); // Log the entire form data

      // Ensure advisingDate is not empty
      if (!formData.advisingDate) {
          console.error("Advising date is required."); // Debugging log
          toast.error("Please select an advising date.");
          return;
      }

      const programMap = {
        "Computer Science": 1,
        "Information Technology": 2,
      };
  
      const programValue = programMap[formData.program];
      console.log("Program Value:", programValue); // Debugging log
  
      // Ensure the program value exists
      if (!programValue) {
        console.error("Invalid program selected."); // Debugging log
        toast.error("Invalid program selected.");
        return;
      }
  
      // 1. Send User Data
      console.log("Sending user data..."); // Debugging log
      const userResponse = await fetch("http://localhost:5000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          studentCategory: formData.studentCategory,
          studentId: formData.studentId,
          yearLevel: formData.yearLevel,
          program: programValue,
        }),
      });
  
      console.log("User response status:", userResponse.status); // Debugging log
      if (!userResponse.ok) throw new Error("Failed to save user data");
  
      // 2. Send Selected Subjects
      console.log("Sending selected subjects..."); // Debugging log
      const subjectsResponse = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          studentId: formData.studentId,
          selectedSubjects: formData.selectedSubjects,
        }),
      });
  
      console.log("Subjects response status:", subjectsResponse.status); // Debugging log
      if (!subjectsResponse.ok) throw new Error("Failed to save selected subjects");
  
        // 3. Send Uploaded Files
        console.log("Form Data:", formData); // Log the entire form data

        // 3. Send Uploaded Files
        const formDataForFiles = new FormData();
        const types = ["curriculumChecklist", "certificateOfRegistration", "transcriptOfRecords"];
        
        types.forEach((type) => {
          if (recentFiles[type] && recentFiles[type].length > 0) {
            recentFiles[type].forEach((file) => {
              formDataForFiles.append(type, file);
            });
          }
        });
    
        formDataForFiles.append("user_id", user.user_id);
    
        const filesResponse = await fetch("http://localhost:5000/api/files", {
          method: "POST",
          body: formDataForFiles,
        });
    
        // Log the raw response to inspect it
        const responseText = await filesResponse.text(); // Read the raw response text
        console.log("Raw response from files API:", responseText); // Log raw response
    
        // Try to parse the response as JSON
        try {
          const filesResponseBody = JSON.parse(responseText);
          console.log("Files response body:", filesResponseBody); // Log the parsed JSON body
        } catch (err) {
          console.error("Error parsing response as JSON:", err);
          // Handle the case where the response is not JSON
          toast.error("Received unexpected response from the server.");
        }
    
        if (!filesResponse.ok) throw new Error("Failed to save files");
    
        // If the files were successfully saved, continue with the advising date update
        console.log("Files successfully uploaded");
  
  
         // 4. Send Advising Date
         console.log("Sending advising date..."); // Debugging log
         const advisingDateResponse = await fetch("http://localhost:5000/api/advisingDate", {
             method: "PUT",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify({
                 user_id: user.user_id,
                 advisingDate: formData.advisingDate,
             }),
         });
 
         console.log("Advising date response status:", advisingDateResponse.status); // Debugging log
         if (!advisingDateResponse.ok) throw new Error("Failed to save advising date");
  
      toast.success("Data successfully submitted!");
      console.log("Data submission successful"); // Debugging log
      navigate("/success");
    } catch (err) {
      console.error("Error during handleSubmit:", err); // Debugging log
      toast.error(err.message || "An error occurred while submitting data.");
    }
  };
  

  // Logic for remove uploaded file
  const handleRemoveFile = (type, index) => {
    setRecentFiles((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((_, i) => i !== index), // Remove file by index
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
                  <input
  type="radio"
  id="S1"
  name="studentCategory"
  value="S1"
  checked={formData.studentCategory === "S1"}
  onChange={handleInputChange}
/>
                    <label className={styles.radio_label} htmlFor="S1">
                      <span className={styles.custom_radio}></span>
                      S1
                    </label>
                  </div>

                  <div>
                  <input
  type="radio"
  id="S2"
  name="studentCategory"
  value="S2"
  checked={formData.studentCategory === "S2"}
  onChange={handleInputChange}
/>
                    <label className={styles.radio_label} htmlFor="S2">
                      S2
                    </label>
                  </div>
                  <div>
                  <input
  type="radio"
  id="S3"
  name="studentCategory"
  value="S3"
  checked={formData.studentCategory === "S3"}
  onChange={handleInputChange}
/>
                    <label className={styles.radio_label} htmlFor="S3">
                      S3
                    </label>
                  </div>
                  <div>
                  <input
  type="radio"
  id="S4"
  name="studentCategory"
  value="S4"
  checked={formData.studentCategory === "S4"}
  onChange={handleInputChange}
/>
                    <label className={styles.radio_label} htmlFor="S4">
                      S4
                    </label>
                  </div>
                  <div>
                  <input
  type="radio"
  id="S5"
  name="studentCategory"
  value="S5"
  checked={formData.studentCategory === "S5"}
  onChange={handleInputChange}
/>
                    <label className={styles.radio_label} htmlFor="S5">
                      S5
                    </label>
                  </div>
                  <div>
                  <input
  type="radio"
  id="S6"
  name="studentCategory"
  value="S6"
  checked={formData.studentCategory === "S6"}
  onChange={handleInputChange}
/>
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
  value={formData.studentId} // Ensure this matches
  onChange={handleInputChange} // This updates `formData`
/>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Year Level</label>
                  <select className={styles.input}
  name="yearLevel"
  value={formData.yearLevel}
  onChange={handleInputChange}
>
  <option value="" disabled>Select</option>
  <option value="first year">First Year</option>
  <option value="second year">Second Year</option>
  <option value="third year">Third Year</option>
  <option value="fourth year">Fourth Year</option>
</select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Program</label>
                  <select
  className={styles.input}
  name="program"
  value={formData.program} // Correct the state field being referenced here
  onChange={handleInputChange}
>
  <option value="" disabled>Select</option>
  <option value="Computer Science">Computer Science</option>
  <option value="Information Technology">Information Technology</option>
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
  <tr key={index}>
    <td>
      <select
        className={styles.dropdown}
        name="selectedSubjects"
        value={row.subject} // This should be initialized to an empty string or a valid value
        onChange={(e) => handleSubjectChange(index, e)} // Ensure the index is passed correctly
      >
        <option value="" disabled>Select Subject</option>
        <option value="MATH101">Math 101</option>
        <option value="ENG102">English 102</option>
        <option value="CS103">Computer Science 103</option>
        <option value="BIO104">Biology 104</option>
        <option value="PHYS105">Physics 105</option>
      </select>
    </td>
    <td>
      <div className={styles.num_units}>3 Units</div>
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
                          <p>{file.name}</p> {/* Use file.name for the file name */}
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
                            <p>{file.name}</p> {/* Use file.name for the file name */}
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
                    {recentFiles.certificateOfRegistration.map(
                        (file, index) => (
                          <li key={index} className={styles.file}>
                            <img
                              src={pdfIcon}
                              alt="PDF"
                              className={styles.pdfIcon}
                            />
                            <p>{file.name}</p> {/* Use file.name for the file name */}
                            <img
                              src={close}
                              onClick={() =>
                                handleRemoveFile(
                                  "transcriptOfRecords",
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
            </div>

            <div className={styles.schedule_section}>
              <div className={styles.select_advising_date}>
                <h2>Select an Advising Date</h2>
                <input
                  type="date"
                  className={styles.input}
                  value={AdvisingDate}
                  onChange={(e) => {
                    handleDateChange(e);
                  }}
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
  type="button"
  className={`${styles.button} ${styles.submit_button}`}
  onClick={handleSubmit} // Call the handleSubmit function
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
