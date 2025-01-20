require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const crypto = require("crypto");
const nodemailer = require("nodemailer"); // Import Nodemailer
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sessionStore = require('../src/sessionStore.js'); // Adjust the path as needed
const multer = require("multer");
const path = require("path");
const fs = require("fs");


app.use(bodyParser.json());


// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,               // Allow cookies/session
  })
);
app.use(express.json());
app.use(cookieParser());
require('dotenv').config();
const sessionSecret = process.env.SESSION_SECRET;


// Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key", // Use environment variable for security
    store: sessionStore,       // Use the Sequelize session store
    resave: false,             // Avoid unnecessary session saving
    saveUninitialized: false,  // Do not save empty sessions
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,                 // Prevent client-side access to cookies
      secure: false,                  // Set to true if using HTTPS
    },
  })
);


// Database connection
const db = mysql.createPool({
  host: "localhost", // Replace with your DB host
  user: "root", // Replace with your MySQL username
  password: "Wearefamily03", // Replace with your MySQL password
  database: "enrollment_system", // Replace with your DB name
});

// Test database connection
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

const uploadDir = path.resolve(__dirname, "../uploads");
console.log("Resolved upload directory:", uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory:", uploadDir);
}



const storage = multer.memoryStorage(); // Stores files in memory as Buffer objects

const upload = multer({ storage });

// No selection was provided, so I'll generate a code snippet that can be inserted at the cursor position.

// Example of a well-structured and readable code snippet
// This is a simple function that takes a user ID as input and returns the


