import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

function HeaderCS() {
  return (
    <div className={styles.header}>
      <div className={styles.logos}>
        <Link to="/">
          <img
            src="./images/CSlogo.png"
            alt="BSCS Logo"
            className={styles.logo_shield}
          />
        </Link>
        <Link to="/">
          <img
            src="./images/ITlogo.png"
            alt="BSIT Logo"
            className={styles.logo_its}
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="">
          <a className={styles.navLink}>Dashboard</a>
        </Link>

        <Link to="/schedulecs">
        <a className={styles.navLink}>Schedule</a>
        </Link>

        <Link to="/enrollmentstatuscs">
        <a className={styles.navLink}>Enrollment Status</a>
        </Link>

        <Link to="/login">
          <a className={styles.navLink}>Log Out</a>
        </Link>
        <Link to="">
          <a className={styles.navLink}>
            <i class="fa-solid fa-bell"></i>
          </a>
        </Link>
      </nav>
    </div>
  );
}

export default HeaderCS;
