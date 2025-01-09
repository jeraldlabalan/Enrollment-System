import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Login/Login.module.css";
import "../../App.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const emailInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted", formData); // Debugging

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies/session
      });

      const result = await response.json();
      console.log("Login response:", result); // Debugging

      if (response.ok) {
        const { role, incompleteProfile, user } = result;

        if (role === "student") {
          if (incompleteProfile) {
            toast.warning("Incomplete profile. Please complete your profile.");
            navigate("/profile", { state: { userId: user.user_id } });
          } else {
            toast.success("Login successful!");
            navigate("/home", { state: { userId: user.user_id } });
          }
        } else if (role === "admin") {
          toast.success("Login successful!");
          navigate("/dashboard", { state: { userId: user.user_id } });
        } else {
          throw new Error("Unexpected role received.");
        }
      } else {
        console.error("Login failed:", result.message);
        toast.error(result.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      toast.error(error.message || "Failed to connect to server.");
    }
  };

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles.login_container}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="./images/bscslogo.jpg" alt="BSCS Logo" />
          </Link>
          <Link to="/">
            <img src="./images/bsitlogo.jpg" alt="BSIT Logo" />
          </Link>
          <div className={styles.heading}>
            <h3>Department of Computer Studies</h3>
            <p>Enrollment System</p>
          </div>
        </div>
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_field_login}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
              ref={emailInputRef}
            />
          </div>
          <div className={styles.form_field_login}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.text_end}>
            <Link to="/EmailVerification">Forgot password?</Link>
          </div>
          <div className={styles.button_holder}>
            <button type="submit" className={styles.btn}>
              Login
            </button>
          </div>
        </form>
        <div className={styles.text_center}>
          <p>
            Don't have an account? <Link to="/register"><span>Register</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
