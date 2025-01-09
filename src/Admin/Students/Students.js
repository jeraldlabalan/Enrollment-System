import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./Students.module.css"; // Ensure this file exists
import DashboardHeader from "../Dashboard/DashboardHeader";
import CORPrint from "./CORPrint"; // Import CORPrint component

const Students = () => {
  const { user, isLoading: sessionLoading, logout } = useContext(SessionContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [students, setStudents] = useState([]); // Add this line
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [sortCriteria, setSortCriteria] = useState("id"); // Default sorting criteria
  const [filterType, setFilterType] = useState(""); // For student type filter
  const [filterYear, setFilterYear] = useState(""); // For year standing filter
  const [selectedStudent, setSelectedStudent] = useState(null);
 
 

  const filteredAndSortedStudents = students
    .filter((student) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        student.id.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.firstName.toLowerCase().includes(query);

      const matchesType = filterType ? student.type === filterType : true;
      const matchesYear = filterYear ? student.yearStanding === filterYear : true;

      return matchesSearch && matchesType && matchesYear;
    })
    .sort((a, b) => {
      if (sortCriteria === "id") {
        return a.id.localeCompare(b.id);
      } else if (sortCriteria === "lastName") {
        return a.lastName.localeCompare(b.lastName);
      } else if (sortCriteria === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      }
      return 0;
    });

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
          const response = await fetch("http://localhost:5000/api/students", {
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
    }, []);

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

  const handlePrintCOR = (student) => {
    setSelectedStudent(student);
  };

  const handlePrintClose = () => {
    setSelectedStudent(null);
  };

  

 

  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DashboardHeader />
      </div>

      <div className={styles.content_holder}>
        <div className={styles.content}>
          <h1 className={styles.title}>Student</h1>

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
                  <th className={styles.thTd}>Middle Name</th>
                  <th className={styles.thTd}>Student Type</th>
                  <th className={styles.thTd}>Year Standing</th>
                  <th className={styles.thTd}>Commands</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStudents.map((student) => (
                  <tr key={student.student_id}>
                    <td className={styles.td}>{student.student_id}</td>
                    <td className={styles.td}>{student.last_name}</td>
                    <td className={styles.td}>{student.first_name}</td>
                    <td className={styles.td}>{student.middle_name}</td>
                    <td className={styles.td}>{student.student_type}</td>
                    <td className={styles.td}>{student.year_level}</td>
                    <td className={styles.td}>
                      
                    <button onClick={() => handlePrintCOR(student)}>Print COR</button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.filterBar}>
            <div className={styles.sort}>
              <label className={styles.label}>Sort by:</label>
              <select className={styles.select} value={sortCriteria} onChange={handleSortChange}>
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

            <button className={styles.export_button}>Export as Spreadsheet</button>
          </div>
        </div>
      </div>
      {selectedStudent && (
        <CORPrint student={selectedStudent} onClose={handlePrintClose} />
      )}

     
    </div>
  );
};

export default Students;
