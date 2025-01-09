import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Enrollees.module.css"; // Ensure this file exists
import { SessionContext } from "../../contexts/SessionContext";
import DashboardHeader from "../Dashboard/DashboardHeader";

const Enrollees = () => {
  const { user, isLoading: sessionLoading, logout } = useContext(SessionContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]); // Add this line

  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [sortCriteria, setSortCriteria] = useState("id"); // Default sorting criteria
  const [filterType, setFilterType] = useState(""); // For student type filter
  const [filterYear, setFilterYear] = useState(""); // For year standing filter
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filterProgram, setFilterProgram] = useState(""); // For program filter

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login");
    }
  }, [sessionLoading, user, navigate]);

  const handleLogout = () => {
    logout(navigate); // Log out and redirect to login
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/enrollees", {
          credentials: "include", // Include cookies
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched Students:", data); // Log the response
        setStudents(data); // Set the state with fetched data
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once

  const filteredAndSortedStudents = students
  .filter((student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      student.student_id.toString().toLowerCase().includes(query) || // Convert to string
      student.last_name.toLowerCase().includes(query) ||
      student.first_name.toLowerCase().includes(query);

    const matchesType = filterType ? student.student_type === filterType : true;
    const matchesYear = filterYear ? student.year_level === filterYear : true;
    const matchesProgram = filterProgram ? student.program_name === filterProgram : true;

    return matchesSearch && matchesType && matchesYear && matchesProgram;
  })
  .sort((a, b) => {
    if (sortCriteria === "id") {
      return a.student_id - b.student_id; // Numeric comparison
    } else if (sortCriteria === "lastName") {
      return a.last_name.localeCompare(b.last_name);
    } else if (sortCriteria === "firstName") {
      return a.first_name.localeCompare(b.first_name);
    }
    return 0;
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
    setShowModal(true);
  };

  const handleRejectClick = (student) => {
    setSelectedStudent(student);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason(""); // Clear textarea when modal closes
  };

  const handleRejectSubmit = () => {
    console.log(
      `Rejected student ${selectedStudent.id} with reason: ${rejectReason}`
    );
    closeRejectModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DashboardHeader />
      </div>

      <div className={styles.content_holder}>
        <div className={styles.content}>
          <h1 className={styles.title}>Enrollees</h1>

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
                  <th className={styles.thTd}>Program</th>
                  <th className={styles.thTd}>Student Type</th>
                  <th className={styles.thTd}>Year Standing</th>
                  <th className={styles.thTd}>Commands</th>
                </tr>
              </thead>
              <tbody>
                
              {filteredAndSortedStudents.length === 0 ? (
    <tr>
      <td colSpan="7">No students found</td>
    </tr>
  ) : (
    filteredAndSortedStudents.map((student) => (
      <tr key={student.student_id}>
        <td className={styles.td}>{student.student_id}</td>
        <td className={styles.td}>{student.last_name}</td>
        <td className={styles.td}>{student.first_name}</td>
        <td className={styles.td}>{student.program_name}</td>
        <td className={styles.td}>{student.student_type}</td>
        <td className={styles.td}>{student.year_level}</td>
                    <td className={styles.td}>
                      <button
                        className={styles.button}
                        onClick={() => handleViewChecklist(student)}
                      >
                        Edit Credentials
                      </button>
                      <button className={styles.button}>
                        Pre-Enrollment Form
                      </button>
                      <button
                        className={styles.button}
                        onClick={() => handleRejectClick(student)}
                      >
                        Mark as Enrolled  
                      </button>
                      <button className={styles.button}>Delete</button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <div className={styles.filterBar}>
            <div className={styles.sort}>
              <label className={styles.label}>Program:</label>
              <select
                className={styles.select}
                value={filterProgram}
                onChange={handleFilterProgramChange}
              >
                <option value="">All</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">
                  Information Technology
                </option>
              </select>
            </div>

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
    </div>
  );
};

export default Enrollees;
