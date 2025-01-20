import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Enrollees.module.css"; // Ensure this file exists
import { SessionContext } from "../../contexts/SessionContext";
import DashboardHeader from "../Dashboard/DashboardHeader";
import default_profile from "../../assets/default-profile-photo.jpg";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/enrollees");
        const data = await response.json();
        console.log("Raw Students Data:", data);
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("Invalid API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  console.log("Students State:", students); // Log React state

  const filteredAndSortedStudents = students
    .filter((student) => {
      if (!student) return false;
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        (student.student_id && student.student_id.toString().includes(query)) ||
        (student.last_name && student.last_name.toLowerCase().includes(query)) ||
        (student.first_name && student.first_name.toLowerCase().includes(query));

      const matchesType = filterType ? student.student_type === filterType : true;
      const matchesYear = filterYear ? student.year_level === filterYear : true;
      const matchesProgram = filterProgram ? student.program_name === filterProgram : true;

      return matchesSearch && matchesType && matchesYear && matchesProgram;
    })
    .sort((a, b) => {
      if (sortCriteria === "id") {
        return a.student_id - b.student_id;
      }
      return a[sortCriteria]?.localeCompare(b[sortCriteria]) || 0;
    });

  const handleEditClick = (student) => {
    setEditedStudent({ ...student }); // Create a copy of the student object
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const programMapping = {
      "computer science": 1,
      "information technology": 2,
    };
  
    const statusMapping = {
      "s1": "Freshman",
      "s2": "Irregular",
      "s3": "Regular",
      "s4": "Transferee",
      "s5": "Shiftee",
    };
  
    const yearMapping = {
      "1st year": "1",
      "2nd year": "2",
      "3rd year": "3",
      "4th year": "4",
    };
  
    const normalizedProgramName = editedStudent.program_name?.trim().toLowerCase() || "";
    const normalizedStudentStatus = editedStudent.student_status?.trim().toLowerCase() || "";
    const normalizedYearLevel = editedStudent.year_level?.trim().toLowerCase() || "";
  
    const programId = programMapping[normalizedProgramName] || null;
    const studentStatus = statusMapping[normalizedStudentStatus] || null;
    const yearLevel = yearMapping[normalizedYearLevel] || null;
  
    if (!programId || !studentStatus || !yearLevel) {
      console.error("Invalid mappings detected:", {
        program: normalizedProgramName,
        status: normalizedStudentStatus,
        year: normalizedYearLevel,
      });
      return alert(`Invalid data mappings:
        Program: ${normalizedProgramName || "None"} 
        Status: ${normalizedStudentStatus || "None"} 
        Year: ${normalizedYearLevel || "None"}`);
    }
  
    const updatedStudent = {
      first_name: editedStudent.first_name,
      last_name: editedStudent.last_name,
      program_id: programId,
      student_status: studentStatus,
      year_level: yearLevel,
    };
  
    try {
      const response = await fetch(`/api/students/${editedStudent.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update student data.");
      }
  
      alert(responseData.message);
  
      const updatedStudents = students.map((student) =>
        student.user_id === editedStudent.user_id ? { ...student, ...updatedStudent } : student
      );
      setStudents(updatedStudents);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating student:", error.message);
      alert("An error occurred while updating the student.");
    }
  };
  
  

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

  const handleEnroll = async (student_id) => {
    console.log('Sending student_id:', student_id); // Debugging

    try {
      const response = await fetch(`http://localhost:5000/students/${student_id}/enroll`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update enrollment status.');
      }

      const result = await response.json();
      alert(result.message);
      window.location.reload();
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    }
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
                  <th className={styles.thTd}>Name</th>
                  <th className={styles.thTd}>Program</th>
                  <th className={styles.thTd}>Student Type</th>
                  <th className={styles.thTd}>Year Standing</th>
                  <th className={styles.thTd}>Commands</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStudents.map((student) => (
                  <tr key={student.student_id}>
                    <td className={styles.td}>{student.student_id}</td>
                    <td className={styles.td}>
                    <div>
                      <img src={default_profile} alt="profile picture" />
                      <p>{student.first_name} {student.last_name}</p>
                    </div>
                    </td>
                    <td className={styles.td}>{student.program_name}</td>
                    <td className={styles.td}>{student.student_type}</td>
                    <td className={styles.td}>{student.year_level}</td>
                    <td className={styles.td}>
                      <button
                        className={styles.button}
                        onClick={() => handleEditClick(student)}
                      >
                        Edit Credentials
                      </button>
                      <button className={styles.button}>
                        Pre-Enrollment Form
                      </button>
                      <button
                        className={styles.button}
                        onClick={() => handleEnroll(student.student_id)}
                      >
                        Mark as Enrolled
                      </button>
                      <button className={styles.button}>Delete</button>
                    </td>
                  </tr>
                ))}
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

      {/* Edit Credential Modal */}
      {showEditModal && editedStudent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Credentials</h3>
            {filteredAndSortedStudents.map((student) => (
              <form key={student.user_id} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="last_name"
                    value={
                      editedStudent?.student_id === student.student_id
                        ? editedStudent.last_name
                        : student.last_name
                    }
                    onChange={
                      editedStudent?.student_id === student.student_id
                        ? handleEditChange
                        : undefined
                    }
                    className={styles.input}
                    disabled={editedStudent?.student_id !== student.student_id} // Disable unless editing
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={
                      editedStudent?.student_id === student.student_id
                        ? editedStudent.first_name
                        : student.first_name
                    }
                    onChange={
                      editedStudent?.student_id === student.student_id
                        ? handleEditChange
                        : undefined
                    }
                    className={styles.input}
                    disabled={editedStudent?.student_id !== student.student_id}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Program:</label>
                  <select
                    name="program_name"
                    value={
                      editedStudent?.student_id === student.student_id
                        ? editedStudent.program_name
                        : student.program_name
                    }
                    onChange={
                      editedStudent?.student_id === student.student_id
                        ? handleEditChange
                        : undefined
                    }
                    className={styles.input}
                    disabled={editedStudent?.student_id !== student.student_id}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Student Type:</label>
                  <select
                    name="student_status"
                    value={
                      editedStudent?.student_id === student.student_id
                        ? editedStudent.student_status
                        : student.student_status
                    }
                    onChange={
                      editedStudent?.student_id === student.student_id
                        ? handleEditChange
                        : undefined
                    }
                    className={styles.input}
                    disabled={editedStudent?.student_id !== student.student_id}
                  >
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                    <option value="S5">S5</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Year Standing:</label>
                  <select
                    name="year_level"
                    value={
                      editedStudent?.student_id === student.student_id
                        ? editedStudent.year_level
                        : student.year_level
                    }
                    onChange={
                      editedStudent?.student_id === student.student_id
                        ? handleEditChange
                        : undefined
                    }
                    className={styles.input}
                    disabled={editedStudent?.student_id !== student.student_id}
                  >
                    <option value="1st year">1st Year</option>
                    <option value="2nd year">2nd Year</option>
                    <option value="3rd year">3rd Year</option>
                    <option value="4th year">4th Year</option>
                  </select>
                </div>

                {editedStudent?.student_id === student.student_id ? (
                  <>
                    <button type="button" onClick={handleEditSubmit} className={styles.submit}>
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditedStudent(null)}
                      className={styles.closeButton}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEditClick(student)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                )}
              </form>
            ))}

          </div>
        </div>
      )}

    </div>
  );
};

export default Enrollees;
