import {FC} from "react";
import GighubLogo from "../../assets/icons/GighubLogo.svg"
import OperatorNavs from "../common/OperatorNavs.tsx";
const ApplicantNavBar: FC = ()=>{
    return (
        <>
        <nav>
            <img src={GighubLogo} alt="Gighub Logo" className="w-fit h-auto"/>

            <ul className="flex gap-8 text-gray-700">
                <li>Dashboard</li>
                <li>Find Jobs</li>
                <li>Applications</li>
                <li>My Networks</li>
                <OperatorNavs/>
            </ul>
        </nav>
        </>
    );
}

export default ApplicantNavBar;