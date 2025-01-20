import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./Submission.module.css";
import Header from "../Header/Header";
import default_profile from "../../assets/default-profile-photo.jpg";
import view_icon from "../../assets/view.jpg";
import reject_icon from "../../assets/reject.png";
import accept_icon from "../../assets/accept.png";

const Advisee = () => {
  const { user, isLoading: sessionLoading } = useContext(SessionContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("id");
  const [filterType, setFilterType] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTo, setRejectTo] = useState("Both");
  const [acceptTo, setAcceptTo] = useState("Both");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCORModal, setShowCORModal] = useState("")

  // Validate session by fetching a protected endpoint
  const fetchProtectedEndpoint = async () => {
    try {
      const response = await fetch("http://localhost:5000/protected-endpoint", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unauthorized or session expired");
      }

      const data = await response.json();
      console.log("Protected data:", data);
    } catch (error) {
      console.error("Error fetching protected endpoint:", error.message);
      navigate("/login", { replace: true });
    }
  };

  // Redirect to login if session is invalid
  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [sessionLoading, user, navigate]);

  // Fetch students from the backend
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/submission", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students data");
      }

      const data = await response.json();
      console.log("Fetched Students Data:", data);
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial render
  useEffect(() => {
    fetchProtectedEndpoint();
    fetchStudents();
  }, []);

  // Filter and sort students based on user input
  const filteredAndSortedStudents = students
    .filter((student) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (student.id && student.id.toString().toLowerCase().includes(query)) ||
        (student.last_name &&
          student.last_name.toLowerCase().includes(query)) ||
        (student.first_name &&
          student.first_name.toLowerCase().includes(query));

      const matchesType = filterType
        ? student.student_type === filterType
        : true;
      const matchesYear = filterYear ? student.year_level === filterYear : true;

      return matchesSearch && matchesType && matchesYear;
    })
    .sort((a, b) => {
      if (sortCriteria === "id") return a.id - b.id;
      if (sortCriteria === "last_name")
        return a.last_name.localeCompare(b.last_name);
      return 0;
    });

  // Handlers for various actions
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSortCriteria(e.target.value);
  const handleFilterTypeChange = (e) => setFilterType(e.target.value);
  const handleFilterYearChange = (e) => setFilterYear(e.target.value);

  const handleViewChecklist = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleViewCOR = (student) => {
    setSelectedStudent(student);
    setSelectedStudent(student);
    setShowCORModal(true);

  }

  const handleRejectClick = (student) => {
    setSelectedStudent(student);
    setShowRejectModal(true);
  };

  const handleAcceptClick = (student) => {
    setSelectedStudent(student);
    setShowAcceptModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setRejectTo("Both");
  };

  const closeAcceptModal = () => {
    setShowAcceptModal(false);
    setAcceptTo("Both");
  };

  const handleRejectSubmit = () => {
    console.log(
      `Rejected student ${selectedStudent.id} to ${rejectTo} with reason: ${rejectReason}`
    );
    closeRejectModal();
  };

  const handleAcceptSubmit = () => {
    console.log(`Accepted student ${selectedStudent.id} to ${acceptTo}`);
    closeAcceptModal();
  };

  if (isLoading || sessionLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Header />
      </header>

      <div className={styles.content_holder}>
        <div className={styles.content}>
          <h1 className={styles.title}>Submissions</h1>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.input}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thTd}>Student ID</th>
                  <th className={styles.thTd}>Name</th>
                  <th className={styles.thTd}>Student Type</th>
                  <th className={styles.thTd}>Year Standing</th>
                  <th className={styles.thTd}>Commands</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStudents.length > 0 ? (
                  filteredAndSortedStudents.map((student) => (
                    <tr key={student.id}>
                      <td className={styles.td}>{student.student_id}</td>
                      <td className={styles.td}>
                      <div>
                      <img src={default_profile} alt="profile picture" />
                      <p>{student.first_name} {student.last_name}</p>
                    </div>
                      </td>
                      <td className={styles.td}>{student.student_type}</td>
                      <td className={styles.td}>{student.year_level}</td>
                      <td className={styles.td}>
                        <button
                          className={styles.button}
                          onClick={() => handleViewChecklist(student)}
                        >
                          <img src={view_icon} alt="view" />
                          <p>View Checklist</p>
                        </button>

                        <button className={styles.button}
                           onClick={() => handleViewCOR(student)}
                        >
                          <img src={view_icon} alt="view" />
                          <p>View COR</p>
                        </button>
                        <button
                          className={styles.button}
                          onClick={() => handleRejectClick(student)}
                        >
                          <img src={reject_icon} alt="view" />
                          <p>Reject</p>
                        </button>
                        <button
                          className={styles.button}
                          onClick={() => handleAcceptClick(student)} // Trigger accept modal
                        >
                          <img src={accept_icon} alt="view" />
                          <p>Accept</p>
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
        </div>

        <div className={styles.filterBar}>
          <div className={styles.sort}>
            <label className={styles.label}>Sort by:</label>
            <select
              className={styles.select}
              value={sortCriteria}
              onChange={handleSortChange}
            >
              <option value="id">Student ID</option>
              <option value="lastName">Last Name</option>
              <option value="firstName">First Name</option>
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
      {/* View Checklist Modal */}
      {showModal && selectedStudent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Student Details</h3>
            <p>
              <strong>Student ID:</strong> {selectedStudent.id}
            </p>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCORModal && selectedStudent && (
        <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h3>Student Details</h3>
          <p>
            <strong>Student ID:</strong> {selectedStudent.id}
          </p>
          <button
            className={styles.closeButton}
            onClick={() => setShowCORModal(false)}
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
              <strong>Reject Submission</strong>
            </h3>
            <hr />
            
            <div className={styles.form_section}>
              <label>Reject Submission to</label>
              <select
                className={styles.select}
                value={rejectTo}
                onChange={(e) => setRejectTo(e.target.value)}
              >
                <option value="Both">Both</option>
                <option value="COR Only">COR Only</option>
                <option value="Checklist Only">Checklist Only</option>
              </select>
            </div>

            <div className={styles.form_section}>
            <label>Feedback</label>
            <textarea
              className={styles.textarea}
              placeholder="Enter feedback..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.closeButton} onClick={closeRejectModal}>
                Cancel
              </button>

              <button className={styles.submit} onClick={handleRejectSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {showAcceptModal && selectedStudent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>
              <strong>Accept Submission</strong>
            </h3>

            <hr />
            
            <div className={styles.form_section}>
            <label>Accept Submission to</label>
            <select
              className={styles.select}
              value={acceptTo}
              onChange={(e) => setAcceptTo(e.target.value)}
            >
              <option value="Both">Both</option>
              <option value="COR Only">COR Only</option>
              <option value="Checklist Only">Checklist Only</option>
            </select>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.closeButton} onClick={closeAcceptModal}>
                Cancel
              </button>

              <button className={styles.submit} onClick={handleAcceptSubmit}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advisee;
