import React, { useState, useEffect } from "react";
import { checkSession, logout } from "../../utils/session";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal"); // Default active tab
  const [profileImage, setProfileImage] = useState(null); // State to store uploaded image
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const isValidSession = await checkSession(navigate); // Check if session is valid
      if (!isValidSession) {
        console.error("Invalid session.");
        navigate("/login"); // Redirect to login if session is invalid
      } else if (!userId) {
        console.error("No userId found in location state.");
        navigate("/login"); // Redirect if userId is missing
      } else {
        console.log("Session is valid. UserId:", userId);
        setIsLoading(false); // Session is valid, stop loading
      }
      const isStepValid = validateCurrentStep();
      setIsNextDisabled(!isStepValid);
    };

    initialize();
  }, [navigate, userId]);

  const handleLogout = () => {
    logout(navigate); // Log out and redirect to login
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size exceeds 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalDetails />;
      case "family":
        return <FamilyBackground />;
      case "education":
        return <Education />;
      case "account":
        return <AccountSettings />;
      default:
        return <PersonalDetails />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while checking session
  }

  return (
    <div className={styles.profile_wrapper}>
      <div className={styles.profile_container}>
        {/* Left-side profile section */}
        <div className={styles.profile_sidebar}>
          <div className={styles.profile_photo}>
            {/* Display uploaded image or default placeholder */}
            <img
              src={profileImage || "profile-photo-placeholder.jpg"}
              alt="Profile"
              className={styles.uploaded_image}
            />
            <div className={styles.cameraIconWrapper}>
              <i className={`${styles.cameraIcon}  fa-solid fa-camera`}></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.file_input}
              />
            </div>
          </div>
          <div className={styles.profile_info}>
        
          </div>
        </div>

        {/* Right-side tab content section */}
        <div className={styles.profile_content}>
          <div className={styles.tabs}>
            <a
              href="#personal"
              className={activeTab === "personal" ? styles.active : ""}
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                setActiveTab("personal");
              }}
            >
              Personal Information
            </a>
            <a
              href="#family"
              className={activeTab === "family" ? styles.active : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("family");
              }}
            >
              Family Background
            </a>
            <a
              href="#education"
              className={activeTab === "education" ? styles.active : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("education");
              }}
            >
              Educational Attainment
            </a>
            <a
              href="#account"
              className={activeTab === "account" ? styles.active : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("account");
              }}
            >
              Account Settings
            </a>
          </div>

          <div className={styles.tab_content}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

// Sample components for each tab
const PersonalDetails = () => (
  <div className={styles.personal_details_wrapper}>
    <div className={styles.form_row}>
      <div className={styles.form_field}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          className={styles.input}
        />
      </div>

      <div className={styles.form_field}>
        <label htmlFor="middleName">Middle Name</label>
        <input
          type="text"
          name="middleName"
          id="middleName"
          className={styles.input}
        />
      </div>

      <div className={styles.form_field}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          className={styles.input}
        />
      </div>

      <div className={styles.form_field}>
        <label htmlFor="lastName">Suffix</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          className={styles.input}
        />
      </div>
    </div>

    <div className={`${styles.form_row}`}>
      <div className={`${styles.form_field}`}>
        <label htmlFor="dob">Date of Birth</label>
        <input type="date" name="dob" id="dob" className={styles.input} />
      </div>

      <div className={styles.form_field}>
        <label htmlFor="sex" className={styles.radio_title}>
          Sex
        </label>
        <div className={styles.radio_container}>
          <div className={styles.radio}>
            <input type="radio" name="sex" id="Male" value="Male" />
            <label>Male</label>
          </div>
          <div className={styles.radio}>
            <input type="radio" name="sex" id="Female" value="Female" />
            <label>Female</label>
          </div>
        </div>
      </div>
    </div>

    <div className={`${styles.form_row}`}>
      <div className={`${styles.form_field} ${styles.solo_row}`}>
        <label htmlFor="address">Complete Address</label>
        <input
          type="text"
          name="address"
          id="address"
          className={styles.input}
          placeholder="Ex. B27 L16, Chesa Street, Talon Singko"
        />
      </div>
    </div>
    <div className={`${styles.form_row}`}>
      <div className={`${styles.form_field} ${styles.two_rows}`}>
        <input
          type="text"
          name="city"
          id="city"
          className={styles.input}
          placeholder="City"
        />
      </div>

      <div className={`${styles.form_field} ${styles.two_rows}`}>
        <input
          type="province"
          name="province"
          id="province"
          className={styles.input}
          placeholder="Province"
        />
      </div>
    </div>

    <div className={`${styles.form_row}`}>
      <div className={`${styles.form_field}`}>
        <input
          type="text"
          name="postal"
          id="postal"
          className={styles.input}
          placeholder="Postal Code"
        />
      </div>

      <div className={`${styles.form_field}`}>
        <input
          type="text"
          name="country"
          id="country"
          className={styles.input}
          placeholder="Country"
        />
      </div>
    </div>

    <div className={`${styles.form_row}`}>
      <div className={`${styles.form_field} ${styles.solo_row}`}>
        <label htmlFor="contact">Contact Number</label>
        <input
          type="text"
          name="contactNumber"
          id="contact"
          className={styles.input}
        />
      </div>
    </div>

    <div className={styles.navigation_buttons}>
  <button onClick={nextStep} className={styles.nav_button} disabled={isNextDisabled}>
    Next
  </button>
  </div>
  </div>
);

