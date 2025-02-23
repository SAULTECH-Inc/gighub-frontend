import {BrowserRouter, Routes, Route} from "react-router-dom";
import {NotFound} from "../pages/NotFound.tsx";
import {Home} from "../pages/Home.tsx";
import {ApplicantDashboard} from "../pages/applicant/ApplicantDashboard.tsx";
import {ApplicantNetwork} from "../pages/applicant/ApplicantNetwork.tsx";
import UserTypeSelection from "../pages/UserTypeSelection.tsx";
import EmployerProfile from "../pages/employer/EmployerProfile.tsx";
import ApplicantProfile from "../pages/applicant/ApplicantProfile.tsx";
import ApplicantMultistepForm from "../pages/applicant/ApplicantMultistepForm.tsx";
import EmployerMultistepForm from "../pages/employer/EmployerMultistepForm.tsx";
import EmployerPublicProfile from "../pages/employer/EmployerPublicProfiles.tsx";
import ManageApplicant from "../pages/applicant/ManageApplicant.tsx";
import JobSelection from "../pages/applicant/JobSelection.tsx";
import Notification from "../pages/Notification.tsx"
import AccountSettings from "../pages/AccountSettings.tsx";
import PrivacySettings from "../pages/PrivacySettings.tsx";
import NotificationSettings from "../pages/NotificationSettings.tsx";
import SubscriptionSettings from "../pages/SubscriptionSettings.tsx";
import JobDetails from "../pages/JobDetails.tsx";
import JobList from "../pages/JobList.tsx";
import FilterJob from "../pages/FilterJob.tsx";
import {Login} from "../pages/auth/Login.tsx";
import PrivateRoute from "../pages/auth/PrivateRoute.tsx";
import {UserType} from "../utils/types/enums.ts";
import NotAuthorized from "../pages/auth/NotAuthorized.tsx";
import ForgotPassword from "../pages/auth/ForgotPassword.tsx";
import VerifyOtpToResetPassword from "../pages/auth/VerifyOtpToResetPassword.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import PasswordResetSuccess from "../pages/auth/PasswordResetSuccess.tsx";
import EmployerDashboard from "../pages/employer/EmployerDashboard.tsx";
import JobSearch from "../pages/JobSearch.tsx";

import EmployerJobMultistepForm from "../pages/employer/EmployerJobMultistepForm.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/not-authorized" element={<NotAuthorized/>}/>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/applicant/dashboard/network" element={<ApplicantNetwork/>}/>
                <Route path="/applicant/dashboard" element={<ApplicantDashboard/>}/>
                <Route path="/employer/dashboard" element={<EmployerDashboard/>}/>
                <Route path="/user-type-selection" element={<UserTypeSelection/>}/>
                <Route path="/applicant/signup" element={<ApplicantMultistepForm/>}/>
                <Route path="/employer/signup" element={<EmployerMultistepForm/>}/>
                <Route path="/employer/profile" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><EmployerProfile/></PrivateRoute>}/>
                <Route path="/applicant/profile" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><ApplicantProfile/></PrivateRoute>}/>
                <Route path="/employer/public-profile" element={<EmployerPublicProfile/>}/>
                <Route path="/employer/manage-applicants" element={<ManageApplicant/>}/>
                <Route path="/settings/account-settings" element={<AccountSettings/>}/>
                <Route path="/settings/privacy-settings" element={<PrivacySettings/>}/>
                <Route path="/settings/notification-settings" element={<NotificationSettings/>}/>
                <Route path="/settings/subscription-settings" element={<SubscriptionSettings/>}/>
                <Route path="/job-details" element={<JobDetails/>}/>
                <Route path="/job-list" element={<JobList/>}/>
                <Route path="/job-filter" element={<FilterJob/>}/>
                <Route path="/notification" element={<Notification/>}/>
                <Route path="/applicant/dashboard/jobselection" element={<JobSelection/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/verify-otp-to-reset-password" element={<VerifyOtpToResetPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/password-reset-success" element={<PasswordResetSuccess/>}/>
                <Route path="/applicant/find-jobs" element={<JobSearch/>}/>
            </Routes>
        </BrowserRouter>
    );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      <Route path="/applicant/dashboard/network" element={<ApplicantNetwork/>}/>
      <Route path="/applicant/dashboard/manageapplicant" element={<ManageApplicant/>}/>
      <Route path="/applicant/dashboard/jobselection" element={<JobSelection/>}/>
      <Route path="/notification" element={<Notification/>}/>
      <Route path="/employerJobMultistepForm" element={<EmployerJobMultistepForm />}/>
      <Route path="/applicant/dashboard" element={<ApplicantDashboard/>}/>
          <Route path="/user-type-selection" element={<UserTypeSelection/>} />
          <Route path="/applicant/signup" element={<ApplicantMultistepForm/>}/>
          <Route path="/employer/signup" element={<EmployerMultistepForm/>}/>
      <Route path="/employer/profile" element={<EmployerProfile/>}/>
          <Route path="/applicant/profile" element={<ApplicantProfile/>}/>
          <Route path="/navbar/demo" element={<ApplicantNavBar/>}/>
          <Route path="/dashboard/dashboard" element={<EmployerPublicProfile/>}/>
          <Route path="/employer/public-profile" element={<EmployerPublicProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
