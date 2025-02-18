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
import {Login} from "../pages/auth/Login.tsx";
import PrivateRoute from "../pages/auth/PrivateRoute.tsx";

const AppRoutes = () => {
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
                <Route path="/employer/profile" element={<PrivateRoute><EmployerProfile/></PrivateRoute>}/>
                <Route path="/applicant/profile" element={<PrivateRoute><ApplicantProfile/></PrivateRoute>}/>
                <Route path="/navbar/demo" element={<ApplicantNavBar/>}/>
                <Route path="/employer/public-profile" element={<EmployerPublicProfile/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/employer/manage-applicants" element={<ManageApplicant/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
