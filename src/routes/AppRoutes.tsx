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
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
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


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      <Route path="/applicant/dashboard/network" element={<ApplicantNetwork/>}/>
      <Route path="/applicant/dashboard/manageapplicant" element={<ManageApplicant/>}/>
      <Route path="/applicant/dashboard/jobselection" element={<JobSelection/>}/>
      <Route path="/notification" element={<Notification/>}/>
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
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/applicant/dashboard/network" element={<ApplicantNetwork/>}/>
                <Route path="/applicant/dashboard" element={<ApplicantDashboard/>}/>
                <Route path="/user-type-selection" element={<UserTypeSelection/>}/>
                <Route path="/applicant/signup" element={<ApplicantMultistepForm/>}/>
                <Route path="/employer/signup" element={<EmployerMultistepForm/>}/>
                <Route path="/employer/profile" element={<EmployerProfile/>}/>
                <Route path="/applicant/profile" element={<ApplicantProfile/>}/>
                <Route path="/navbar/demo" element={<ApplicantNavBar/>}/>
                <Route path="/employer/public-profile" element={<EmployerPublicProfile/>}/>
                <Route path="/employer/manage-applicants" element={<ManageApplicant/>}/>
                <Route path="/settings/account-settings" element={<AccountSettings/>}/>
                <Route path="/settings/privacy-settings" element={<PrivacySettings/>}/>
                <Route path="/settings/notification-settings" element={<NotificationSettings/>}/>
                <Route path="/settings/subscription-settings" element={<SubscriptionSettings/>}/>
                <Route path="/job-details" element={<JobDetails/>}/>
                <Route path="/job-list" element={<JobList/>}/>
                <Route path="/job-filter" element={<FilterJob/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
