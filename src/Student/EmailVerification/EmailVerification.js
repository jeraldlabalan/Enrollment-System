import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./EmailVerification.module.css";
import "../../App.css";
import { toast, ToastContainer } from "react-toastify";

const OTPInput = ({ length = 6, onVerify }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < length - 1) {
        inputRefs.current[index + 1].focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        onVerify(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className={styles.otpContainer}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={styles.otpInput}
        />
      ))}
    </div>
  );
};

function EmailVerification() {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.warning("Please enter your email address.");
      return;
    }
  
    try {
      console.log("Sending email to backend:", email); // Debugging log
      const response = await fetch("http://localhost:5000/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log("Response from backend:", data); // Debugging log
  
      if (response.ok) {
        setStep(2);
        setMessage("Verification code sent to your email.");
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      alert("Failed to send verification code. Please try again.");
    }
  };

  const handleVerify = async (enteredOtp) => {
    setOtp(enteredOtp);

    if (enteredOtp.length === 6) {
      setStep(3);
      setIsVerified(true);
    }
  };

  const handlePasswordChange = async () => {
  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setStep(4); // Go to the success step
    } else {
      console.error("Failed to reset password:", data.message);
      alert(data.message || "Failed to reset password. Please try again.");
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    alert("Failed to reset password. Please try again.");
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logos}>
          <Link to="/">
            <img src="./images/CSlogo.png" alt="BSCS Logo" className={styles.logo_shield} />
          </Link>
          <Link to="/">
            <img src="./images/ITlogo.png" alt="BSIT Logo" className={styles.logo_its} />
          </Link>
        </div>
        <div className={styles.header_texts}>
          <h3 className={styles.header_h3}>Department of Computer Studies</h3>
          <p className={styles.header_p}>Cavite State University - Bacoor City Campus</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className={styles.content_wrapper}>
            <div className={styles.content_texts}>
              <h1 className={styles.content_h1}>Forgot Password</h1>
              <p className={styles.content_p}>Enter your email address to receive a verification code.</p>
            </div>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
            />
            <button onClick={handleEmailSubmit} className={styles.continue_button}>
              Send Code
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && !isVerified && (
          <div className={styles.content_wrapper}>
            <div className={styles.content_texts}>
              <h1 className={styles.content_h1}>Change Password</h1>
              <p className={styles.content_p}>
                We have sent a verification code to {email}. Please check your inbox and insert the code in the fields below to change your password.
              </p>
            </div>
            <div className={styles.content_otp}>
              <OTPInput length={6} onVerify={handleVerify} />
            </div>
          </div>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && isVerified && (
          <div className={styles.content_wrapper}>
            <div className={styles.content_texts}>
              <h1 className={styles.content_h1}>Set New Password</h1>
              <p className={styles.content_p}>Enter your new password and confirm it below.</p>
            </div>
            <label>New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.passwordInput}
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.passwordInput}
            />
            {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
            <button onClick={handlePasswordChange} className={styles.continue_button}>
              Change Password
            </button>
          </div>
        )}

        {/* Step 4: Success Message */}
        {step === 4 && isVerified && (
          <div className={styles.successMessage}>
            <div className={styles.checkmark}></div>
            <h1 className={styles.content_h1}>Password has been changed!</h1>
            <p className={styles.content_p}>Your password has successfully been changed. You may log in with the new password you created.</p>
            <Link to="/login" className={styles.continue_button}>
              Go to Login
            </Link>
          </div>
        )}
      </div>
       <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default EmailVerification;