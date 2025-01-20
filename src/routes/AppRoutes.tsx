import { BrowserRouter, Routes, Route} from "react-router-dom";
import { NotFound } from "../pages/NotFound.tsx";
import { Home } from "../pages/Home.tsx";
import {ApplicantDashboard} from "../pages/ApplicantDashboard.tsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      <Route path="/applicant/dashboard" element={<ApplicantDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
