import JobApplied from "../../components/features/JobApplied";
import JobSearchBar from "../../components/layouts/JobSearchBar";
import TopNavBar from "../../components/layouts/TopNavBar";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import { useState } from "react";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants";
import JobMatchingForm from "../../components/layouts/JobMatchingForm";
import ApplicationSettings from "../../components/layouts/ApplicationSetting";

const Auto_Apply = () => {
    const [toggledItems, setToggledItems] = useState<{ [key: string]: boolean }>({});
    const getFormattedDate = (): string => {
        // Get current date
        const today = new Date();
        return today.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      const handleToggle = (item: string) => {
        setToggledItems((prev) => ({
            ...prev,
            [item]: !prev[item], // Toggle the state
        }));
    };

  return (
    <div>
        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap} />
        <div className="bg-[#F7F8FA] p-6 flex flex-col mt-5">
            <JobSearchBar />
            <h3 className="text-[20px] font-normal text-black my-7">Number of Jobs Applied For You: <span className="text-[#6438C2]">1500</span></h3>
            <div className="bg-white shadow-md p-6 flex flex-col gap-10 rounded-[16px]">
            {Array(7).fill("").map((index)=>(
                            <JobApplied
                            key={index} 
                            companyName="Fundy Inc"
                            jobTitle="Product Design"
                            jobType="Remote"
                            location="Lagos, Nigeria"
                            date={getFormattedDate()}
                        />
            ))}
            </div>
            <div className="mt-5">
                <hr />
                <div className="flex items-center justify-between bg-white">
                    <button className="bg-[#6438C2] h-[3rem] w-[8rem] text-white font-bold rounded-[10px] my-10">Save settings</button>
                    {["Activate Auto Apply"].map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[20px] text-[#6438C2]">{item}</span>
                                    <ToggleSwitch
                                        isOn={toggledItems[item] || false}
                                        onToggle={() => handleToggle(item)}
                                    />
                                </label>
                            ))}
                </div>
                <hr />
            </div>
            <JobMatchingForm />
            <hr className="mt-10" />
            <ApplicationSettings />
            <hr className="mt-10" />
            <div className="flex items-center justify-between mt-10">
                <div className="sm:flex items-center bg-white shadow-md p-6 rounded-[16px] hidden">
                {["Recieve notification when auto apply submit an application"].map((item, index) => (
                             <label key={index} className="flex items-center justify-between">
                                    <span className="text-[20px] text-black">{item}</span>
                                    <ToggleSwitch
                                        isOn={toggledItems[item] || false}
                                        onToggle={() => handleToggle(item)}
                                    />
                                </label>
                ))}
                </div>
                <button className="bg-[#6438C2] h-[3rem] w-[8rem] text-white font-bold rounded-[10px] my-10">Save settings</button>
            </div>
        </div>
    </div>
  )
}

export default Auto_Apply