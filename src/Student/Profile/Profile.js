import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { checkSession, logout } from "../../utils/session";
import { useLocation, useNavigate, Link } from "react-router-dom";
import defaultProfilePhoto from '../../assets/default-profile-photo.jpg'; // Go up 2 levels to access the assets folder
import styles from "./Profile.module.css";
import axios from 'axios';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
   const {
      user,
      isLoading: sessionLoading,
      logout,
    } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal"); // Default active tab
  const [profileImage, setProfileImage] = useState(null); // State to store uploaded image
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${user.user_id}`, {
          credentials: "include", // Include cookies if required for authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data.");
        }

        const data = await response.json();
        setUserData(data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const initialize = async () => {
      if (!sessionLoading && !user) {
        navigate("/login", { replace: true });
        return;
      }

      if (user) {
        await fetchUserData();
      }
    };

    initialize();
  }, [sessionLoading, user, navigate]);


  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const response = await fetch(`/upload-profile-picture/${user.user_id}`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload image.");
    }

    const data = await response.json();
    setProfile({ ...profile, profile_picture: data.profilePicture });
  } catch (err) {
    console.error("Error uploading profile picture:", err.message);
    alert("Failed to upload profile picture. Please try again.");
  }
};


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:5000/profile/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile), // Manually convert `profile` to JSON
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile."); // Handle non-2xx responses
      }
  
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile.");
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index][field] = value;
    setProfile({ ...profile, education: updatedEducation });
  };

  const handleFamilyChange = (index, field, value) => {
    const updatedFamily = [...profile.family];
    updatedFamily[index][field] = value;
    setProfile({ ...profile, family: updatedFamily });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalDetails profile={profile} setProfile={setProfile} />;
      case "family":
        return <FamilyBackground profile={profile} setProfile={setProfile} />;
      case "education":
        return <Education profile={profile} setProfile={setProfile} />;
      case "account":
        return <AccountSettings />;
      default:
        return <PersonalDetails profile={profile} setProfile={setProfile} />;
    }
  };

  if (isLoading || sessionLoading) {
    return <div>Loading...</div>; // Show a loading indicator while checking session
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div className={styles.profile_wrapper}>

      <div className={styles.profile_container}>
        <div className={styles.profile_sidebar}>
        <div className={styles.profile_photo}>
  {/* Display uploaded image or default placeholder */}
  {profile.profile_picture ? (
    <img
      src={profile.profile_picture || defaultProfilePhoto}
      alt="Profile"
      className={styles.uploaded_image}
    />
  ) : (
    <img
      src={defaultProfilePhoto}
      alt="Default Profile"
      className={styles.uploaded_image}
    />
  )}
  <div className={styles.cameraIconWrapper}>
    <i className={`${styles.cameraIcon} fa-solid fa-camera`}></i>
    <input
      id="profileUpload"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className={styles.file_input}
    />
  </div>
</div>
          <div className={styles.profile_info}></div>
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

      <div className={styles.navigation_buttons}>
        <form onSubmit={handleProfileUpdate}>
         <button type="submit">Save Changes</button>
        </form>
      </div>

    </div>
  );
};

// Sample components for each tab
const PersonalDetails = ({ profile, setProfile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  return (
    <div className={styles.personal_details_wrapper}>
      <div className={styles.form_row}>
        <div className={styles.form_field}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className={styles.input}
            value={profile.firstName || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form_field}>
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            name="middleName"
            id="middleName"
            className={styles.input}
            value={profile.middleName || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form_field}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className={styles.input}
            value={profile.lastName || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form_field}>
          <label htmlFor="suffix">Suffix</label>
          <input
            type="text"
            name="suffix"
            id="suffix"
            className={styles.input}
            value={profile.suffix || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={`${styles.form_row}`}>
        <div className={`${styles.form_field}`}>
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            name="dob"
            id="dob"
            className={styles.input}
            value={profile.dob || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form_field}>
          <label htmlFor="sex" className={styles.radio_title}>
            Sex
          </label>
          <div className={styles.radio_container}>
            <div className={styles.radio}>
              <input
                type="radio"
                name="sex"
                id="Male"
                value="Male"
                checked={profile.sex === "Male"}
                onChange={handleChange}
              />
              <label>Male</label>
            </div>
            <div className={styles.radio}>
              <input
                type="radio"
                name="sex"
                id="Female"
                value="Female"
                checked={profile.sex === "Female"}
                onChange={handleChange}
              />
              <label>Female</label>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.form_row}`}>
        <div className={`${styles.form_field} ${styles.two_rows}`}>
          <input
            type="text"
            name="address"
            id="address"
            className={styles.input}
            placeholder="House No."
            value={profile.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.form_field} ${styles.two_rows}`}>
          <input
            type="text"
            name="barangay"
            id="barangay"
            className={styles.input}
            placeholder="Barangay"
            value={profile.barangay || ""}
            onChange={handleChange}
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
            value={profile.city || ""}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.form_field} ${styles.two_rows}`}>
          <input
            type="text"
            name="province"
            id="province"
            className={styles.input}
            placeholder="Province"
            value={profile.province || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={`${styles.form_row}`}>
        <div className={`${styles.form_field} ${styles.two_rows}`}>
          <input
            type="text"
            name="postal"
            id="postal"
            className={styles.input}
            placeholder="Postal Code"
            value={profile.postal || ""}
            onChange={handleChange}
          />
        </div>

        <div className={`${styles.form_field} ${styles.two_rows}`}>
          <input
            type="text"
            name="country"
            id="country"
            className={styles.input}
            placeholder="Country"
            value={profile.country || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={`${styles.form_row}`}>
        <div className={`${styles.form_field} ${styles.solo_row}`}>
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            id="contactNumber"
            className={styles.input}
            value={profile.contactNumber || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const FamilyBackground = ({ profile, setProfile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

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
      <div className={styles.family_content_wrapper}>
        {/* Step 1: Parent Information */}
      {currentStep === 1 && (
        <div className={styles.family_background_step1}>
          <div className={styles.parent1_container}>
            <div className={styles.title}>
              <h1>Parent 1</h1>
            </div>
            <div className={styles.field}>
              <label htmlFor="parents_name">Full Name</label>
              <input
                type="text"
                className={styles.input}
                id="parents_name"
                name="parents_name"
                value={profile.parents_name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="parents_relationship">Relationship</label>
              <select
                className={styles.input}
                id="parents_relationship"
                name="parents_relationship"
                value={profile.parents_relationship || ""}
                onChange={handleChange}
              >
                <option disabled>Select</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="parents_education">Highest Education</label>
              <select
                className={styles.input}
                id="parents_education"
                name="parents_education"
                value={profile.parents_education || ""}
                onChange={handleChange}
              >
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
              <label htmlFor="parents_contact_number">Contact Number</label>
              <input
                type="text"
                className={styles.input}
                id="parents_contact_number"
                name="parents_contact_number"
                value={profile.parents_contact_number || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.parent2_container}>
            <div className={styles.title}>
              <h1>Parent 2</h1>
            </div>
            <div className={styles.field}>
              <label htmlFor="parents_name1">Full Name</label>
              <input
                type="text"
                className={styles.input}
                id="parents_name1"
                name="parents_name1"
                value={profile.parents_name1 || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="parents_relationship1">Relationship</label>
              <select
                className={styles.input}
                id="parents_relationship1"
                name="parents_relationship1"
                value={profile.parents_relationship1 || ""}
                onChange={handleChange}
              >
                <option disabled>Select</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="parents_education1">Highest Education</label>
              <select
                className={styles.input}
                id="parents_education1"
                name="parents_education1"
                value={profile.parents_education1 || ""}
                onChange={handleChange}
              >
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
              <label htmlFor="parents_contact_number1">Contact Number</label>
              <input
                type="text"
                className={styles.input}
                id="parents_contact_number1"
                name="parents_contact_number1"
                value={profile.parents_contact_number1 || ""}
                onChange={handleChange}
              />
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
                <label htmlFor="guardians_name">Name</label>
                <input
                  type="text"
                  className={styles.input}
                  id="guardians_name"
                  name="guardians_name"
                  value={profile.guardians_name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="guardians_relationship">Relationship</label>
                <select
                  className={styles.input}
                  id="guardians_relationship"
                  name="guardians_relationship"
                  value={profile.guardians_relationship || ""}
                  onChange={handleChange}
                >
                  <option disabled>Select</option>
                  <option value="uncle">Uncle</option>
                  <option value="auntie">Auntie</option>
                  <option value="grandparent">Grand Parent</option>
                  <option value="relative">Other Relatives</option>
                </select>
              </div>
            </div>
            <div className={styles.row_field}>
              <div className={styles.field}>
                <label htmlFor="guardians_employer">Employer</label>
                <input
                  type="text"
                  className={styles.input}
                  id="guardians_employer"
                  name="guardians_employer"
                  value={profile.guardians_employer || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="guardians_education">Highest Education</label>
                <select
                  className={styles.input}
                  id="guardians_education"
                  name="guardians_education"
                  value={profile.guardians_education || ""}
                  onChange={handleChange}
                >
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
                <label htmlFor="guardians_contact_number">Contact Number</label>
                <input
                  type="text"
                  className={styles.input}
                  id="guardians_contact_number"
                  name="guardians_contact_number"
                  value={profile.guardians_contact_number || ""}
                  onChange={handleChange}
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
              <h3>
                At least one sibling is required.
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
                          name="siblings_name"
                          value={sibling.siblings_name || ""}
                          placeholder="Enter name"
                          className={styles.add_siblings_name}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="siblings_age"
                          value={sibling.siblings_age || ""}
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

      </div>
      {/* Navigation Buttons */}
      <div className={styles.navigation_buttons}>
        <div className={styles.step_count}>
          Step <span>{currentStep}</span> out of <span>{totalSteps}</span>
        </div>
        <div className={styles.actual_nav_buttons_holder}>
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
        </div>
      </div>
    </div>
  );
};

const Education = ({ profile, setProfile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  return (
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
            <label htmlFor="elementary_school">Last School Attended</label>
            <input
              type="text"
              id="elementary_school"
              name="elementary_school"
              value={profile.elementary_school || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.type_of_school}>
            <label htmlFor="elementary_school_type">Type of School</label>
            <select
              id="elementary_school_type"
              name="elementary_school_type"
              value={profile.elementary_school_type || ""}
              onChange={handleChange}
            >
              <option disabled>Choose</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className={styles.year_graduated}>
            <label htmlFor="elementary_year_graduated">Year Graduated</label>
            <input
              type="number"
              id="elementary_year_graduated"
              name="elementary_year_graduated"
              value={profile.elementary_year_graduated || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.junior_hs}>
        <div className={styles.subtitle}>
          <h3>Junior High School</h3>
        </div>
        <div className={styles.junior_hs_fields}>
          <div className={styles.last_school_attended}>
            <label htmlFor="junior_high_school">Last School Attended</label>
            <input
              type="text"
              id="junior_high_school"
              name="junior_high_school"
              value={profile.junior_high_school || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.type_of_school}>
            <label htmlFor="junior_high_school_type">Type of School</label>
            <select
              id="junior_high_school_type"
              name="junior_high_school_type"
              value={profile.junior_high_school_type || ""}
              onChange={handleChange}
            >
              <option disabled>Choose</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className={styles.year_graduated}>
            <label htmlFor="junior_high_school_year_graduated">Year Graduated</label>
            <input
              type="number"
              id="junior_high_school_year_graduated"
              name="junior_high_school_year_graduated"
              value={profile.junior_high_school_year_graduated || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.senior_hs}>
        <div className={styles.subtitle}>
          <h3>Senior High School</h3>
        </div>
        <div className={styles.senior_hs_fields}>
          <div className={styles.last_school_attended}>
            <label htmlFor="senior_high_school">School Attended</label>
            <input
              type="text"
              id="senior_high_school"
              name="senior_high_school"
              value={profile.senior_high_school || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.type_of_school}>
            <label htmlFor="senior_high_school_type">Type of School</label>
            <select
              id="senior_high_school_type"
              name="senior_high_school_type"
              value={profile.senior_high_school_type || ""}
              onChange={handleChange}
            >
              <option disabled>Choose</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className={styles.strand}>
            <label htmlFor="strand">Strand</label>
            <input
              type="text"
              id="strand"
              name="strand"
              placeholder="Ex. STEM"
              value={profile.strand || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.year_graduated}>
            <label htmlFor="senior_high_school_year_graduated">Year Graduated</label>
            <input
              type="number"
              id="senior_high_school_year_graduated"
              name="senior_high_school_year_graduated"
              value={profile.senior_high_school_year_graduated || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountSettings = () => (
  <div className={styles.account_settings_wrapper}>
    <div className={styles.title}>
      <h1>Account Settings</h1>
    </div>
    <div className={styles.account}>

      <div className={styles.upper_field}>
        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <div className={styles.input_and_button}>
          <input type="email" name="email" id="email" />
          <button className={styles.change_password}>Change Password</button>
          </div>
  
        </div>
      </div>

      
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>

    </div>
  </div>
);

export default Profile;
