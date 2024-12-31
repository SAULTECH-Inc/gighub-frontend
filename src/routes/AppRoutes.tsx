import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Home} from "../pages/Home.tsx";
import {Login} from "../pages/Login.tsx";
import {NotFound} from "../pages/NotFound.tsx";

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
