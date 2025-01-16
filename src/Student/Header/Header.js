import React from "react";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logos}>
        <NavLink to="/">
          <img
            src="./images/CSlogo.png"
            alt="BSCS Logo"
            className={styles.logo_shield}
          />
        </NavLink>
        <NavLink to="/">
          <img
            src="./images/ITlogo.png"
            alt="BSIT Logo"
            className={styles.logo_its}
          />
        </NavLink>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/home">
          <a className={styles.navLink}>Home</a>
        </NavLink>
        <NavLink to="/profile">
          <a className={styles.navLink}>Profile</a>
        </NavLink>
        <NavLink to="/submissionandsubject">
          <a className={styles.navLink}>Submission and Subject</a>
        </NavLink>
        <NavLink to="/statusandscheduling">
          <a className={styles.navLink}>Status and Scheduling</a>
        </NavLink>
        <NavLink to="">
          <a className={styles.navLink}>Log Out</a>
        </NavLink>
        <NavLink to="">
          <a className={styles.navLink}>
            <i class="fa-solid fa-bell"></i>
          </a>
        </NavLink>
      </nav>
    </div>
  );
}

export default Header;
