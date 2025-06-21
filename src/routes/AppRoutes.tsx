import { Routes, Route } from "react-router-dom";
import { NotFound } from "../pages/auth/NotFound.tsx";
import { Home } from "../pages/Home.tsx";
import { ApplicantDashboard } from "../pages/applicant/ApplicantDashboard.tsx";
import { EmployerNetwork } from "../pages/employer/EmployerNetwork.tsx";
import UserTypeSelection from "../pages/UserTypeSelection.tsx";
import EmployerProfile from "../pages/employer/EmployerProfile.tsx";
import ApplicantProfile from "../pages/applicant/ApplicantProfile.tsx";
import ApplicantMultistepForm from "../pages/applicant/ApplicantMultistepForm.tsx";
import EmployerMultistepForm from "../pages/employer/EmployerMultistepForm.tsx";
import EmployerPublicProfile from "../pages/employer/EmployerPublicProfile.tsx";
import ManageApplicant from "../pages/employer/ManageApplicant.tsx";
import JobSelection from "../pages/applicant/JobSelection.tsx";
import Notification from "../pages/Notification.tsx";
import UserSettings from "../pages/UserSettings.tsx";
import JobDetails from "../pages/job/JobDetails.tsx";
import { Login } from "../pages/auth/Login.tsx";
import PrivateRoute from "../middleware/PrivateRoute.tsx";
import NotAuthorized from "../pages/auth/NotAuthorized.tsx";
import ForgotPassword from "../pages/auth/ForgotPassword.tsx";
import VerifyOtpToResetPassword from "../pages/auth/VerifyOtpToResetPassword.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import PasswordResetSuccess from "../pages/auth/PasswordResetSuccess.tsx";
import EmployerDashboard from "../pages/employer/EmployerDashboard.tsx";
import JobSearch from "../pages/job/JobSearch.tsx";
import { UserType } from "../utils/enums.ts";
import CompanyList from "../pages/company list/CompanyList.tsx";
import ApplicantShortList from "../pages/applicant/ApplicantShortList.tsx";
import MyApplications from "../pages/applications/MyApplications.tsx";
import PublicProfileView from "../components/ui/view profile/PublicProfileView.tsx";
import ViewProfile from "../components/ui/view profile/ViewProfile.tsx";
import Network from "../pages/network/Network.tsx";
import ScheduledInterviews from "../pages/employer/interview/ScheduledInterviews.tsx";
import JobDetailPage from "../pages/JobDetailPage.tsx";
import SubscriptionPlansView from "../pages/subscription/SubscriptionPlansView.tsx";
import HelpAndSupport from "../pages/help-and-support/HelpAndSupport.tsx";
import TermsAndConditions from "../pages/contract/TermsAndConditions.tsx";
import MySchedules from "../pages/schedules/MySchedules.tsx";
import { memo } from "react";
import ApplicantJobDetails from "../pages/applicant/ApplicantJobDetails.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/applicant/network"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT]}>
            <Network />
          </PrivateRoute>
        }
      />
      <Route
        path="/applicant/dashboard"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT]}>
            <ApplicantDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/dashboard"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <EmployerDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/user-type-selection" element={<UserTypeSelection />} />
      <Route path="/applicant/signup" element={<ApplicantMultistepForm />} />
      <Route path="/employer/signup" element={<EmployerMultistepForm />} />
      <Route path="/user/viewprofile" element={<ViewProfile />} />
      <Route
        path="/applicant/public-profile-view/:id"
        element={<PublicProfileView />}
      />
      <Route
        path="/employer/profile"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <EmployerProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/applicant/profile"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT]}>
            <ApplicantProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/employers/:employerId/:employerName/profile"
        element={<EmployerPublicProfile />}
      />
      <Route
        path="/employer/manage-applicants"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <ManageApplicant />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}>
            <UserSettings />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/jobs/job-details/:id"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <JobDetails />
          </PrivateRoute>
        }
      />
      <Route path="/notifications" element={<Notification />} />
      <Route
        path="/employer/manage-jobs"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <JobSelection />
          </PrivateRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/verify-otp-to-reset-password"
        element={<VerifyOtpToResetPassword />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/password-reset-success"
        element={<PasswordResetSuccess />}
      />
      <Route
        path="/applicant/find-jobs"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT]}>
            <JobSearch />
          </PrivateRoute>
        }
      />
      <Route
        path="/applicant/job-details/:title"
        element={<ApplicantJobDetails />}
      />
      <Route path="/employer/network" element={<EmployerNetwork />} />
      <Route
        path="/applicant/dashboard/jobselection"
        element={<JobSelection />}
      />
      <Route path="/companies" element={<CompanyList />} />
      <Route
        path="/subscriptions"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}>
            <SubscriptionPlansView />
          </PrivateRoute>
        }
      />
      <Route
        path="/help-and-support"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}>
            <HelpAndSupport />
          </PrivateRoute>
        }
      />
      {/*TermsAndConditions*/}
      <Route
        path="/term-and-conditions"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}>
            <TermsAndConditions />
          </PrivateRoute>
        }
      />
      <Route path="/jobs/:jobId/details" element={<JobDetailPage />} />
      <Route
        path="/applicant/applicant-shortlist"
        element={<ApplicantShortList />}
      />
      <Route
        path="/employer/my-schedules"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <MySchedules />
          </PrivateRoute>
        }
      />
      <Route
        path="/applicant/my-schedules"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT]}>
            <MySchedules />
          </PrivateRoute>
        }
      />
      <Route
        path="/applicant/my-applications"
        element={
          <PrivateRoute allowedRoles={[UserType.APPLICANT]}>
            <MyApplications />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer/interview-schedule/:interviewId"
        element={
          <PrivateRoute allowedRoles={[UserType.EMPLOYER]}>
            <ScheduledInterviews />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default memo(AppRoutes);
