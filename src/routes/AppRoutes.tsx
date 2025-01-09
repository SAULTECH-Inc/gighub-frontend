import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login.tsx";
import { NotFound } from "../pages/NotFound.tsx";
import { ApplicantDashboard } from "../pages/ApplicantDashboard.tsx";
import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import { Home } from "../pages/Home.tsx";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth(); // Get the authentication status

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <ApplicantDashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
