import { Navigate, useLocation } from "react-router-dom";
import {useAuth} from "../../store/useAuth.ts";
import React from "react";
import {UserType} from "../../utils/types/enums.ts";

interface PrivateRouteProps {
    children: JSX.Element;
    allowedTypes?: (UserType)[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedTypes }) => {
    const { isAuthenticated, userType, setRedirectPath } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        setRedirectPath(location.pathname);
        return <Navigate to="/login" replace />;
    }

    if (allowedTypes && (!userType || !allowedTypes.includes(userType))) {
        const userRole = allowedTypes[0] === UserType.APPLICANT? "/applicant/dashboard" : "/dashboard";
        return <Navigate to={`${userRole}`} replace />;
    }

    return children;
};

export default PrivateRoute;
