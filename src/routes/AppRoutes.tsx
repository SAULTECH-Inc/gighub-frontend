import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, memo } from "react";
import { UserType } from "../utils/enums.ts";
import PrivateRoute from "../middleware/PrivateRoute.tsx";

// ─── Loading fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// ─── Lazy page imports ───────────────────────────────────────────────────────
// Auth
const Login = lazy(() => import("../pages/auth/Login.tsx").then(m => ({ default: m.Login })));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword.tsx"));
const VerifyOtpToResetPassword = lazy(() => import("../pages/auth/VerifyOtpToResetPassword.tsx"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword.tsx"));
const PasswordResetSuccess = lazy(() => import("../pages/auth/PasswordResetSuccess.tsx"));
const NotFound = lazy(() => import("../pages/auth/NotFound.tsx").then(m => ({ default: m.NotFound })));
const NotAuthorized = lazy(() => import("../pages/auth/NotAuthorized.tsx"));
const SocialSignupSuccess = lazy(() => import("../pages/auth/SocialSignupSuccess.tsx"));
const SocialLoginSuccess = lazy(() => import("../pages/auth/SocialLoginSuccess.tsx"));
const TwoFactorAuth = lazy(() => import("../pages/auth/TwoFaAuth.tsx"));

// General
const HomeComponent = lazy(() => import("../pages/Home.tsx"));
const UserTypeSelection = lazy(() => import("../pages/UserTypeSelection.tsx"));
const SignupOption = lazy(() => import("../pages/SignupOption.tsx"));
const Notification = lazy(() => import("../pages/Notification.tsx"));
const UserSettings = lazy(() => import("../pages/UserSettings.tsx"));
const JobDetailPage = lazy(() => import("../pages/JobDetailPage.tsx"));
const SignDocx = lazy(() => import("../pages/SignDocx.tsx"));

// Applicant
const ApplicantDashboard = lazy(() => import("../pages/applicant/ApplicantDashboard.tsx").then(m => ({ default: m.ApplicantDashboard })));
const ApplicantProfile = lazy(() => import("../pages/applicant/ApplicantProfile.tsx"));
const ApplicantMultistepForm = lazy(() => import("../pages/applicant/ApplicantMultistepForm.tsx"));
const ManageJobsAndApplicants = lazy(() => import("../pages/applicant/ManageJobsAndApplicants.tsx"));
const ApplicantShortList = lazy(() => import("../pages/applicant/ApplicantShortList.tsx"));
const ApplicantJobDetails = lazy(() => import("../pages/applicant/ApplicantJobDetails.tsx"));
const ResumeBuilder = lazy(() => import("../pages/applicant/ResumeBuilder.tsx"));
const ApplicantAssessmentPage = lazy(() => import("../pages/applicant/ApplicantAssessmentPage.tsx"));

// Employer
const EmployerDashboard = lazy(() => import("../pages/employer/EmployerDashboard.tsx"));
const EmployerProfile = lazy(() => import("../pages/employer/EmployerProfile.tsx"));
const EmployerMultistepForm = lazy(() => import("../pages/employer/EmployerMultistepForm.tsx"));
const EmployerPublicProfile = lazy(() => import("../pages/employer/EmployerPublicProfile.tsx"));
const ManageApplicant = lazy(() => import("../pages/employer/ManageApplicant.tsx"));
const GigHubEmployerDashboard = lazy(() => import("../pages/employer/dashboard-v2/DashboardV2.tsx"));
const CandidateMatchResults = lazy(() => import("../pages/employer/CandidateMatchResults.tsx"));
const EmployerAssessmentPage = lazy(() => import("../pages/employer/EmployerAssessmentPage.tsx"));
const ScheduledInterviews = lazy(() => import("../pages/employer/interview/ScheduledInterviews.tsx"));

// Jobs
const JobSearch = lazy(() => import("../pages/job/JobSearch.tsx"));
const JobDetails = lazy(() => import("../pages/job/JobDetails.tsx"));

// Shared
const Network = lazy(() => import("../pages/network/Network.tsx"));
const PublicProfileView = lazy(() => import("../components/ui/view profile/PublicProfileView.tsx"));
const ViewProfile = lazy(() => import("../components/ui/view profile/ViewProfile.tsx"));
const CompanyList = lazy(() => import("../pages/company list/CompanyList.tsx"));
const MyApplications = lazy(() => import("../pages/applications/MyApplications.tsx"));
const MySchedules = lazy(() => import("../pages/schedules/MySchedules.tsx"));
const SubscriptionPlansView = lazy(() => import("../pages/subscription/SubscriptionPlansView.tsx"));
const HelpAndSupport = lazy(() => import("../pages/help-and-support/HelpAndSupport.tsx"));
const TermsAndConditions = lazy(() => import("../pages/contract/TermsAndConditions.tsx"));

// ─── Routes ──────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeComponent />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup-option" element={<SignupOption />} />
        <Route path="/user-type-selection" element={<UserTypeSelection />} />
        <Route path="/applicant/signup" element={<ApplicantMultistepForm />} />
        <Route path="/employer/signup" element={<EmployerMultistepForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp-to-reset-password" element={<VerifyOtpToResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/auth/social/signup/callback" element={<SocialSignupSuccess />} />
        <Route path="/auth/social/login/callback" element={<SocialLoginSuccess />} />
        <Route path="/auth/verify-2fa" element={<TwoFactorAuth />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/user/viewprofile" element={<ViewProfile />} />
        <Route path="/applicant/public-profile-view/:id" element={<PublicProfileView />} />
        <Route path="/employers/:employerId/:employerName/profile" element={<EmployerPublicProfile />} />
        <Route path="/jobs/:jobId/details" element={<JobDetailPage />} />
        <Route path="/applicant/job-details/:title" element={<ApplicantJobDetails />} />
        <Route path="/applicant/applicant-shortlist" element={<ApplicantShortList />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/employer/network" element={<Network />} />
        <Route path="/sign/docx" element={<SignDocx />} />
        {/* Redirect old dashboard/jobselection path */}
        <Route path="/applicant/dashboard/jobselection" element={<Navigate to="/applicant/manage-jobs" replace />} />

        {/* Applicant protected */}
        <Route path="/applicant/dashboard" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><ApplicantDashboard /></PrivateRoute>} />
        <Route path="/applicant/profile" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><ApplicantProfile /></PrivateRoute>} />
        <Route path="/applicant/network" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><Network /></PrivateRoute>} />
        <Route path="/applicant/find-jobs" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><JobSearch /></PrivateRoute>} />
        <Route path="/applicant/manage-jobs" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><ManageJobsAndApplicants /></PrivateRoute>} />
        <Route path="/applicant/resume-builder" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><ResumeBuilder /></PrivateRoute>} />
        <Route path="/applicant/assessments" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><ApplicantAssessmentPage /></PrivateRoute>} />
        <Route path="/applicant/my-applications" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><MyApplications /></PrivateRoute>} />
        <Route path="/applicant/my-schedules" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><MySchedules /></PrivateRoute>} />
        <Route path="/applicant/interview-schedule/:interviewId" element={<PrivateRoute allowedRoles={[UserType.APPLICANT]}><ScheduledInterviews /></PrivateRoute>} />

        {/* Employer protected */}
        <Route path="/employer/dashboard" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><EmployerDashboard /></PrivateRoute>} />
        <Route path="/employer/dash" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><GigHubEmployerDashboard /></PrivateRoute>} />
        <Route path="/employer/profile" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><EmployerProfile /></PrivateRoute>} />
        <Route path="/employer/manage-applicants" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><ManageApplicant /></PrivateRoute>} />
        <Route path="/employer/manage-jobs" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><ManageJobsAndApplicants /></PrivateRoute>} />
        <Route path="/employer/assessments" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><EmployerAssessmentPage /></PrivateRoute>} />
        <Route path="/employer/my-schedules" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><MySchedules /></PrivateRoute>} />
        <Route path="/employer/interview-schedule/:interviewId" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><ScheduledInterviews /></PrivateRoute>} />
        <Route path="/employer/candidate-match-results/:jobId" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER]}><CandidateMatchResults /></PrivateRoute>} />
        <Route path="/employer/jobs/job-details/:id" element={<PrivateRoute allowedRoles={[UserType.EMPLOYER, UserType.APPLICANT]}><JobDetails /></PrivateRoute>} />

        {/* Shared protected */}
        <Route path="/settings" element={<PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}><UserSettings /></PrivateRoute>} />
        <Route path="/subscriptions" element={<PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}><SubscriptionPlansView /></PrivateRoute>} />
        <Route path="/help-and-support" element={<PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}><HelpAndSupport /></PrivateRoute>} />
        <Route path="/term-and-conditions" element={<PrivateRoute allowedRoles={[UserType.APPLICANT, UserType.EMPLOYER]}><TermsAndConditions /></PrivateRoute>} />
      </Routes>
    </Suspense>
  );
};

export default memo(AppRoutes);