app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Number of views: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send("Welcome! Refresh to count views.");
  }
});
app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT * FROM tbl_user_account WHERE user_id = ?
  `;

  try {
    const [results] = await db.query(query, [userId]);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Database error." });
  }
});

app.get("/session", async (req, res) => {
  try {
    console.log("Session Retrieved:", req.session);
    if (req.session && req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Error retrieving session:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

app.get("/protected-endpoint", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ message: "Session is valid.", user: req.session.user });
  } else {
    res.status(401).json({ message: "Unauthorized." });
  }
});


// Route with callback-style connection
app.get('/callback-route', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tbl_user_account');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route with promise-based connection
app.post('/promise-route', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tbl_user_account WHERE email = ?', [req.body.email]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// wag buburahin
// Splitting Address
function splitAddress(address) {
  const addressParts = address.split(",").map((part) => part.trim());

  if (addressParts.length < 2) {
    throw new Error(
      "Invalid address format. Please provide house number, street. Use a "," to separate them."
    );
  }

  const house_number = addressParts[0];
  const street = addressParts[1];

  return { house_number, street};
}

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "martkaws847@gmail.com", // Your Gmail address
    pass: "eebtevpxpzsaceul",     // Your 16-character App Password
  },
});

// Test email sending
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Server is ready to send emails:", success);
  }
});

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

app.get('/announcements', async (req, res) => {
  try {
    await db.query(`DELETE FROM tbl_announcements WHERE date < NOW();`);
    const [results] = await db.query(`SELECT * FROM tbl_announcements ORDER BY date DESC;`);
    res.json(results || []);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

app.get('/latest-announcement', async (req, res) => {
  try {
    const [results] = await db.query(`SELECT * FROM tbl_announcements ORDER BY date DESC LIMIT 1;`);
    res.json(results[0] || null);
  } catch (err) {
    console.error('Error fetching latest announcement:', err);
    res.status(500).json(err);
  }
});

app.get('/enrolled-count', async (req, res) => {
  const queryTotal = `
    SELECT COUNT(*) AS totalEnrolled
    FROM tbl_student_data
    WHERE status = 'enrolled'
  `;

  const queryComSci = `
    SELECT COUNT(*) AS enrolledComSci
    FROM tbl_student_data
    WHERE status = 'enrolled' AND program = '1'
  `;

  const queryIT = `
    SELECT COUNT(*) AS enrolledIT
    FROM tbl_student_data
    WHERE status = 'enrolled' AND program = '2'
  `;

  const querypaidIT = `
    SELECT COUNT(*) AS paidIT
    FROM tbl_society_fee_transaction
    WHERE payment_status = 'paid' AND program = '2'
  `;

  const querypaidComSci = `
    SELECT COUNT(*) AS paidComSci
    FROM tbl_society_fee_transaction
    WHERE payment_status = 'paid' AND program = '1'
  `;

  try {
    const [totalResult] = await db.query(queryTotal);
    const [comSciResult] = await db.query(queryComSci);
    const [itResult] = await db.query(queryIT);
    const [paidComSciResult] = await db.query(querypaidComSci);
    const [paidITResult] = await db.query(querypaidIT);

    const results = {
      totalEnrolled: totalResult[0]?.totalEnrolled || 0,
      enrolledComSci: comSciResult[0]?.enrolledComSci || 0,
      enrolledIT: itResult[0]?.enrolledIT || 0,
      paidIT: paidITResult[0]?.paidIT || 0,
      paidComSci: paidComSciResult[0]?.paidComSci || 0,
    };

    res.json(results);
  } catch (error) {
    console.error('Error fetching enrollment counts:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment counts' });
  }
});




// Endpoint to send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  const otpQuery = `
    INSERT INTO tbl_email_verification (email, otp, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))
    ON DUPLICATE KEY UPDATE otp = ?, expires_at = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
  `;

  try {
    await db.query(otpQuery, [email, otp, otp]);
    console.log("OTP saved successfully.");

    const mailOptions = {
      from: "Enrollment System <your_email@example.com>",
      to: email,
      subject: "Verify Your Email - OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 15 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("OTP email sent successfully.");
      res.status(200).json({ message: "OTP sent successfully." });
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError.message);
      res.status(500).json({ message: "Failed to send OTP email." });
    }
  } catch (dbError) {
    console.error("Error saving OTP:", dbError.message);
    res.status(500).json({ message: "Database error while saving OTP." });
  }
});

// Endpoint to verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, password, otp } = req.body;

  console.log("Request Body:", req.body); // Log incoming request data

  if (!email || !password || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email, password, and OTP are required.",
    });
  }

  const verifyQuery = `
    SELECT * FROM tbl_email_verification
    WHERE email = ? AND otp = ? AND expires_at > NOW()
  `;

  try {
    // Verify OTP
    const [results] = await db.query(verifyQuery, [email, otp]);
    console.log("OTP Verification Results:", results);

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into tbl_user_account
    const insertUserQuery = `
      INSERT INTO tbl_user_account (email, password)
      VALUES (?, ?)
    `;
    await db.query(insertUserQuery, [email, hashedPassword]);
    console.log("User inserted successfully");

    // Update OTP verification status
    const updateQuery = `UPDATE tbl_email_verification SET otp_verified = 1 WHERE email = ?`;
    await db.query(updateQuery, [email]);
    console.log("OTP verification status updated successfully");

    // Respond with success
    res.status(200).json({ success: true, message: "OTP verified and registration successful." });
  } catch (error) {
    console.error("Error:", error.message);

    // Handle specific errors
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const [rows] = await dbPromise.query(
      "SELECT * FROM tbl_email_verification WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email not found." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await dbPromise.query(
      `UPDATE tbl_email_verification 
       SET otp = ?, expires_at = DATE_ADD(NOW(), INTERVAL 15 MINUTE) 
       WHERE email = ?`,
      [otp, email]
    );

    await transporter.sendMail({
      from: "Enrollment System <your_email@example.com>",
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${otp}. It will expire in 15 minutes.`,
    });

    res.status(200).json({ message: "Verification code sent successfully." });
  } catch (error) {
    console.error("Error during password reset request:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Validate the OTP
    const [result] = await dbPromise.query(
      `SELECT * FROM tbl_email_verification
       WHERE LOWER(email) = LOWER(?) AND otp = ? AND expires_at > NOW()`,
      [email, otp]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the users table
    const [updateResult] = await dbPromise.query(
      "UPDATE tbl_user_account SET password = ? WHERE LOWER(email) = LOWER(?)",
      [hashedPassword, email]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to update the password. User not found." });
    }

    // Delete the OTP record to prevent reuse

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
});




// Registration endpoint
app.post("/register", async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    dob,
    contactNumber,
    email,
    password,
    address,
    barangay,
    city,
    province,
    postal,
    country,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !dob ||
    !contactNumber ||
    !email ||
    !password ||
    !address ||
    !barangay ||
    !city ||
    !province ||
    !postal ||
    !country
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Extract house_number and street from the address
    const { house_number, street } = splitAddress(address);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert address into the database
    const addressQuery = `
      INSERT INTO tbl_address (house_number, street, barangay, city, province, country, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [addressResult] = await db.query(addressQuery, [
      house_number,
      street,
      barangay,
      city,
      province,
      country,
      postal,
    ]);

    const addressId = addressResult.insertId;

    // Insert user data into the database
    const userQuery = `
      INSERT INTO tbl_user_account (first_name, middle_name, last_name, date_of_birth, phone_number, email, password, address_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [userResult] = await db.query(userQuery, [
      firstName,
      middleName,
      lastName,
      dob,
      contactNumber,
      email,
      hashedPassword,
      addressId,
    ]);

    const userId = userResult.insertId;

    // Insert data into tbl_student_data
    const studentQuery = `
      INSERT INTO tbl_student_data (user_id, address_id, status)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(studentQuery, [userId, addressId, "not enrolled"]);

    // Respond with success message and user details
    res.status(201).json({
      message: "Proceed to email verification.",
      userId: userId, // Send user ID for verification if needed
      email: email, // Optional: Return the email for the frontend
    });
  } catch (error) {
    console.error("Error during registration:", error.message);

    // Handle specific errors (e.g., duplicate email)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already registered." });
    }

    // General error response
    res.status(500).json({ message: "Server error." });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const query = `SELECT * FROM tbl_user_account WHERE email = ?`;

  try {
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const isProfileComplete = user.first_name && user.last_name && user.date_of_birth && user.address_id;

    // Set session data
    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      account_role: user.account_role,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err.message);
        return res.status(500).json({ message: "Session save failed." });
      }

      // Map roles to human-readable names
      const roleMap = {
        0: "student",
        1: "admin",
        2: "adviser",
        3: "officer",
        4: "guest",
      };

      res.status(200).json({
        message: "Login successful.",
        role: roleMap[user.account_role] || "unknown",
        incompleteProfile: user.account_role === 0 && !isProfileComplete,
        user: { user_id: user.user_id },
      });
    });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}); 

app.get("/check-session", async (req, res) => {
  try {
    if (req.session.user) {
      return res.status(200).json({
        message: "Session is valid",
        user: req.session.user, // Send user data back
      });
    } else {
      return res.status(401).json({ message: "Session is invalid" });
    }
  } catch (error) {
    console.error("Error checking session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get user data if authenticated
app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT * FROM tbl_user_account WHERE user_id = ?
  `;

  try {
    const [results] = await db.query(query, [userId]);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Database error." });
  }
});

// Logout endpoint
app.post('/logout', async (req, res) => {
  try {
    // Destroy the session asynchronously
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        }
        resolve(); // Resolve the promise if session is destroyed successfully
      });
    });

    // Clear the session cookie
    res.clearCookie('connect.sid'); // Clear the session cookie

    // Respond with success message
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    // Handle any errors
    console.error("Logout error:", err);
    res.status(500).json({ message: 'Failed to logout' });
  }
});

