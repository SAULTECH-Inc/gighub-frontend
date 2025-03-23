import {Routes, Route, useLocation} from "react-router-dom";
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
import PrivateRoute from "../middleware/PrivateRoute.tsx";
import NotAuthorized from "../pages/auth/NotAuthorized.tsx";
import ForgotPassword from "../pages/auth/ForgotPassword.tsx";
import VerifyOtpToResetPassword from "../pages/auth/VerifyOtpToResetPassword.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import PasswordResetSuccess from "../pages/auth/PasswordResetSuccess.tsx";
import EmployerDashboard from "../pages/employer/EmployerDashboard.tsx";
import JobSearch from "../pages/JobSearch.tsx";
import {useAuth} from "../store/useAuth.ts";
import {useEffect} from "react";

import {UserType} from "../utils/enums.ts";
import ApplicantJobdetails from "../pages/applicant/ApplicantJobdetails.tsx";
import CompanyList from "../pages/company list/CompanyList.tsx";
import JobEmployerDashboard from "../components/ui/employer/JobEmployerDashboard.tsx";

const AppRoutes = () => {
    const {setRedirectPath} = useAuth();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname){
            setRedirectPath(location.pathname);
        }
    }, [location.pathname]);
    return (
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/not-authorized" element={<NotAuthorized/>}/>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/applicant/network" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><ApplicantNetwork/></PrivateRoute>}/>
                <Route path="/applicant/dashboard" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><ApplicantDashboard/></PrivateRoute>}/>
                <Route path="/employer/dashboard" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><EmployerDashboard/></PrivateRoute>}/>
                <Route path="/user-type-selection" element={<UserTypeSelection/>}/>
                <Route path="/applicant/signup" element={<ApplicantMultistepForm/>}/>
                <Route path="/employer/jobcreation" element={<JobEmployerDashboard/>}/>
                <Route path="/employer/signup" element={<EmployerMultistepForm/>}/>
                <Route path="/employer/profile" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><EmployerProfile/></PrivateRoute>}/>
                <Route path="/applicant/profile" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><ApplicantProfile/></PrivateRoute>}/>
                <Route path="/employer/public-profile" element={<EmployerPublicProfile/>}/>
                <Route path="/employer/manage-applicants" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><ManageApplicant/></PrivateRoute>}/>
                <Route path="/settings/account-settings" element={<AccountSettings/>}/>
                <Route path="/settings/privacy-settings" element={<PrivacySettings/>}/>
                <Route path="/settings/notification-settings" element={<NotificationSettings/>}/>
                <Route path="/settings/subscription-settings" element={<SubscriptionSettings/>}/>
                <Route path="/job-details" element={<JobDetails/>}/>
                <Route path="/job-list" element={<JobList/>}/>
                <Route path="/job-filter" element={<FilterJob/>}/>
                <Route path="/notification" element={<Notification/>}/>
                <Route path="/employer/manage-jobs" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><JobSelection/></PrivateRoute>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/verify-otp-to-reset-password" element={<VerifyOtpToResetPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/password-reset-success" element={<PasswordResetSuccess/>}/>
                <Route path="/applicant/find-jobs" element={<JobSearch/>}/>
                <Route path="/notification" element={<Notification/>}/>
                <Route path="/applicant/job-details/:title" element={<ApplicantJobdetails/>}/>job details
                <Route path="/applicant/dashboard/network" element={<ApplicantNetwork/>}/>
                <Route path="/applicant/dashboard/jobselection" element={<JobSelection/>}/>
                <Route path="/notification" element={<Notification/>}/>
                <Route path="/employerJobMultistepForm" element={<EmployerJobMultistepForm />}/>
                <Route path="/companylist" element={<CompanyList />} />

            </Routes>
    );
};

export default AppRoutes;
