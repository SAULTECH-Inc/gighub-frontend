import { BrowserRouter, Routes, Route} from "react-router-dom";
import { NotFound } from "../pages/NotFound.tsx";
import { Home } from "../pages/Home.tsx";
import {ApplicantDashboard} from "../pages/applicant/ApplicantDashboard.tsx";
import UserTypeSelection from "../pages/UserTypeSelection.tsx";
import EmployerProfile from "../pages/EmployerProfile.tsx";
import ApplicantProfile from "../pages/ApplicantProfile.tsx";
import ApplicantMultistepForm from "../pages/applicant/ApplicantMultistepForm.tsx";
import EmployerMultistepForm from "../pages/employer/EmployerMultistepForm.tsx";
import PublicProfile from "../pages/applicant/PublicProfiles.tsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      <Route path="/applicant/dashboard" element={<ApplicantDashboard/>}/>
          <Route path="/user-type-selection" element={<UserTypeSelection/>} />
          <Route path="/applicant/signup" element={<ApplicantMultistepForm/>}/>
          <Route path="/employer/signup" element={<EmployerMultistepForm/>}/>
      <Route path="/employer/profile" element={<EmployerProfile/>}/>
          <Route path="/applicant/profile" element={<ApplicantProfile/>}/>
          <Route path="/dashboard/dashboard" element={<PublicProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