// Create a new student
app.post("/students", async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    await db.query(`INSERT INTO tbl_user_account (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)`, [firstName, lastName, email, phoneNumber]);
    res.status(201).json({ message: "Student added successfully!" });
  } catch (err) {
    console.error("Error inserting student:", err.message);
    res.status(500).json({ message: "Database error." });
  }
});

// Read all students
app.get("/students", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tbl_user_account");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).json({ message: "Database error." });
  }
});

// Update a student
app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const [results] = await db.query(`UPDATE tbl_user_account SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?`, [firstName, lastName, email, phoneNumber, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json({ message: "Student updated successfully!" });
  } catch (err) {
    console.error("Error updating student:", err.message);
    res.status(500).json({ message: "Database error." });
  }
});

// Delete a student
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query(`DELETE FROM tbl_user_account WHERE user_id = ?`, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (err) {
    console.error("Error deleting student:", err.message);
    res.status(500).json({ message: "Database error." });
  }
});

app.put('/students/:id/enroll', async (req, res) => {
  console.log('Raw student_id received:', req.params.id); // Debugging log

  const student_id = parseInt(req.params.id, 10); // Convert to integer
  console.log('Parsed student_id:', student_id);

  if (isNaN(student_id)) {
    return res.status(400).json({ message: 'Invalid student_id provided.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE tbl_student_data SET status = ? WHERE student_id = ?',
      ['enrolled', student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found or already enrolled.' });
    }

    res.status(200).json({ message: 'Student successfully enrolled.' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Failed to enroll student.' });
  }
});

// API Endpoint to post an announcement
app.post("/api/announcements", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized: No user session found." });
  }

  const { user_id } = req.session.user;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Announcement content is required." });
  }

  try {
    // Combine first name and last name for the author
    const authorQuery = `
      SELECT CONCAT(last_name, ', ', first_name) AS author
      FROM tbl_user_account
      WHERE user_id = ?
    `;
    const [authorResults] = await db.query(authorQuery, [user_id]);

    if (authorResults.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const author = authorResults[0].author;

    const query = `
      INSERT INTO tbl_announcements (author, content, date)
      VALUES (?, ?, NOW())
    `;
    await db.query(query, [author, content]);

    res.status(200).json({ message: "Announcement posted successfully." });
  } catch (error) {
    console.error("Error saving announcement:", error.message);
    res.status(500).json({ message: "Failed to save announcement." });
  }
});

app.get('/progressbar', async (req, res) => {
  try {
    // Query to get counts of male/female and regular/irregular students
    const query = `
     SELECT 
  gender, 
  student_type,
  MAX(program_name) AS program_name, 
  COUNT(*) AS total_count 
FROM 
  tbl_student_data 
GROUP BY 
  gender, student_type;
    `;
    
    const [results] = await db.query(query);
    
    // Format the result to return as gender and student type counts
    const genderStudentTypeCounts = results.reduce((acc, row) => {
      if (!acc[row.gender]) {
        acc[row.gender] = {};
      }
      acc[row.gender][row.student_type] = row.total_count;
      return acc;
    }, {});

    res.json(genderStudentTypeCounts); // Return gender and student type counts as JSON
  } catch (error) {
    console.error("Error fetching gender and student type counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/enrollees", async (req, res) => {
  try {
    // Execute the SQL query
    const [students, metadata] = await db.query(
      `
   SELECT 
  tbl_student_data.student_id, 
  tbl_user_account.first_name, 
  tbl_user_account.last_name, 
  tbl_user_account.email,
  tbl_program.program_name,
  tbl_student_data.student_type,
  tbl_student_data.student_status,
  tbl_year_level.year_level
FROM 
  tbl_student_data
JOIN 
  tbl_user_account 
ON 
  tbl_student_data.user_id = tbl_user_account.user_id
JOIN 
  tbl_program 
ON 
  tbl_student_data.program = tbl_program.program_id
JOIN 
  tbl_year_level
ON 
  tbl_student_data.year_level = tbl_year_level.year_level_id
WHERE
  tbl_student_data.status = 'not enrolled';
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/students/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, program, student_status, year_level } = req.body;

  console.log("Request body:", req.body);
if (!first_name || !last_name || !program_id || !student_status || !year_level) {
  return res.status(400).json({ message: "Missing required fields." });
}

  try {
    console.log("Request body:", req.body);
    console.log("User ID:", user_id);

    const query = `
      UPDATE tbl_student_data 
      JOIN tbl_user_account ON tbl_student_data.user_id = tbl_user_account.user_id
      SET 
        tbl_user_account.first_name = ?, 
        tbl_user_account.last_name = ?, 
        tbl_student_data.program = ?, 
        tbl_student_data.student_status = ?, 
        tbl_student_data.year_level = ?, 
      WHERE 
        tbl_student_data.user_id = ?;
    `;

    await db.query(query, [
      first_name,
      last_name,
      program,
      student_status,
      year_level,
      user_id,
    ]);

    res.status(200).json({ message: "Student updated successfully." });
  } catch (error) {
    console.error("Error updating student:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});





app.put('/students/:id/enroll', async (req, res) => {
  console.log('Raw student_id received:', req.params.id); // Debugging log

  const student_id = parseInt(req.params.id, 10); // Convert to integer
  console.log('Parsed student_id:', student_id);

  if (isNaN(student_id)) {
    return res.status(400).json({ message: 'Invalid student_id provided.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE tbl_student_data SET status = ? WHERE student_id = ?',
      ['enrolled', student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found or already enrolled.' });
    }

    res.status(200).json({ message: 'Student successfully enrolled.' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Failed to enroll student.' });
  }
});


app.get("/api/students", async (req, res) => {
  try {
    // Execute the SQL query
    const [students, metadata] = await db.query(
      `
    SELECT 
  tbl_student_data.student_id, 
  tbl_user_account.first_name, 
  tbl_user_account.last_name, 
  tbl_user_account.middle_name,
  tbl_user_account.suffix,
  tbl_user_account.email, 
  tbl_user_account.date_of_birth, 
  tbl_user_account.phone_number,
  tbl_program.program_name,
  tbl_address.house_number,
  tbl_address.street,
  tbl_address.barangay,
  tbl_address.city,
  tbl_student_data.student_type,
  tbl_student_data.year_level
FROM 
  tbl_student_data
JOIN 
  tbl_user_account 
ON 
  tbl_student_data.user_id = tbl_user_account.user_id
JOIN 
  tbl_program 
ON 
  tbl_student_data.program = tbl_program.program_id
JOIN 
  tbl_address
ON 
  tbl_student_data.address = tbl_address.address_id
WHERE
  tbl_student_data.status = 'enrolled';
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/enrollment-team", async (req, res) => {

  const roleMapping = {
    admin: 1,
    adviser: 2,
    officer: 3,
  };
  try {
    // Execute the SQL query
    const roleName = req.query.role; // Example: ?role=admin
    const roleInt = roleMapping[roleName] || null;
    const [students, metadata] = await db.query(
      `
SELECT 
  officer_id AS id, 
  first_name AS first_name, 
  middle_name AS middle_name, 
  last_name AS last_name,
  position AS position,
  account_role AS account_role  -- Added comma here
FROM 
  tbl_officer_data

UNION ALL

SELECT 
  adviser_id AS id, 
  first_name AS first_name, 
  middle_name AS middle_name, 
  last_name AS last_name,
  position AS position,
  NULL AS account_role  -- Placeholder for account_role in the adviser data
FROM 
  tbl_adviser_data;
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/schedule", async (req, res) => {
  try {
    // Execute the SQL query
    const [students, metadata] = await db.query(
      `
    SELECT 
  tbl_student_data.student_id, 
  tbl_user_account.first_name, 
  tbl_user_account.last_name, 
  tbl_student_data.Advising_date,
  tbl_program.program_name,
  tbl_student_data.student_type,
  tbl_student_data.year_level
FROM 
  tbl_student_data
JOIN 
  tbl_user_account 
ON 
  tbl_student_data.user_id = tbl_user_account.user_id
JOIN 
  tbl_program 
ON 
  tbl_student_data.program = tbl_program.program_id;
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/enrollmentstatus", async (req, res) => {
  try {
    // Execute the SQL query
    const [students, metadata] = await db.query(
      `
    SELECT 
  tbl_student_data.student_id, 
  tbl_user_account.first_name, 
  tbl_user_account.last_name, 
  tbl_student_data.status,
  tbl_program.program_name,
  tbl_student_data.student_type,
  tbl_student_data.year_level
FROM 
  tbl_student_data
JOIN 
  tbl_user_account 
ON 
  tbl_student_data.user_id = tbl_user_account.user_id
JOIN 
  tbl_program 
ON 
  tbl_student_data.program = tbl_program.program_id;
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/enrollment-team/:id', async (req, res) => {
  const studentId = req.params.id; // Get student ID from URL params
  const { role } = req.body; // Get the new role from the request body

  // SQL query to update the student's role
  const query = `
    UPDATE tbl_officer_data
    SET account_role = ?
    WHERE officer_id = ?
  `;

  try {
    const [result] = await pool.promise().query(query, [role, studentId]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Role updated successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Error updating role' });
  }
});

app.get("/api/submission", async (req, res) => {
  try {
    // Execute the SQL query
    const [students, metadata] = await db.query(
      `
    SELECT 
  tbl_student_data.student_id, 
  tbl_user_account.first_name, 
  tbl_user_account.last_name, 
  tbl_user_account.middle_name, 
  tbl_student_data.status,
  tbl_program.program_name,
  tbl_student_data.student_type,
  tbl_student_data.year_level
FROM 
  tbl_student_data
JOIN 
  tbl_user_account 
ON 
  tbl_student_data.user_id = tbl_user_account.user_id
JOIN 
  tbl_program 
ON 
  tbl_student_data.program = tbl_program.program_id;
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/advisee", async (req, res) => {
  try {
    // Execute the SQL query
    const [students, metadata] = await db.query(
      `
    SELECT 
  tbl_student_data.student_id, 
  tbl_user_account.first_name, 
  tbl_user_account.last_name, 
  tbl_user_account.middle_name, 
  tbl_student_data.Advising_status,
  tbl_program.program_name,
  tbl_student_data.student_type,
  tbl_student_data.year_level
FROM 
  tbl_student_data
JOIN 
  tbl_user_account 
ON 
  tbl_student_data.user_id = tbl_user_account.user_id
JOIN 
  tbl_program 
ON 
  tbl_student_data.program = tbl_program.program_id;
      `
    );

    // Respond with the data
    res.json(students);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  const userQuery = `
    SELECT first_name, middle_name, last_name, date_of_birth, phone_number, email, address_id, profile_picture
    FROM tbl_user_account
    WHERE user_id = ?
  `;

  try {
    const [userResults] = await db.query(userQuery, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResults[0];

    // Fetch address details
    const addressQuery = `
      SELECT house_number, street, barangay, city, province, country, postal_code
      FROM tbl_address
      WHERE address_id = ?
    `;
    const [addressResults] = await db.query(addressQuery, [user.address_id]);

    if (addressResults.length === 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    const address = addressResults[0];

    // Fetch educational attainment
    const educationQuery = `
      SELECT 
        el.last_school_attended AS elementary_school, el.school_type AS elementary_school_type, el.year_graduated AS elementary_year_graduated,
        jh.last_school_attended AS junior_high_school, jh.school_type AS junior_high_school_type, jh.year_graduated AS junior_high_year_graduated,
        sh.last_school_attended AS senior_high_school, sh.strand as senior_high_school_strand, sh.school_type AS senior_high_school_type, sh.year_graduated AS senior_high_year_graduated
      FROM tbl_educational_attainment e
      LEFT JOIN tbl_elementary_education el ON e.elementary_id = el.id
      LEFT JOIN tbl_junior_highschool_education jh ON e.junior_highschool_id = jh.id
      LEFT JOIN tbl_senior_highschool_education sh ON e.senior_highschool_id = sh.id
      WHERE e.educational_attainment_id = (SELECT educational_attainment_id FROM tbl_profile WHERE user_id = ?)
    `;
    const [educationResults] = await db.query(educationQuery, [userId]);

    // Fetch family background
    const familyQuery = `
      SELECT 
        p.name AS parent_name, p.relationship AS parent_relationship, p.highest_education AS parent_highest_education, p.contact_number AS parent_contact_number,
        g.name AS guardian_name, g.relationship AS guardian_relationship, g.employer as guardian_employer, g.highest_education AS guardian_highest_education, g.contact_number AS guardian_contact_number,
        s.name AS sibling_name, s.age AS sibling_age
      FROM tbl_family_background fb
      LEFT JOIN tbl_parents p ON fb.parent_id = p.id
      LEFT JOIN tbl_guardian g ON fb.guardian_id = g.id
      LEFT JOIN tbl_siblings s ON fb.sibling_id = s.id
      WHERE fb.family_background_id = (SELECT family_background_id FROM tbl_profile WHERE user_id = ?)
    `;
    const [familyResults] = await db.query(familyQuery, [userId]);

    res.status(200).json({ ...user, address, education: educationResults, family: familyResults });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to update user profile
app.put("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    firstName,
    middleName,
    lastName,
    suffix,
    sex,
    dob,
    contactNumber,
    address,
    barangay,
    city,
    province,
    postal,
    country,
    elementary_school,
    elementary_school_type,
    elementary_year_graduated,
    junior_high_school,
    junior_high_school_type,
    junior_high_year_graduated,
    senior_high_school,
    senior_high_school_type,
    strand,
    senior_high_year_graduated,
    parents_name,
    parents_relationship,
    parents_education,
    parents_contact_number,
    parents_name1,
    parents_relationship1,
    parents_education1,
    parents_contact_number1,
    guardians_name,
    guardians_relationship,
    guardians_employer,
    guardians_education,
    guardians_contact_number,
    siblings,
    profile_picture,
  } = req.body;

  const requiredFields = [
    "firstName",
    "lastName",
    "dob",
    "sex",
    "contactNumber",
    "address",
    "barangay",
    "city",
    "province",
    "postal",
    "country",
    "elementary_school",
    "elementary_school_type",
    "elementary_year_graduated",
    "junior_high_school",
    "junior_high_school_type",
    "junior_high_year_graduated",
    "senior_high_school",
    "senior_high_school_type",
    "strand",
    "senior_high_year_graduated",
    "parents_name",
    "parents_relationship",
    "parents_education",
    "parents_contact_number",
    "guardians_name",
    "guardians_relationship",
    "guardians_employer",
    "guardians_education",
    "guardians_contact_number",
    "siblings",
    "profile_picture",
  ];

  if (requiredFields.some((field) => !req.body[field])) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const { house_number, street } = splitAddress(address);

    const updateUserQuery = `
      UPDATE tbl_user_account
      SET first_name = ?, middle_name = ?, last_name = ?, suffix = ?, sex = ?, date_of_birth = ?, phone_number = ?, profile_picture = ?
      WHERE user_id = ?
    `;

    await db.query(updateUserQuery, [firstName, middleName, lastName, suffix, sex, dob, contactNumber, profile_picture, userId]);

    const updateAddressQuery = `
      UPDATE tbl_address
      SET house_number = ?, street = ?, barangay = ?, city = ?, province = ?, country = ?, postal_code = ?
      WHERE address_id = (SELECT address_id FROM tbl_user_account WHERE user_id = ?)
    `;

    await db.query(updateAddressQuery, [house_number, street, barangay, city, province, country, postal, userId]);

    const updateEducationQuery = `
      UPDATE tbl_educational_attainment
      SET elementary_school = ?, elementary_school_type = ?, elementary_year_graduated = ?, junior_high_school = ?, junior_high_school_type = ?, junior_high_year_graduated = ?, senior_high_school = ?, senior_high_school_type = ?, strand = ?, senior_high_year_graduated = ?
      WHERE educational_attainment_id = (SELECT educational_attainment_id FROM tbl_profile WHERE user_id = ?)
    `;

    await db.query(updateEducationQuery, [elementary_school, elementary_school_type, elementary_year_graduated, junior_high_school, junior_high_school_type, junior_high_year_graduated, senior_high_school, senior_high_school_type, strand, senior_high_year_graduated, userId]);

    const updateFamilyQuery = `
      UPDATE tbl_family_background
      SET parents_name = ?, parents_relationship = ?, parents_education = ?, parents_contact_number = ?, parents_name1 = ?, parents_relationship1 = ?, parents_education1 = ?, parents_contact_number1 = ?, guardians_name = ?, guardians_relationship = ?, guardians_employer = ?, guardians_education = ?, guardians_contact_number = ?, siblings = ?
      WHERE family_background_id = (SELECT family_background_id FROM tbl_profile WHERE user_id = ?)
    `;

    await db.query(updateFamilyQuery, [parents_name, parents_relationship, parents_education, parents_contact_number, parents_name1, parents_relationship1, parents_education1, parents_contact_number1, guardians_name, guardians_relationship, guardians_employer, guardians_education, guardians_contact_number, JSON.stringify(siblings), userId]);

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/profile/edit/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    firstName,
    middleName,
    lastName,
    suffix,
    sex,
    dob,
    contactNumber,
    address,
    barangay,
    city,
    province,
    postal,
    country,
    elementary_school,
    elementary_school_type,
    elementary_year_graduated,
    junior_high_school,
    junior_high_school_type,
    junior_high_year_graduated,
    senior_high_school,
    senior_high_school_type,
    strand,
    senior_high_year_graduated,
    parents_name,
    parents_relationship,
    parents_education,
    parents_contact_number,
    parents_name1,
    parents_relationship1,
    parents_education1,
    parents_contact_number1,
    guardians_name,
    guardians_relationship,
    guardians_employer,
    guardians_education,
    guardians_contact_number,
    siblings,
    profile_picture,
  } = req.body;

  try {
    // Check if the user_id already exists
    const checkUserQuery = "SELECT COUNT(*) AS count FROM tbl_user_account WHERE user_id = ?";
    const [checkResult] = await db.query(checkUserQuery, [userId]);

    if (checkResult.count > 0) {
      return res.status(400).json({ message: "User ID already exists. Data insertion skipped." });
    }

    const { house_number, street } = splitAddress(address);

    // Insert into tbl_user_account
    const insertUserQuery = `
      INSERT INTO tbl_user_account (user_id, first_name, middle_name, last_name, suffix, sex, date_of_birth, phone_number, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertUserQuery, [userId, firstName, middleName, lastName, suffix, sex, dob, contactNumber, profile_picture]);

    // Insert into tbl_address
    const insertAddressQuery = `
      INSERT INTO tbl_address (house_number, street, barangay, city, province, country, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [addressResult] = await db.query(insertAddressQuery, [house_number, street, barangay, city, province, country, postal]);

    // Insert into tbl_educational_attainment
    const insertEducationQuery = `
      INSERT INTO tbl_educational_attainment (elementary_school, elementary_school_type, elementary_year_graduated, junior_high_school, junior_high_school_type, junior_high_year_graduated, senior_high_school, senior_high_school_type, strand, senior_high_year_graduated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [educationResult] = await db.query(insertEducationQuery, [
      elementary_school,
      elementary_school_type,
      elementary_year_graduated,
      junior_high_school,
      junior_high_school_type,
      junior_high_year_graduated,
      senior_high_school,
      senior_high_school_type,
      strand,
      senior_high_year_graduated,
    ]);

    // Insert into tbl_family_background
    const insertFamilyQuery = `
      INSERT INTO tbl_family_background (parents_name, parents_relationship, parents_education, parents_contact_number, parents_name1, parents_relationship1, parents_education1, parents_contact_number1, guardians_name, guardians_relationship, guardians_employer, guardians_education, guardians_contact_number, siblings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertFamilyQuery, [
      parents_name,
      parents_relationship,
      parents_education,
      parents_contact_number,
      parents_name1,
      parents_relationship1,
      parents_education1,
      parents_contact_number1,
      guardians_name,
      guardians_relationship,
      guardians_employer,
      guardians_education,
      guardians_contact_number,
      JSON.stringify(siblings),
    ]);

    res.status(201).json({ message: "Profile inserted successfully." });
  } catch (error) {
    console.error("Error inserting profile:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.post("/upload-profile-picture/:userId", async (req, res) => {
  try {
    await upload(req, res);
    if (!req.file) {
      console.error("No file uploaded.");
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = `/uploads/${req.file.filename}`;
    console.log("File uploaded successfully:", filePath);

    // Proceed with database update
    const { userId } = req.params;
    const query = "UPDATE tbl_user_account SET profile_picture = ? WHERE user_id = ?";
    const [result] = await db.query(query, [filePath, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("Database update successful.");
    res.status(200).json({ profilePicture: filePath });
  } catch (err) {
    console.error("Error uploading profile picture:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.put("/api/user", async (req, res) => {
  try {
    const { user_id, studentCategory, studentId, yearLevel, program } = req.body;
    const query = `
      UPDATE tbl_student_data
      SET
        student_type = ?,
        student_id = ?,
        year_level = ?,
        program = ?
      WHERE user_id = ?;
    `;
    const result = await db.query(query, [studentCategory, studentId, yearLevel, program, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found or no changes made.");
    }

    res.status(200).json({ message: "User data saved successfully." });
  } catch (err) {
    console.error("Error saving user data:", err.message);
    res.status(500).send("Error saving user data.");
  }
});

app.post("/api/subjects", async (req, res) => {
  try {
    const { user_id, selectedSubjects } = req.body;

    for (const subject of selectedSubjects) {
      console.log("Checking subject name:", subject.name);

      const queryFindSubject = "SELECT subject_id FROM tbl_subjects WHERE subject_code = ?";
      const [rows] = await db.query(queryFindSubject, [subject.name]); // Destructure rows to access results

      console.log("Query result for subject:", rows);

      if (rows.length > 0) {
        const subjectId = rows[0].subject_id;

        console.log(`Found subject ID: ${subjectId} for subject name: ${subject.name}`);

        // Insert a new entry into the student_subjects table
        const queryInsertOrUpdate = `
          INSERT INTO tbl_student_subjects (user_id, subject_id)
          VALUES (?, ?)
        `;
        await db.query(queryInsertOrUpdate, [user_id, subjectId]);
        console.log(`Subject ${subject.name} saved successfully.`);
      } else {
        console.error(`Subject not found: ${subject.name}`);
        return res.status(404).send(`Subject ${subject.name} not found.`);
      }
    }

    res.status(200).send("Subjects saved successfully.");
  } catch (err) {
    console.error("Error saving subjects:", err.message);
    res.status(500).send("Error saving subjects.");
  }
});





// Handle file upload
app.post(
  "/api/files",
  upload.fields([
    { name: "curriculumChecklist", maxCount: 10 },
    { name: "certificateOfRegistration", maxCount: 10 },
    { name: "transcriptOfRecords", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const files = req.files;
      const userId = req.body.userId; // Assuming userId is sent in the request body

      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }

      console.log("Uploaded files:", files);
      console.log("User ID:", userId);

      // Save file information to the database
      const fileEntries = [];

      if (files.curriculumChecklist) {
        files.curriculumChecklist.forEach((file) => {
          fileEntries.push([userId, file.filename, "curriculumChecklist"]);
        });
      }

      if (files.certificateOfRegistration) {
        files.certificateOfRegistration.forEach((file) => {
          fileEntries.push([userId, file.filename, "certificateOfRegistration"]);
        });
      }

      if (files.transcriptOfRecords) {
        files.transcriptOfRecords.forEach((file) => {
          fileEntries.push([userId, file.filename, "transcriptOfRecords"]);
        });
      }

      if (fileEntries.length > 0) {
        const query = `
          INSERT INTO tbl_files (user_id, file_name, file_type)
          VALUES ?
        `;
        await db.query(query, [fileEntries]);
      }

      res.status(200).json({ message: "Files uploaded and saved successfully." });
    } catch (err) {
      console.error("Error handling file upload:", err.message, err.stack);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);



app.put("/api/advisingDate", async (req, res) => {
  try {
      const { user_id, advisingDate } = req.body;
      console.log("Received advising date:", advisingDate); // Log incoming advising date
      console.log("Received user ID:", user_id); // Log incoming user ID

      if (!advisingDate) {
          return res.status(400).send("Advising date is required.");
      }

      const query = `
          UPDATE tbl_student_data
          SET advising_date = ?
          WHERE user_id = ?;
      `;

      const result = await db.query(query, [advisingDate, user_id]);
      console.log("Advising date update result:", result); // Log database response

      res.status(200).send("Advising date saved.");
  } catch (err) {
      console.error("Error saving advising date:", err.message);
      res.status(500).send("Error saving advising date.");
  }
});
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
