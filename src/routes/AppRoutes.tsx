import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Login } from "../pages/Login.tsx";
import { NotFound } from "../pages/NotFound.tsx";
// import { ApplicantDashboard } from "../pages/ApplicantDashboard.tsx";
// import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import { Home } from "../pages/Home.tsx";
import Onboarding from "../pages/Onboarding.tsx";

const AppRoutes = () => {
  // const { isAuthenticated } = useAuth(); // Get the authentication status
  return (
    <BrowserRouter>
      <Routes>
        {/*         <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
