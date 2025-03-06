import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { UserType } from "../utils/types/enums";

interface PrivateRouteProps {
    children: JSX.Element;
    allowedTypes?: UserType[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedTypes = [] }) => {
    const { isAuthenticated, userType } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect unauthenticated users to the login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(userType as UserType)) {
        // Redirect users with unauthorized roles to an "Access Denied" page
        return <Navigate to="/access-denied" replace />;
    }

    // Render the child components for authorized users
    return children;
};

export default PrivateRoute;
