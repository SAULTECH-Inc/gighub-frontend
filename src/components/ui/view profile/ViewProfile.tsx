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
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../../utils/constants";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const ViewProfile: React.FC = () => {
  const [isWorksampleAvailable] = useState(false);
  const navigate = useNavigate();
  const { applicant } = useAuth();
  const [showAllExperiences, setShowAllExperiences] = useState(false);

  const formatExperienceDates = (
    startDate: Date | string | undefined,
    endDate: Date | string | undefined,
  ) => {
    const startYear =
      startDate instanceof Date ? startDate.getFullYear() : startDate;
    const endYear = endDate instanceof Date ? endDate.getFullYear() : endDate;

    if (startYear && endYear && startYear !== endYear) {
      return `${startYear} - ${endYear}`;
    } else if (startYear && endYear && startYear === endYear) {
      return `${startYear}`;
    } else if (startYear) {
      return `${startYear}`;
    } else if (endYear) {
      return `${endYear}`;
    } else {
      return "";
    }
  };

  const displayExperiences = showAllExperiences
    ? applicant.cv.experiences || []
    : applicant.cv?.experiences?.slice(0, 2) || [];

  const hasMoreExperiences = (applicant.cv?.experiences?.length || 0) > 2;

  console.log("Private User Data:", JSON.stringify(applicant));
  const v = 400;
  let shortDetail = "";
  if (applicant.city) {
    shortDetail += applicant.city;
  }
  if (applicant.country) {
    shortDetail += ", " + applicant.country + ". ";
  }
  if (v >= 300) {
    shortDetail += 400 + "k Connections";
  }

  return (
    <div className="flex w-full flex-col items-center gap-5 bg-[#F7F8FA]">
      <div className="w-full">
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      </div>
      {isWorksampleAvailable && (
        <div className="flex w-full flex-col items-center">
          <div className="my-5 flex w-[94%] max-w-[675px] justify-between gap-2 lg:max-w-[1360px]">
            <div
              className="flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <img src={ArrowLeft2} alt="arrow left" />
              <p className="text-[13px] sm:text-2xl">Your Public Profile</p>
            </div>
            <button
              className="rounded-[10px] bg-[#6438C2] px-3 py-2 text-[13px] text-white sm:px-[56px]"
              onClick={() => navigate("/settings")}
            >
              Go to settings
            </button>
          </div>
          <div className="flex w-[94%] max-w-[1360px] gap-2">
            <div className="mb-2 hidden lg:flex lg:w-[25%]">
              <ProfileDetails person={applicant} />
            </div>
            <div className="w-full lg:w-[50%]">
              <PublicProfile person={applicant} />
            </div>
            <div className="hidden lg:flex lg:w-[25%]">
              <ProfileDetailsExtension person={applicant} />
            </div>
          </div>
        </div>
      )}

      {!isWorksampleAvailable && (
        <div className="relative w-full max-w-[1000px] bg-white md:my-5">
          <div className="sticky top-0 z-10 flex w-[100%] flex-col items-center bg-white">
            <div className="flex w-[100%] flex-col items-center">
              <div className="flex h-[94px] w-full flex-col">
                <div className="flex h-[64px] w-full items-center justify-end bg-gradient-to-r from-[#6438C2] via-[#6438C2] via-50% to-white pr-2">
                  <div className="my-5 flex w-[94%] max-w-[675px] justify-end gap-2 lg:max-w-[1360px]">
                    <button
                      className="absolute top-5 left-0 px-1 text-white"
                      onClick={() => window.history.back()}
                    >
                      <img src={Arrowleft} alt="Arrowleft" />
                    </button>
                  </div>
                  <div className="my-5 flex w-[94%] max-w-[675px] justify-end gap-2 lg:max-w-[1360px]">
                    <button
                      className="rounded-[10px] bg-[#6438C2] px-3 py-2 text-[13px] text-white sm:px-[56px]"
                      onClick={() => navigate("/settings")}
                    >
                      Go to settings
                    </button>
                  </div>
                </div>
                <img
                  src={ASAbubakar}
                  alt="ASAbubakar"
                  className="absolute top-12 left-5 h-[60px] w-[60px] sm:left-11"
                />
              </div>
              <div className="mt-4 flex w-[90%] justify-between gap-2">
                <p className="text-20px] font-bold">
                  {applicant.lastName?.[0] ?? ""}.
                  {applicant.middleName?.[0] ?? ""} {applicant.firstName}
                </p>
                <p className="font-bold text-[#6438C2]">
                  {applicant.professionalTitle}
                </p>
              </div>
              <div className="my-2 flex w-[90%] flex-col gap-2">
                <p className="text-[#8E8E8E]">{shortDetail}</p>
              </div>
              <hr className="w-[90%] border-[#E6E6E6]" />
              <div className="my-4 flex w-[90%] flex-col gap-2">
                <p className="font-medium">Email Address</p>
                <p className="text-[13px] text-[#8E8E8E]">{applicant.email}</p>
              </div>
              <hr className="w-[90%] border-[#E6E6E6]" />
              <div className="my-4 flex w-[90%] flex-col gap-2">
                <p className="font-medium">Home Address</p>
                <p className="text-[13px] text-[#8E8E8E]">
                  {applicant.address}
                </p>
              </div>
              <hr className="w-[90%] border-[#E6E6E6]" />
              <div className="my-4 flex w-[90%] flex-col gap-2">
                <p className="font-bold">Phone number</p>
                <p className="text-[13px] text-[#8E8E8E]">
                  {applicant.phoneNumber}
                </p>
              </div>
              <hr className="w-[90%] border-[#E6E6E6]" />
              <div className="flex w-[90%] flex-col gap-2">
                <p className="font-bold">About me</p>
                <div
                  className="text-[13px] text-[#8E8E8E]"
                  dangerouslySetInnerHTML={{
                    __html: applicant.cv?.professionalSummary || "",
                  }}
                ></div>
              </div>
              <hr className="w-[90%] border-[#E6E6E6]" />
              <div className="my-4 flex w-[90%] flex-col gap-2">
                <p className="text-[13px] font-semibold sm:text-[16px]">
                  Social media handles
                </p>
                <div className="flex gap-5 text-[13px] text-[#6438C2]">
                  {!applicant.facebookProfile && (
                    <a
                      href={applicant?.facebookProfile ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="mr-2 h-5 w-5 cursor-pointer fill-[#1877F2] text-[#8E8E8E]" />
                    </a>
                  )}
                  {!applicant.twitterProfile && (
                    <a
                      href={applicant?.twitterProfile ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      <FaTwitter className="mr-2 h-5 w-5 cursor-pointer fill-[#1DA1F2] text-[#8E8E8E]" />
                    </a>
                  )}
                  {!applicant.linkedInProfile && (
                    <a
                      href={applicant?.linkedInProfile ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      <FaLinkedin className="mr-2 h-5 w-5 cursor-pointer fill-[#0077B5] text-[#8E8E8E]" />
                    </a>
                  )}
                  {!applicant.githubProfile && (
                    <a
                      href={applicant?.githubProfile ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      <FaGithub className="mr-2 h-5 w-5 cursor-pointer fill-[#181717] text-[#8E8E8E]" />
                    </a>
                  )}
                </div>
                <hr className="w-full border-[#E6E6E6]" />
                <div className="my-4 flex flex-col gap-2">
                  <p className="font-bold">Software Skills</p>
                  <div className="flex flex-wrap text-[13px] text-[#8E8E8E]">
                    {applicant?.cv?.skills && applicant?.cv?.skills.join(", ")}
                  </div>
                </div>
              </div>
              <div className="flex w-[90%] flex-col items-center">
                <p className="w-full pt-2 font-bold">Job experience</p>
                <div className="flex w-[90%] flex-col items-center">
                  <div
                    className={`w-full ${showAllExperiences ? "max-h-[300px] overflow-y-auto pr-2" : ""}`}
                  >
                    {displayExperiences.map((experience, index) => (
                      <div key={experience.id || index}>
                        <div className="mt-2 flex w-full items-center gap-3">
                          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F7F8FA]">
                            <img src={Bagged} alt="Bagged" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold">
                              {experience.position ?? ""}
                            </p>
                            <p className="text-[13px] font-bold text-[#8E8E8E]">
                              {experience?.company ?? ""} .{" "}
                              {formatExperienceDates(
                                experience.startDate,
                                experience.endDate,
                              )}
                            </p>
                          </div>
                        </div>
                        <div
                          className="my-4 w-full text-[13px] leading-[100%] font-bold text-[#8E8E8E]"
                          dangerouslySetInnerHTML={{
                            __html: experience?.description || "",
                          }}
                        ></div>
                        {index < displayExperiences.length - 1 && (
                          <div className="flex w-full justify-center">
                            <hr className="w-[40%] border-[#E6E6E6]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {hasMoreExperiences && (
                    <button
                      className="mt-3 w-[40%] rounded-[10px] bg-[#6438C2] py-2 text-[13px] text-white"
                      onClick={() => setShowAllExperiences(!showAllExperiences)}
                    >
                      {showAllExperiences ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                <hr className="my-5 w-full border-[#E6E6E6]" />
                <p className="mb-3 w-full font-bold">Testimonies</p>
                <div className="flex w-[90%] flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center">
                        <img src={Ellipse115} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[13px] text-[#8E8E8E]">2:20 Am</p>
                  </div>
                  <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                    <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
                <div className="flex w-[90%] flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center">
                        <img src={Ellipse116} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[13px] text-[#8E8E8E]">2:20 Am</p>
                  </div>
                  <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                    <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
                <div className="mb-2 flex w-[90%] flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center">
                        <img src={Ellipse117} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[13px] text-[#8E8E8E]">2:20 Am</p>
                  </div>
                  <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                    <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
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
