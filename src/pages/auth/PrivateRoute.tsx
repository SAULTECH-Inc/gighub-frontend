import {useNavigate} from "react-router-dom";
import {useAuth} from "../../store/useAuth.ts";
import React from "react";
import {UserType} from "../../utils/types/enums.ts";

interface PrivateRouteProps {
    children: JSX.Element;
    allowedTypes?: (UserType)[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedTypes }) => {
    const { isAuthenticated, setRedirectPath } = useAuth();
    const userType = localStorage.getItem("userType") as UserType;
    const isAllowed = allowedTypes ? allowedTypes.includes(userType) : true;
    console.log("UserType :: ", userType);
    console.log("Is Allowed :: ", isAllowed);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!isAuthenticated && userType) {
            navigate(`/login`);
        }
    }, [isAuthenticated, navigate, userType]);
    React.useEffect(() => {
        setRedirectPath(location.pathname);
    }, [location.pathname]);
    return isAllowed? children : null;
};

export default PrivateRoute;
