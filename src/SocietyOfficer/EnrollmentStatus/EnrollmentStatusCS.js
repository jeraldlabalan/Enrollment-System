import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./EnrollmentStatus.module.css"; // Ensure this file exists
import HeaderCS from "../Header/HeaderCS";
import ReceiptPrint from "./ReceiptPrint";

const EnrollmentStatusCS = () => {
  const { user, isLoading: sessionLoading, logout } = useContext(SessionContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("id");
  const [filterType, setFilterType] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!sessionLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/enrollmentstatus", {
          method: "GET",
          credentials: "include", // Include cookies/session
        });
        if (!response.ok) {
          throw new Error("Unauthorized or session expired");
        }
        const data = await response.json();
        console.log("Fetched Students Data:", data);
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error.message);
        // Optionally, redirect to login if session expires
        if (error.message === "Unauthorized or session expired") {
          navigate("/login", { replace: true });
        }
      }
    };

    fetchStudents();
  }, [navigate]);

  const handleLogout = () => {
    logout(); // Clear session and redirect to login
    navigate("/login", { replace: true });
  };

  const filteredAndSortedStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (student.id && student.id.toString().toLowerCase().includes(query)) ||
      (student.last_name && student.last_name.toLowerCase().includes(query)) ||
      (student.first_name && student.first_name.toLowerCase().includes(query));

    const matchesType = filterType ? student.student_type === filterType : true;
    const matchesYear = filterYear ? student.year_level === filterYear : true;
    const matchesProgram = filterProgram
      ? student.program === filterProgram
      : true;

    return matchesSearch && matchesType && matchesYear && matchesProgram;
  });

  const handleFilterProgramChange = (e) => {
    setFilterProgram(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleFilterYearChange = (e) => {
    setFilterYear(e.target.value);
  };

  const handleViewChecklist = (student) => {
    setSelectedStudent(student);
  };

  const handleRejectClick = (student) => {
    setSelectedStudent(student);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleRejectSubmit = () => {
    console.log(
      `Rejected student ${selectedStudent.id} with reason: ${rejectReason}`
    );
    closeRejectModal();
  };

  const handleReceiptPrint = (student) => {
    setSelectedStudent(student);
  };

  const handlePrintClose = () => {
    setSelectedStudent(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <HeaderCS />
      </div>

      <div className={styles.content_holder}>
        <div className={styles.content}>
          <h1 className={styles.title}>Enrollment Status</h1>

          {/* Search */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.input}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thTd}>Student ID</th>
                  <th className={styles.thTd}>Last Name</th>
                  <th className={styles.thTd}>First Name</th>
                  <th className={styles.thTd}>Student Type</th>
                  <th className={styles.thTd}>Year Standing</th>
                  <th className={styles.thTd}>Status</th>
                  <th className={styles.thTd}>Commands</th>
                </tr>
              </thead>
              <tbody>
              {filteredAndSortedStudents.length > 0 ? (
  filteredAndSortedStudents.map((student) => (
    <tr key={student.id}>
      <td className={styles.td}>{student.student_id}</td>
      <td className={styles.td}>{student.last_name}</td>
      <td className={styles.td}>{student.first_name}</td>
      <td className={styles.td}>{student.student_type}</td>
      <td className={styles.td}>{student.year_level}</td>
      <td className={styles.td}>
                      <select>
                        <option>Step 1: Done</option>
                        <option>Step 2: Pending</option>
                      </select>
                    </td>
      <td className={styles.td}>
      <button 
                        className={styles.button}
                      >
                        Mark as Enrolled
                      </button>

                      <button 
                        className={styles.button} onClick={() => handleReceiptPrint(student)}
                      >
                        Print Receipt
                      </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5">No students found.</td>
  </tr>
)}
              </tbody>
            </table>
          </div>
          <div className={styles.filterBar}>

            <div className={styles.sort}>
              <label className={styles.label}>Student Type:</label>
              <select
                className={styles.select}
                value={filterType}
                onChange={handleFilterTypeChange}
              >
                <option value="">All</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="S4">S4</option>
                <option value="S5">S5</option>
                <option value="S6">S6</option>
              </select>
            </div>

            <div className={styles.sort}>
              <label className={styles.label}>Year Standing:</label>
              <select
                className={styles.select}
                value={filterYear}
                onChange={handleFilterYearChange}
              >
                <option value="">All</option>
                <option value="1st year">1st Year</option>
                <option value="2nd year">2nd Year</option>
                <option value="3rd year">3rd Year</option>
                <option value="4th year">4th Year</option>
              </select>
            </div>

            <button className={styles.export_button}>
              Export as Spreadsheet
            </button>
          </div>
        </div>
      </div>
      {/* View Checklist Modal */}
      {showModal && selectedStudent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Student Details</h3>
            <p>
              <strong>Student ID:</strong> {selectedStudent.id}
            </p>
            {/* Add more details */}
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedStudent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>
              Reject Student: {selectedStudent.firstName}{" "}
              {selectedStudent.lastName}
            </h3>
            <textarea
              className={styles.textarea}
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <button className={styles.button} onClick={handleRejectSubmit}>
              Submit
            </button>
            <button className={styles.closeButton} onClick={closeRejectModal}>
              Cancel
            </button>
          </div>
        </div>
        
      )}
       {selectedStudent && (
        <ReceiptPrint student={selectedStudent} onClose={handlePrintClose} />
      )}

    </div>
  );
};

export default EnrollmentStatusCS;
