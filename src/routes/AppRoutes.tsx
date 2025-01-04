import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from "../pages/Login.tsx";
import { NotFound } from "../pages/NotFound.tsx";
import { ApplicantDashboard } from "../pages/ApplicantDashboard.tsx";
import { useAuth } from "../hooks/useAuth";
import {Home} from "../pages/Home.tsx"; // Import the useAuth hook

const AppRoutes = () => {
    const { isAuthenticated } = useAuth(); // Get the authentication status

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
                />
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