const FamilyBackground = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const [siblings, setSiblings] = useState([{ name: "", age: "" }]); // Initial sibling data
  const maxSiblings = 8; // Limit for number of siblings

  // Handle input change for sibling rows
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newSiblings = [...siblings];
    newSiblings[index][name] = value;
    setSiblings(newSiblings);
  };

  // Add a new sibling row (only if under the limit)
  const handleAddSibling = () => {
    if (siblings.length < maxSiblings) {
      setSiblings([...siblings, { name: "", age: "" }]); // Add new row with empty fields
    }
  };

  // Remove a sibling row
  const handleRemoveSibling = (index) => {
    const newSiblings = siblings.filter((_, i) => i !== index);
    setSiblings(newSiblings);
  };

  return (
    <div className={styles.family_background_wrapper}>
      {/* Step 1: Parent Information */}
      {currentStep === 1 && (
        <div className={styles.family_background_step1}>
          <div className={styles.parent1_container}>
            <div className={styles.title}>
              <h1>Parent 1</h1>
            </div>
            <div className={styles.field}>
              <label htmlFor="parent1Name">Full Name</label>
              <input type="text" className={styles.input} id="parent1Name" />
            </div>
            <div className={styles.field}>
              <label htmlFor="parent1Relationship">Relationship</label>
              <input
                type="text"
                className={styles.input}
                id="parent1Relationship"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="parent1Education">Highest Education</label>
              <select className={styles.input} id="parent1Education">
                <option disabled selected>
                  Choose
                </option>
                <option>High School</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Doctorate</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="parent1Contact">Contact Number</label>
              <input type="text" className={styles.input} id="parent1Contact" />
            </div>
          </div>

          <div className={styles.parent2_container}>
            <div className={styles.title}>
              <h1>Parent 2</h1>
            </div>
            <div className={styles.field}>
              <label htmlFor="parent2Name">Full Name</label>
              <input type="text" className={styles.input} id="parent2Name" />
            </div>
            <div className={styles.field}>
              <label htmlFor="parent2Relationship">Relationship</label>
              <input
                type="text"
                className={styles.input}
                id="parent2Relationship"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="parent2Education">Highest Education</label>
              <select className={styles.input} id="parent2Education">
                <option disabled selected>
                  Choose
                </option>
                <option>High School</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Doctorate</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="parent2Contact">Contact Number</label>
              <input type="text" className={styles.input} id="parent2Contact" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Guardian Information */}
      {currentStep === 2 && (
        <div className={styles.family_background_step2}>
          <div className={styles.guardian}>
            <div className={styles.title}>
              <h1>Guardian</h1>
            </div>
            <div className={styles.row_field}>
              <div className={styles.field}>
                <label htmlFor="guardianName">Name</label>
                <input type="text" className={styles.input} id="guardianName" />
              </div>
              <div className={styles.field}>
                <label htmlFor="guardianRelationship">Relationship</label>
                <input
                  type="text"
                  className={styles.input}
                  id="guardianRelationship"
                />
              </div>
            </div>
            <div className={styles.row_field}>
              <div className={styles.field}>
                <label htmlFor="guardianEmployer">Employer</label>
                <input
                  type="text"
                  className={styles.input}
                  id="guardianEmployer"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="guardianEducation">Highest Education</label>
                <select className={styles.input} id="guardianEducation">
                  <option disabled selected>
                    Choose
                  </option>
                  <option>High School</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>Doctorate</option>
                </select>
              </div>
            </div>
            <div className={styles.row_field}>
              <div className={styles.field}>
                <label htmlFor="guardianContact">Contact Number</label>
                <input
                  type="text"
                  className={styles.input}
                  id="guardianContact"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Siblings Information */}
      {currentStep === 3 && (
        <div className={styles.family_background_step3}>
          <div className={styles.siblings}>
            <div className={styles.title}>
              <h1>Siblings</h1>
              <h3>
                If you are an only child, please leave it blank and proceed to
                the next step.
              </h3>
            </div>
            <div className={styles.add_siblings_container}>
              <table className={styles.add_siblings_table}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {siblings.map((sibling, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={sibling.name}
                          placeholder="Enter name"
                          className={styles.add_siblings_name}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="age"
                          value={sibling.age}
                          placeholder="Age"
                          className={styles.add_siblings_age}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </td>
                      <td>
                        {/* Add button for the first row only */}
                        {index === 0 && (
                          <button
                            type="button"
                            className={styles.add_sibling_button}
                            onClick={handleAddSibling}
                          >
                            Add
                          </button>
                        )}
                        {/* Remove button for every row after the first */}
                        {index !== 0 && (
                          <button
                            type="button"
                            className={styles.remove_button}
                            onClick={() => handleRemoveSibling(index)}
                          >
                            <i class="fa-solid fa-x"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.navigation_buttons}>
        {currentStep > 1 && (
          <button onClick={prevStep} className={styles.nav_button}>
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button onClick={nextStep} className={styles.nav_button}>
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button type="submit" className={styles.nav_button}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

const Education = () => (
  <div className={styles.educational_attainment_wrapper}>
    <div className={styles.title}>
      <h1>Educational Attainment</h1>
    </div>

    <div className={styles.elementary}>
      <div className={styles.subtitle}>
        <h3>Elementary</h3>
      </div>
      <div className={styles.elementary_fields}>
        <div className={styles.last_school_attended}>
          <label htmlFor="elementary">Last School Attended</label>
          <input type="text" id="elementary" name="elementary" />
        </div>

        <div className={styles.type_of_school}>
          <label htmlFor="type-of-school">Type of School</label>
          <select>
            <option disabled>Choose</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={styles.year_graduated}>
          <label htmlFor="year">Year Graduated</label>
          <input type="number" id="year" name="year" />
        </div>
      </div>
    </div>

    <div className={styles.junior_hs}>
      <div className={styles.subtitle}>
        <h3>Junior High School</h3>
      </div>
      <div className={styles.junior_hs_fields}>
        <div className={styles.last_school_attended}>
          <label htmlFor="junior-hs">Last School Attended</label>
          <input type="text" id="junior-hs" name="junior-hs" />
        </div>

        <div className={styles.type_of_school}>
          <label htmlFor="type-of-school">Type of School</label>
          <select>
            <option disabled>Choose</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={styles.year_graduated}>
          <label htmlFor="year">Year Graduated</label>
          <input type="number" id="year" name="year" />
        </div>
      </div>
    </div>

    <div className={styles.senior_hs}>
      <div className={styles.subtitle}>
        <h3>Senior High School</h3>
      </div>
      <div className={styles.senior_hs_fields}>
        <div className={styles.last_school_attended}>
          <label htmlFor="senior-hs">School Attended</label>
          <input type="text" id="senior-hs" name="senior-hs" />
        </div>

        <div className={styles.type_of_school}>
          <label htmlFor="type-of-school">Type of School</label>
          <select>
            <option disabled>Choose</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={styles.strand}>
          <label htmlFor="strand">Strand</label>
          <input type="text" id="strand" name="strand" placeholder="Ex. STEM" />
        </div>

        <div className={styles.year_graduated}>
          <label htmlFor="year">Year Graduated</label>
          <input type="number" id="year" name="year" />
        </div>
      </div>
    </div>

    <div className={styles.navigation_buttons}>
      <button>Submit</button>
    </div>
  </div>
);

const AccountSettings = () => (
  <div className={styles.account_settings_wrapper}>
    <div className={styles.title}>
      <h1>Account Settings</h1>
    </div>
    <div className={styles.account}>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
    </div>
    <div className={styles.navigation_buttons}>
      <button className={styles.change_password}>Change Password</button>
    </div>
  </div>
);

export default Profile;
