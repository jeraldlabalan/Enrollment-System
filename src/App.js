import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./General/Login/Login";
import Homepage from "./Homepage";
import Register from "./Student/Register/Register";
import EmailVerification from "./Student/EmailVerification/EmailVerification";
import SubmissionAndSubject from "./Student/SubmissionAndSubject/SubmissionAndSubject";
import Landingpage from "./General/LandingPage/Landingpage";
import AnnouncementsPage from "./General/Announcement/AnnouncementsPage";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Home from "./Student/Home/Home";
import Enrollees from "./Admin/Enrollees/Enrollees";
import { Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import SuccessRegular from "./Student/SubmissionAndSubject/SuccessRegular";
import SuccessIrregular from "./Student/SubmissionAndSubject/SuccessIrregular";
import UploadRegular from  "./Student/SubmissionAndSubject/UploadRegular";
import UploadIrregular from  "./Student/SubmissionAndSubject/UploadIrregular";
import Profile from "./Student/Profile/Profile";
import StatusAndScheduling from "./Student/StatusAndScheduling/StatusAndScheduling";
import EnrollmentTeam from "./Admin/EnrollmentTeam/EnrollmentTeam";
import A_Dashboard from "./Adviser/A_Dashboard/Dashboard";
import A_Submission from "./Adviser/A_Submission/Submission";
import Advisee from "./Adviser/Advisee/Advisee";
import Students from "./Admin/Students/Students";
import EnrollmentStatusCS from "./SocietyOfficer/EnrollmentStatus/EnrollmentStatusCS";
import ScheduleCS from "./SocietyOfficer/Schedule/ScheduleCS";
import AdmissionAndFaqs from "./Student/AdmissionAndFaqs/AdmissionAndFaqs";
import ODashboard from "./SocietyOfficer/O_Dashboard/ODashboard";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emailverification" element={<EmailVerification />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Students" element={<Students />} />
        <Route
          path="/submissionandsubject"
          element={<SubmissionAndSubject />}
        />

        <Route
          path="/statusandscheduling"
          element={<StatusAndScheduling />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/SuccessRegular" element={<SuccessRegular />} />
        <Route path="/SuccessIrregular" element={<SuccessIrregular />} />
        <Route path="/UploadRegular" element={<UploadRegular />} />
        <Route path="/UploadIrregular" element={<UploadIrregular />} />
        <Route path="/enrollees" element={<Enrollees />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/enrollmentteam" element={<EnrollmentTeam />} />
        <Route path="/aDashboard" element={<A_Dashboard />} />
        <Route path="/aSubmission" element={<A_Submission />} />
        <Route path="/Advisee" element={<Advisee />} />
        <Route path="/EnrollmentStatusCS" element={<EnrollmentStatusCS />} />
        <Route path="/ScheduleCS" element={<ScheduleCS />} />
        <Route path="/AdmissionAndFaqs" element={<AdmissionAndFaqs />} />
        <Route path="/schedulecs" element={<ScheduleCS />} />
        <Route path="/odashboard" element={<ODashboard />} />
      </Routes>
   
  );
}

export default App;
