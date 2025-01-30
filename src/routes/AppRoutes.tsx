import { BrowserRouter, Routes, Route} from "react-router-dom";
import { NotFound } from "../pages/NotFound.tsx";
import { Home } from "../pages/Home.tsx";
import {ApplicantDashboard} from "../pages/ApplicantDashboard.tsx";
import UserTypeSelection from "../pages/UserTypeSelection.tsx";
import ApplicantMultistepForm from "../pages/ApplicantMultistepForm.tsx";
import EmployerMultistepForm from "../pages/EmployerMultistepForm.tsx";

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
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
