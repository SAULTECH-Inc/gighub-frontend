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

const AutoApply = () => {
  const [toggledItems, setToggledItems] = useState<{ [key: string]: boolean }>(
    {},
  );
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
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="mt-5 flex flex-col bg-[#F7F8FA] p-6">
        <JobSearchBar />
        <h3 className="my-7 text-[20px] font-normal text-black">
          Number of Jobs Applied For You:{" "}
          <span className="text-[#6438C2]">1500</span>
        </h3>
        <div className="flex flex-col gap-10 rounded-[16px] bg-white p-6 shadow-md">
          {Array(7)
            .fill("")
            .map((index) => (
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
            <button className="my-10 h-[3rem] w-[8rem] rounded-[10px] bg-[#6438C2] font-bold text-white">
              Save settings
            </button>
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
        <div className="mt-10 flex items-center justify-between">
          <div className="hidden items-center rounded-[16px] bg-white p-6 shadow-md sm:flex">
            {["Receive notification when auto apply submit an application"].map(
              (item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[20px] text-black">{item}</span>
                  <ToggleSwitch
                    isOn={toggledItems[item] || false}
                    onToggle={() => handleToggle(item)}
                  />
                </label>
              ),
            )}
          </div>
          <button className="my-10 h-[3rem] w-[8rem] rounded-[10px] bg-[#6438C2] font-bold text-white">
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoApply;
