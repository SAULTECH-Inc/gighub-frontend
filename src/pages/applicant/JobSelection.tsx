import React, { useState } from "react";
import { FilterIcon} from "../../assets/icons";
import { dummyListings } from "../../utils/dummyListings";
import { dummyPostListings } from "../../utils/dummyPostListing";
import JobListing from "../JobListing";
import JobPosting from "../JobPosting";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../../utils/constants.ts";

type Section = "open" | "draft";
const JobSelection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("open");

  return (
      <div className="flex flex-col gap-y-12">
        <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile}
                   navbarItemsMap={employerNavBarItemMap}/>

        <div className="w-full flex justify-center min-h-screen bg-[#F7F7F7]">

          <div className="w-[96%] sm:w-[90%] flex flex-col gap-5">
            <div
                className="w-[96%]sm:w-[90%] flex justify-between sm:bg-white rounded-[16px] sm:py-4 py-2 sm:px-4 px-2 gap-1 sm:gap-4">
              <div
                  className="border border-[#E6E6E6] bg-white sm:bg-[#F7F7F7] rounded-[10px] py-3 px-4 md:min-w-[381px]">
                <input
                    type="text"
                    placeholder="Select Job"
                    className="outline-none h-full bg-transparent placeholder:text-[#000000]"
                />
              </div>
              <div>
                <div
                    className="border border-[#E6E6E6] bg-[#FFFFFF] py-3 min-w-[59px] px-4 rounded-[10px] flex sm:hidden justify-center items-center">
                  <img src={FilterIcon} alt="filter icon"/>
                </div>
                <div className="flex justify-between gap-4">
                  <button
                      className={`py-3 px-12 rounded-[10px] hidden sm:flex ${
                          activeSection === "open"
                              ? "bg-[#6438C2] text-white"
                              : "bg-[#F7F7F7]"
                      } `}
                      onClick={() => {
                        setActiveSection("open");
                      }}
                  >
                    Open
                  </button>
                  <button
                      className={`py-3 px-12 rounded-[10px] hidden sm:flex ${
                          activeSection === "draft"
                              ? "bg-[#6438C2] text-white"
                              : "bg-[#F7F7F7]"
                      } `}
                      onClick={() => {
                        setActiveSection("draft");
                      }}
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[96%] sm:w-[100%] self-center">
              {activeSection === "open" && (
                  <div className=" bg-white px-4 pt-4 pb-[100px] rounded-[10px] flex flex-wrap justify-center gap-3">
                    <div
                        className="hidden bg-[#6438C2] text-white w-full p-2 px-4 rounded-[10px] lg:flex justify-between">
                      <div className="w-[75%] flex justify-between text-white">
                        <p className="lg:w-[150px] sm:text-[12px]">Skills Type</p>
                        <p className="lg:w-[150px] text-[12px]">Employment Type</p>
                        <p className="lg:w-[150px] text-[12px]">
                          Number of applicants
                        </p>
                        <p className="lg:w-[150px] text-[12px]">Application Date</p>
                      </div>
                      <p className="text-white lg:w-[103px] text-center">Action</p>
                    </div>
                    <div className="w-full">
                      <JobListing listings={dummyListings}/>
                    </div>
                    {" "}
                  </div>
              )}
              {activeSection === "draft" && (
                  <div className=" bg-white px-4 pt-4 pb-[100px] rounded-[10px] flex flex-wrap justify-center gap-3">
                    <div
                        className="hidden bg-[#6438C2] text-white w-full p-2 px-4 rounded-[10px] lg:flex justify-between">
                      <div className="w-[75%] flex justify-between text-white">
                        <p className="lg:w-[150px] sm:text-[12px]">Job Title</p>
                        <p className="lg:w-[150px] text-[12px]">Job Type</p>
                        <p className="lg:w-[150px] text-[12px]">
                          Progress
                        </p>
                        <p className="lg:w-[150px] text-[12px]">Saved Date</p>
                      </div>
                      <p className="text-white lg:w-[103px] text-center">Action</p>
                    </div>
                    <div className="w-full">
                      <JobPosting listings={dummyPostListings}/>
                    </div>
                    {" "}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>

  );
};

export default JobSelection;
