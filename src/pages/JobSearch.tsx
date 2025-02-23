import React, {useState} from "react";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems, applicantNavItemsMobile,
} from "../utils/constants.ts";
import CustomCheckbox from "../components/common/CustomCheckbox.tsx";
import CustomRadioButton from "../components/common/CustomRadioButton.tsx";
import SalaryRangeSelector from "../components/common/SalaryRangeSelector.tsx";

const JobSearch: React.FC = () => {
    const [isChecked, setIsChecked] = React.useState(false);
    const [selectedOption, setSelectedOption] = useState("option1");
    return <>
        <ApplicantNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
                         navbarItemsMap={applicantNavBarItemMap}/>
        <div>
            <CustomCheckbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                label="Custom Checkbox"
                size={19}
                borderColor="#D9D9D9"
                checkColor="#6E4AED"
            />
            <CustomRadioButton
                name="group1"
                value="option1"
                checked={selectedOption === "option1"}
                onChange={(e) => setSelectedOption(e.target.value)}
                label="Option 1"
                size={19}
                color="#6E4AED"
            />
            <CustomRadioButton
                name="group1"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={(e) => setSelectedOption(e.target.value)}
                label="Option 1"
                size={19}
                color="#6E4AED"
            />
            <SalaryRangeSelector
                baseMin={30000}
                baseMax={150000}
                onChange={(values) => console.log(values)}
            />
        </div>
    </>
}
export default JobSearch;