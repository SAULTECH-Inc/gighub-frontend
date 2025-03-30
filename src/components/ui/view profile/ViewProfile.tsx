import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import ProfileDetailsExtension from "./ProfileDetailsExtension";
import {
  ArrowLeft2,
  ASAbubakar,
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../../assets/images";
import PublicProfile from "./PublicProfile";
import { Arrowleft } from "../../../assets/icons";
import { useAuth } from "../../../store/useAuth";
import TopNavBar from "../../layouts/TopNavBar";
import { applicantNavBarItemMap, applicantNavItems, applicantNavItemsMobile } from "../../../utils/constants";


  const ViewProfile: React.FC = () => {
    const [isWorksampleAvailable] = useState(true);
    const navigate = useNavigate();
    const { applicant } = useAuth();
  
    console.log("Private User Data:", JSON.stringify(applicant));
  
    return (
    <div className="bg-[#D9D9D9] flex flex-col w-full items-center gap-5">
        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile} navbarItemsMap={applicantNavBarItemMap}/>

      {isWorksampleAvailable && (
        <div className="w-full flex flex-col items-center">
           <div className="flex w-[94%] max-w-[675px] lg:max-w-[1360px] justify-between gap-2 my-5">
           <div className="flex gap-2 items-center" onClick={() => window.history.back()}>
             <img src={ArrowLeft2} alt="arrow left" />
             <p className="text-[13px] sm:text-2xl">Your Public Profile</p>
           </div>
           <button className="text-white bg-[#6438C2] py-2 px-3 sm:px-[56px] rounded-[10px] text-[13px]" onClick={() => navigate("/settings")}>
             Go to settings
           </button>
         </div>
          <div className="flex w-[94%] max-w-[1360px] gap-2">
            <div className="hidden lg:flex lg:w-[25%] mb-2">
              <ProfileDetails person={applicant} />
            </div>
            <div className="w-full lg:w-[50%]">
              <PublicProfile person={applicant} />
            </div>
            <div className="hidden lg:flex lg:w-[25%]">
              <ProfileDetailsExtension person={applicant}/>
            </div>
          </div>
        </div>
      )}

      {!isWorksampleAvailable && (
        <div className="bg-white md:my-5 max-w-[900px] w-full relative">
          <div className="sticky top-0 z-10 flex flex-col items-center w-[100%] bg-white">
            <div className="w-[100%] flex flex-col items-center">
              <div className="w-full flex flex-col h-[94px]">
                <div className="w-full h-[64px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] to-white via-50% flex items-center justify-end pr-2">
           <div className="flex w-[94%] max-w-[675px] lg:max-w-[1360px] justify-end gap-2 my-5">
           <button className="absolute top-5 left-0 text-white px-1">
             <img src={Arrowleft} alt="Arrowleft" />
           </button>
         </div>
           <div className="flex w-[94%] max-w-[675px] lg:max-w-[1360px] justify-end gap-2 my-5">
           <button className="text-white bg-[#6438C2] py-2 px-3 sm:px-[56px] rounded-[10px] text-[13px]">
             Go to settings
           </button>
         </div>
                </div>
                <img
                  src={ASAbubakar}
                  alt="ASAbubakar"
                  className="absolute w-[60px] h-[60px] top-12 left-5 sm:left-11"
                />
                        </div>
                        <div className="w-[90%] mt-4 flex justify-between gap-2">
                          <p className="font-bold text-20px]">
                            {applicant.lastName?.[0] ?? ""}.{(applicant.middleName?.[0] ?? "")} {applicant.firstName}
                          </p>
                          <p className="font-bold text-[#6438C2]">{applicant.professionalTitle}</p>
                        </div>
                        <div className="w-[90%] flex flex-col gap-2 my-2">
                          <p className="text-[#8E8E8E]">
                            {applicant.city}, {applicant.country} . {400}k Connections
                          </p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p className="font-medium">Email Address</p>
                          <p className="text-[#8E8E8E] text-[13px]">{applicant.email}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p className="font-medium">Home Address</p>
                          <p className="text-[#8E8E8E] text-[13px]">{applicant.address}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p className="font-bold">Phone number</p>
                          <p className="text-[#8E8E8E] text-[13px]">{applicant.phoneNumber}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p>Portfolio website</p>
                          <p className="text-[#6438C2] text-[13px]">{"provided portfolio"}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                <div className="w-[90%] flex flex-col gap-2">
                  <p className="mt-2 font-medium">About me</p>
                  <p className="text-[#8E8E8E] text-[13px]">{applicant.cv?.headline}</p>
                  {/* <div className="flex flex-col gap-2">
                    <p className="font-medium">Software Skills</p>
                    <div className="text-[#8E8E8E] text-[13px] flex flex-wrap">
                      {applicant.cv?.skills.join(", ")}
                    </div>
                  </div> */}
                </div>
              <div className="w-[90%] flex flex-col items-center  ">
                <p className="w-full font-bold pt-2">Job experience</p>
                <div className="w-full flex gap-3 items-center mt-2">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#F7F8FA] flex justify-center items-center">
                    <img src={Bagged} alt="Bagged" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">
                      Bachelor of communiacaion
                    </p>
                    <p className="text-[#8E8E8E] text-[13px] font-bold">
                      Paystack Inc . 2021-2023
                    </p>
                  </div>
                </div>
                <p className="w-full text-[13px]  text-[#8E8E8E] leading-[100%] font-bold my-4">
                  As a Graphic Designer at Haris Computer, I create compelling
                  visual designs for marketing, branding, and digital materials
                  to effectively communicate the company's message.
                </p>
                <hr className="w-[40%] border-[#E6E6E6]" />
                <div className="w-full flex gap-3 items-center mt-5">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#F7F8FA] flex justify-center items-center">
                    <img src={Bagged} alt="Bagged" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">
                      Bachelor of communiacaion
                    </p>
                    <p className="text-[#8E8E8E] text-[13px] font-bold">
                      Paystack Inc . 2021-2023
                    </p>
                  </div>
                </div>
                <p className="w-full text-[13px] text-[#8E8E8E] leading-[100%] font-bold my-4">
                  As a Graphic Designer at Haris Computer, I create compelling
                  visual designs for marketing, branding, and digital materials
                  to effectively communicate the company's message.
                </p>

                <button className="bg-[#6438C2] w-[40%] py-2 text-white text-[13px] rounded-[10px]">
                  See more
                </button>
                <hr className="my-5 w-full border-[#E6E6E6]" />
                <p className="w-full font-bold mb-3">Testimonies</p>
                <div className="w-[80%] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center">
                        <img src={Ellipse115} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                  </div>
                  <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                    <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
                <div className="w-[80%] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center">
                        <img src={Ellipse116} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                  </div>
                  <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                    <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
                <div className="w-[80%] flex flex-col mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center">
                        <img src={Ellipse117} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                  </div>
                  <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                    <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
