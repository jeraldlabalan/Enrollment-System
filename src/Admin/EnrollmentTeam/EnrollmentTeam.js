import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import styles from "./EnrollmentTeam.module.css";
import Header from "../Dashboard/DashboardHeader";

function EnrollmentTeam() {
  const { user, isLoading: sessionLoading, logout } = useContext(SessionContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login");
    }
  }, [sessionLoading, user, navigate]);
  
    const handleLogout = () => {
      logout(navigate); // Log out and redirect to login
    };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.enrollment_team_wrapper}>
      <div className={styles.enrollment_team_header}>
        <Header />
      </div>
      <div className={styles.enrollment_team_content}>
        <h1 className={styles.title}>Enrollment Team</h1>
        <div className={styles.table_header}>
          
        <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.input}
            />
          </div>

          <div className={styles.add_user_button_container}>
            <button className={styles.add_user_button} onClick={openModal}>
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
        <div className={styles.enrollment_team_table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thTd}>First Name</th>
                <th className={styles.thTd}>Middle Name</th>
                <th className={styles.thTd}>Last Name</th>
                <th className={styles.thTd}>Role</th>
                <th className={styles.thTd}>Commands</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.td}>Jerald</td>
                <td className={styles.td}>Valdez</td>
                <td className={styles.td}>Labalan</td>
                <td className={styles.td}>Kopal</td>
                <td className={styles.td}>
                  <button className={styles.button}>Edit Role</button>
                  <button className={styles.button}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.filterBar}>
            <div className={styles.sort}>
              <label className={styles.label}>Sort by:</label>
              <select className={styles.select}>
                <option value="" disabled>Roles</option>
                <option value="admin">Admin</option>
                <option value="adviser">Adviser</option>
                <option value="officer">Officer</option>
                <option value="">All</option>
              </select>
            </div>

            {/* <div className={styles.sort}>
              <label className={styles.label}>Student Type:</label>
              <select
                className={styles.select}
              >
                <option value="" disabled>Roles</option>
                <option value="admin">Admin</option>
                <option value="adviser" disabled>Adviser</option>
                <option value="officer" disabled>Officer</option>
                <option value="">All</option>
              </select>
            </div>

            <div className={styles.sort}>
              <label className={styles.label}>Year Standing:</label>
              <select
                className={styles.select}
              >
                <option value="">All</option>
                <option value="1st year">1st Year</option>
                <option value="2nd year">2nd Year</option>
                <option value="3rd year">3rd Year</option>
                <option value="4th year">4th Year</option>
              </select>
            </div> */}
          </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.enrollment_team_add_team_modal}>
          <div className={styles.modal_content}>
            <div className={styles.modal_header}>
              <span className={styles.close} onClick={closeModal}>
                &times;
              </span>
            </div>
            <div className={styles.modal_body}>
              <div className={styles.modal_role}>
                <h3 htmlFor="role">Role</h3>
                <select id="role" name="role">
                  <option value="Admin">Admin</option>
                  <option value="Adviser">Adviser</option>
                  <option value="Society Officer">Society Officer</option>
                </select>
              </div>
              <div className={styles.modal_user_info}>
                <h3>Credentials</h3>
                <div className={styles.modal_credentials}>
                  <div className={styles.modal_credentials_personal}>
                    <div>
                      <label htmlFor="first-name">First Name</label>
                      <input type="text" id="first-name" name="first-name" />
                    </div>
                    <div>
                      <label htmlFor="middle-name">Middle Name</label>
                      <input type="text" id="middle-name" name="middle-name" />
                    </div>
                    <div>
                      <label htmlFor="last-name">Last Name</label>
                      <input type="text" id="last-name" name="last-name" />
                    </div>
                  </div>

                  <div className={styles.modal_credentails_account}>
                    <div>
                      <label htmlFor="email1">Email</label>
                      <input type="email" id="email1" name="email1" />
                    </div>
                    <div>
                      <label htmlFor="pword1">Password</label>
                      <input type="password" id="pword1" name="pword1" />
                    </div>
                    <div
                      className={`${styles.modal_add_user_button_container}`}
                    >
                      <button className={`${styles.modal_add_user_button}`}>
                        Add User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrollmentTeam;
