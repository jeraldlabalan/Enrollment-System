import React, { useState, useRef, useEffect } from "react";
import styles from "./AdmissionAndFaqs.module.css";
import cs_logo from "../../assets/CSlogo.png";
import it_logo from "../../assets/ITlogo.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdmissionAndFaqs = () => {
  // State to track which FAQ is open
  const [openFaq, setOpenFaq] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [canCheck, setCanCheck] = useState(false);
  const consentFormRef = useRef(null);
  

  const handleCheckboxChange = (e) => {
    if (canCheck) {
      setIsChecked(e.target.checked);
      if (e.target.checked) {
        toast.dismiss(); // Dismiss any existing toasts
      }
    } else {
      toast.error('You must scroll to the bottom of the terms and conditions before agreeing.');;
    }
  };


  const handleProceed = () => {
    if (!isChecked) {
      toast.error('You must agree to the terms and conditions before proceeding.');
    } else {
      // Proceed with the next steps
      console.log('Proceeding to the next step...');
    }
  };

  const handleScroll = () => {
    if (consentFormRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consentFormRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setCanCheck(true);
        toast.dismiss(); // Dismiss any existing toasts
      }
    }
  };
  
  useEffect(() => {
    if (consentFormRef.current) {
      consentFormRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (consentFormRef.current) {
        consentFormRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  // Toggle FAQ visibility
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.enrollment_container}>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbar_left}>
          <img src={cs_logo} alt="BSCS Logo" className={styles.navbar_logo} />
          <img src={it_logo} alt="IT Logo" className={styles.navbar_logo} />
        </div>
      </nav>

      {/* Content */}
      <div className={styles.enrollment_content}>
        <section className={styles.enrollment_wrapper}>
          <h1>Admission Process</h1>
          <h2>
            Please read the process before proceeding to the next steps of
            enrollment. Students are categorized by the following:
          </h2>
          <h2>Students are categorized by the following:</h2>
          <ul>
            <li>
              Regular Students (S1): Those who are taking the regular load of
              subjects.
            </li>
            <li>Incoming First-Year Students (S2):</li>
            <li>
              Irregular Students (S3): Those not taking the expected load based
              on their year level.
            </li>
            <li>
              Shiftees (S4): Students who have shifted from other programs to
              IT/CS.
            </li>
            <li>Returnees (S5):</li>
            <li>
              Transferees (S6):Students who transferred from other universities.
            </li>
          </ul>
          <h2>
            Conditions for the classification of student types are outlined as
            follows:
          </h2>
          <ol>
            <li>
              A student who is a transferee and/or a regular student from other
              CvSU campuses shall be classified as S6
            </li>
            <li>
              The classification of S4 shall be applied exclusively to students
              residing in CvSU Bacoor who shift to the IT/CS program.
            </li>
            <li>
              A student shall be classified as S3 only if they are residing on
              campus and are not enrolled in the regular workload of subjects.
            </li>
            <li>
              Students will be automatically classified as S3 if their
              Certificate of Grades indicates a score of 4.00, 5.00, or contains
              the designations INC or DRP.
            </li>
            <li>
              Students that are planning to shift to other programs and/or
              transfer to other campuses shall not use this system.
            </li>
          </ol>
          <h2>
            {" "}
            Requirements For Regular Students (S1) and Irregular Students (S3),
            <span>
              the following requirements should be submitted in the system for
              upon checking:
            </span>
          </h2>
          <ol>
            {" "}
            <li>
              Scanned Copy of Curriculum Checklist signed by advisers last
              semester; and
            </li>{" "}
            <li>Last semester’s Certificate of Registration.</li>
          </ol>
          <h2>For Transferee (S6):</h2>
          <ol>
            {" "}
            <li>Transcript of Records (TOR)</li>
          </ol>
          <h2>
            {" "}
            Incoming First Year Students (S2)
            <span>
              {" "}
              will not submit any requirements on the system as it submissions
              are arranged by the registrar.
            </span>
          </h2>
          <h2>
            Shiftees (S4) and Returnees (S5)
            <span>
              {" "}
              will also not submit anything via online, but it is required to
              pick an advising schedule to submit all the requirements needed
              via face-to-face. After verification and checking by the advisers:
              S1 and S2 will be given an Enrollment Date, while S4, S5, and S6
              will be given a chance to select an advising date for picking
              schedules, sections and subjects
            </span>
          </h2>{" "}
          <div className={styles.enrollment_steps}>
            <div className={styles.regular_students}>
              <h2>Steps of Enrollment</h2>
              <h3>For Regular Students (S1 and S2):</h3>
              <ol>
                <li>Submit the necessary documents through the system.</li>
                <li>Receive your enrollment date.</li>
                <li>
                  On your enrollment date, pay fees and get your Certificate of
                  Registration.
                </li>
              </ol>
            </div>

            <div className={styles.irregular_students}>
              <h3>For Irregular Students (S3, S4, S5, and S6):</h3>
              <ol>
                <li>
                  Submit the necessary scanned documents through the system.
                </li>
                <li>
                  Select an advising date for the submission of requirements and
                  the selection of subjects.
                </li>
                <li>Once completed, you will receive your enrollment date.</li>
                <li>
                  On your enrollment date, pay the society fee and wait for the
                  issuance of your Certificate of Registration.
                </li>
              </ol>
            </div>
          </div>
          <div className={styles.faqs_wrapper}>
            <h1 className={styles.faqs}>frequently asked questions</h1>
          </div>
          <div className={styles.faq_box}>
            <div className={styles.faq_item} onClick={() => toggleFaq(0)}>
              <span className={styles.faq_symbol}>
                {openFaq === 0 ? "-" : "+"}
              </span>
              {openFaq !== 0 && (
                <p className={styles.faq_question}>
                  How can I change my password?
                </p>
              )}
              {openFaq === 0 && (
                <p className={styles.faq_answer}>
                  You can change your password by going to the "Profile" section
                  and selecting "Change Password".
                </p>
              )}
            </div>
            <div className={styles.faq_item} onClick={() => toggleFaq(1)}>
              <span className={styles.faq_symbol}>
                {openFaq === 1 ? "-" : "+"}
              </span>
              {openFaq !== 1 && (
                <p className={styles.faq_question}>
                  How and where can I pay matriculation and society fees?
                </p>
              )}
              {openFaq === 1 && (
                <p className={styles.faq_answer}>
                  Matriculation fees are to be paid at the Registrar's Office,
                  while society fees are to be settled with the society's
                  designated officers on duty. Both fees must be paid on the
                  enrollment date specified in the system.
                </p>
              )}
            </div>

            <div className={styles.faq_item} onClick={() => toggleFaq(2)}>
              <span className={styles.faq_symbol}>
                {openFaq === 2 ? "-" : "+"}
              </span>
              {openFaq !== 2 && (
                <p className={styles.faq_question}>
                  Should I still use the system if I’m planning to shift to
                  other programs outside DCS?
                </p>
              )}
              {openFaq === 2 && (
                <p className={styles.faq_answer}>
                  However, before shifting, students must coordinate with the
                  respective department chairpersons. If the department does not
                  approve the shift, the student will either need to retain
                  their current program (Computer Science or Information
                  Technology) or consider transferring to another university.
                </p>
              )}
            </div>

            <div className={styles.faq_item} onClick={() => toggleFaq(3)}>
              <span className={styles.faq_symbol}>
                {openFaq === 3 ? "-" : "+"}
              </span>
              {openFaq !== 3 && (
                <p className={styles.faq_question}>
                  Why can’t I select an advising date that I want?
                </p>
              )}
              {openFaq === 3 && (
                <p className={styles.faq_answer}>
                  You may only select an advising date that is available in the
                  system, as each day has a set quota. If a date is no longer
                  selectable, it means the quota for that day has been reached,
                  and you must choose from the remaining available dates.
                </p>
              )}
            </div>
          </div>
          {/* <div className={styles.confirmation}>
            <input type="checkbox" id="confirmation" />
            <label htmlFor="confirmation">
              I have read and understand the enrollment process.
            </label>
          </div>


          <button className={styles.proceed_button}>Proceed</button> */}
          <div className={styles.faqs_wrapper}>
            <h1 className={styles.faqs}>terms and conditions</h1>
          </div>
          <div className={styles.consent_form_box}>
            <div className={styles.consent_from} ref={consentFormRef}>
              <ol>
                <li>
                  <p className={styles.title}>1. Introduction</p>
                  <p>
                    Welcome to Department of Computer Studies Cavite State
                    University - Bacoor City Campus Enrollment System.
                    By accessing and using this system, you agree to comply with
                    and be bound by the following terms and conditions.
                    Please read them carefully before proceeding.
                  </p>
                  
                   
               
                </li>
                <li>
                  <p className={styles.title}>2. Acceptance of Terms</p>
                  <p>By using this enrollment system, you confirm that:</p>
                  <br />
                  <p>
                    You have read, understood, and agreed to these terms and
                    conditions.
                  </p>
                  <p>
                    You consent to the collection, processing, and use of your
                    personal information in accordance with the Data Privacy Act
                    of 2012.
                  </p>
                  <p>
                    If you do not agree with any of these terms, you must not
                    use this system.
                  </p>
                </li>
                <li>
                  <p className={styles.title}>3. User Responsibilities</p>
                  <p>
                    3.1. You agree to provide accurate, complete, and up-to-date
                    information during the enrollment process.
                  </p>
                  <p>
                    3.2. You are responsible for ensuring the security of your
                    account credentials, such as emails and passwords. Sharing
                    your account details with others is strictly prohibited.
                  </p>
                  <p>
                    3.3. Any fraudulent, unauthorized, or illegal activity
                    within the system may result in termination of your access
                    and legal action.
                  </p>
                </li>

                <li>
                <p className={styles.title}>4. Privacy and Data Protection</p>
<p>4.1. The personal information you provide will be collected, used, and stored in compliance with the Data Privacy Act of 2012.</p>
<p>4.2. Your information will only be used for the purposes of processing enrollment, maintaining academic records, and other related administrative activities.</p>
<p>4.3. Your data will be securely stored and accessible only by authorized personnel.</p>
<p>4.4. You have the right to access, update, or request deletion of your personal data by contacting the Registrar's Office.</p>
                </li>

                <li>
                  <p className={styles.title}>5. System Availability</p>
                  <p>
                    5.1. The enrollment system may be temporarily unavailable
                    due to maintenance, upgrades, or unforeseen technical
                    issues. We will strive to minimize disruptions and notify
                    users in advance whenever possible.
                  </p>
                  <p>
                    5.2. We are not liable for any delays or interruptions
                    caused by technical failures or other circumstances beyond
                    our control.
                  </p>
                </li>

                <li>
                  <p className={styles.title}>6. Intellectual Property</p>
                  <p>
                    All content, designs, and functionalities within the
                    enrollment system are the intellectual property of Cavite
                    State University - Bacoor City Campus Enrollment System.
                    Unauthorized copying, distribution, or modification of any
                    part of the system is strictly prohibited.
                  </p>
                </li>

                <li>
                  <p className={styles.title}>7. Prohibited Activities</p>
                  <p>You agree not to:</p>
                  <br />
                  <p>Tamper with or disrupt the system’s operation.</p>
                  <p>
                    Attempt to gain unauthorized access to other users' data or
                    restricted areas of the system.
                  </p>
                  <p>
                    Use the system for purposes other than those intended by
                    Cavite State University - Bacoor City Campus.
                  </p>
                </li>

                <li>
                  <p className={styles.title}>
                    8. Changes to Terms and Conditions
                  </p>
                  <p>
                    We reserve the right to modify or update these terms and
                    conditions at any time. Any changes will be communicated to
                    users via the enrollment system or official communication
                    channels. Continued use of the system after such updates
                    constitutes acceptance of the revised terms.
                  </p>
                </li>

                <li>
                  <p className={styles.title}>9. Limitation of Liability</p>
                  <p>
                    While we strive to ensure the accuracy and reliability of
                    the system, we do not guarantee that it will always operate
                    without errors. Cavite State University - Bacoor City Campus
                    Enrollment System is not responsible for:
                  </p>

                  <br/>
                  <p>
                    Any data loss or damages arising from your use of the
                    system.
                  </p>
                  <p>
                    Any unauthorized access or use of your account resulting
                    from your failure to secure your credentials.
                  </p>
                </li>

                <li>
                  <p className={styles.title}>10. Contact Information</p>
                  <p>
                    For inquiries, assistance, or concerns regarding these terms
                    and conditions or the enrollment system, please contact:
                  </p>
                  <p>
                    Cavite State University - Bacoor City Campus Office of the
                    Registrar
                  </p>
                  <p>Email: cvsubacoor@cvsu.edu.ph</p>
                  <p>Phone: (046) 476-5029</p>
                  <p>
                    Address: Lily St., Phase II, Soldiers Hills IV, Molino VI,
                    Bacoor City, Cavite
                  </p>
                </li>

                <li>
                  <p>
                    By checking this box, you confirm that you have read and
                    understood the admission process. You also consent to the
                    collection, use, and processing of your personal information
                    for purposes related to enrollment, in accordance with the
                    Data Privacy Act of 2012.
                  </p>
                </li>
              </ol>
            </div>

            <div className={styles.agree_consent}>
              <div className={styles.agree_section}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={!canCheck}
              />
              <p>
              <i>
              By checking this box, you confirm that you have read and understood the admission process. You also consent to the collection, use, and processing of your personal information for purposes related to enrollment, in accordance with the Data Privacy Act of 2012.
              </i>
              </p>
              </div>
              
              <button 
              onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>

          <div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdmissionAndFaqs;
