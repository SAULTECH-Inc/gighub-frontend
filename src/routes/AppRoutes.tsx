import {Routes, Route} from "react-router-dom";
import {NotFound} from "../pages/auth/NotFound.tsx";
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
import UserSettings from "../pages/UserSettings.tsx";
import JobDetails from "../pages/job/JobDetails.tsx";
import JobList from "../pages/job/JobList.tsx";
import FilterJob from "../pages/job/FilterJob.tsx";
import {Login} from "../pages/auth/Login.tsx";
import PrivateRoute from "../middleware/PrivateRoute.tsx";
import NotAuthorized from "../pages/auth/NotAuthorized.tsx";
import ForgotPassword from "../pages/auth/ForgotPassword.tsx";
import VerifyOtpToResetPassword from "../pages/auth/VerifyOtpToResetPassword.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import PasswordResetSuccess from "../pages/auth/PasswordResetSuccess.tsx";
import EmployerDashboard from "../pages/employer/EmployerDashboard.tsx";
import JobSearch from "../pages/job/JobSearch.tsx";
import {UserType} from "../utils/enums.ts";
import ApplicantJobdetails from "../pages/applicant/ApplicantJobdetails.tsx";
import CompanyList from "../pages/company list/CompanyList.tsx";
import ApplicantShortList from "../pages/applicant/ApplicantShortList.tsx";
import MyApplications from "../pages/applicant/MyApplications.tsx";
import PublicProfileView from "../components/ui/view profile/PublicProfileView.tsx";
import ViewProfile from "../components/ui/view profile/ViewProfile.tsx";
import Network from "../pages/network/Network.tsx";

const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/not-authorized" element={<NotAuthorized/>}/>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/applicant/network" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><Network/></PrivateRoute>}/>
                <Route path="/applicant/dashboard" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><ApplicantDashboard/></PrivateRoute>}/>
                <Route path="/employer/dashboard" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><EmployerDashboard/></PrivateRoute>}/>
                <Route path="/user-type-selection" element={<UserTypeSelection/>}/>
                <Route path="/applicant/signup" element={<ApplicantMultistepForm/>}/>
                <Route path="/employer/signup" element={<EmployerMultistepForm/>}/>
                <Route path="/user/viewprofile" element={<ViewProfile/>}/>
                <Route path="/applicant/dashboard/network/publicprofileview/:id" element={<PublicProfileView/>}/>
                <Route path="/employer/profile" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><EmployerProfile/></PrivateRoute>}/>
                <Route path="/applicant/profile" element={<PrivateRoute allowedTypes={[UserType.APPLICANT]}><ApplicantProfile/></PrivateRoute>}/>
                <Route path="/employer/public-profile" element={<EmployerPublicProfile/>}/>
                <Route path="/employer/manage-applicants" element={<PrivateRoute allowedTypes={[UserType.EMPLOYER]}><ManageApplicant/></PrivateRoute>}/>
                <Route path="/settings" element={<PrivateRoute allowedTypes={[UserType.APPLICANT,UserType.EMPLOYER]}><UserSettings/></PrivateRoute>}/>
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
                <Route path="/applicant/job-details/:title" element={<ApplicantJobdetails/>}/>
                <Route path="/employer/network" element={<ApplicantNetwork/>}/>
                <Route path="/applicant/dashboard/jobselection" element={<JobSelection/>}/>
                <Route path="/companylist" element={<CompanyList />} />
                <Route path="/applicant/applicant-shortlist" element={<ApplicantShortList />} />
                <Route path="/applicant/my-applications" element={<MyApplications />} />

            </Routes>
    );
};

export default AppRoutes;
