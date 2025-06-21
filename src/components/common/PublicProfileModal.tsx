import React, { useEffect, useRef, useState } from "react";
import {
  ASAbubakar,
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../assets/images";
import { Cancel } from "../../assets/icons";
import { ApplicantData } from "../../utils/types";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: ApplicantData;
}

const PublicProfileModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  person,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showAllExperiences, setShowAllExperiences] = useState(false);

  const displayExperiences = showAllExperiences
    ? person.cv?.experiences || []
    : person.cv?.experiences?.slice(0, 2) || [];

  const hasMoreExperiences = (person.cv?.experiences?.length || 0) > 2;

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 lg:hidden">
      <div
        className="relative max-h-[80vh] w-[80%] max-w-[600px] overflow-y-auto rounded-[16px] bg-white shadow-lg scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex w-[100%] flex-col items-center rounded-[16px] bg-white"
          ref={modalRef}
        >
          <div className="flex w-[100%] flex-col items-center">
            <div className="relative flex h-[120px] w-full flex-col">
              <div className="flex h-[64px] w-full items-center justify-end rounded-tl-[16px] rounded-tr-[16px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] via-50% to-white pr-2">
                <img src={Cancel} alt="cancel" onClick={onClose} />
              </div>
              <img
                src={ASAbubakar}
                alt="ASAbubakar"
                className="absolute left-5 top-10 h-[60px] w-[60px]"
              />
              <div className="flex justify-between">
                <p className="pl-[90px] text-[20px] font-bold">
                  {person.lastName?.[0] ?? ""}.{person.middleName?.[0] ?? ""}{" "}
                  {person.firstName ?? ""}
                </p>
                <div className="hidden flex-col items-end px-2 sm:flex">
                  <p className="text-[13px] text-[#8E8E8E]">
                    {person.email} | {person.phoneNumber}
                  </p>
                  <div className="flex items-center gap-2 text-[13px] text-[#8E8E8E]">
                    <p className="">{person.address}</p>
                  </div>
                  <p className="text-[13px] text-[#8E8E8E]">
                    {person.city && person.city}
                    {person.city && person.country && ", "}
                    {person.country && person.country}
                    {(person.city || person.country) && " . "}
                    {400}k Connections
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-[90%] flex-col sm:hidden">
              <div className="flex flex-col gap-2">
                <p className="text-[13px] text-[#8E8E8E]">
                  {person.email} | {person.phoneNumber}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[#8E8E8E]">
                  <p className="">{person.address}</p>
                </div>
                <p className="text-[13px] text-[#8E8E8E]">
                  {person.city && person.city}
                  {person.city && person.country && ", "}
                  {person.country && person.country}
                  {(person.city || person.country) && " . "}
                  {400}k Connections
                </p>
              </div>
            </div>
            <div className="w-[90%]">
              <div className="flex w-[90%] flex-col gap-2">
                <p className="pt-2 text-[13px] font-bold sm:text-[16px]">
                  {person.professionalTitle}
                </p>
                <p className="text-[13px] font-semibold sm:text-[16px]">
                  About me
                </p>
                <div
                  className="text-[13px] text-[#8E8E8E]"
                  dangerouslySetInnerHTML={{
                    __html: person.cv?.professionalSummary || "",
                  }}
                ></div>{" "}
                <div className="flex w-full flex-col gap-2">
                  <p className="text-[13px] font-semibold sm:text-[16px]">
                    Social media handles:
                  </p>
                  <div className="flex text-[13px] text-[#6438C2]">
                    {!person.facebookProfile && (
                      <a
                        href={person?.facebookProfile ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebook className="mr-2 h-6 w-6 cursor-pointer fill-[#1877F2] text-[#8E8E8E]" />
                      </a>
                    )}
                    {!person.twitterProfile && (
                      <a
                        href={person?.twitterProfile ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <FaTwitter className="mr-2 h-6 w-6 cursor-pointer fill-[#1DA1F2] text-[#8E8E8E]" />
                      </a>
                    )}
                    {!person.linkedInProfile && (
                      <a
                        href={person?.linkedInProfile ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <FaLinkedin className="mr-2 h-6 w-6 cursor-pointer fill-[#0077B5] text-[#8E8E8E]" />
                      </a>
                    )}
                    {!person.githubProfile && (
                      <a
                        href={person?.githubProfile ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <FaGithub className="mr-2 h-6 w-6 cursor-pointer fill-[#181717] text-[#8E8E8E]" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] font-bold sm:text-[16px]">
                    Software Skills
                  </p>
                  <div className="flex flex-wrap text-[13px] text-[#8E8E8E]">
                    {person.cv?.skills.join(", ")}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-[90%] flex-col items-center">
              <p className="w-full pt-2 text-[13px] font-bold sm:text-[16px]">
                Job experience
              </p>

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
                            {experience?.position ?? ""}
                          </p>
                          <p className="text-[13px] font-bold text-[#8E8E8E]">
                            {experience?.company ?? ""} .{" "}
                            {formatExperienceDates(
                              experience?.startDate,
                              experience?.endDate,
                            )}
                          </p>
                        </div>
                      </div>
                      <div
                        className="my-4 w-full text-[13px] font-bold leading-[100%] text-[#8E8E8E]"
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
              <p className="w-full font-bold">Testimonies</p>
              <div className="flex w-[90%] flex-col gap-2">
                <div className="flex flex-col">
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
                <div className="flex flex-col">
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
                <div className="flex flex-col">
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
            <button
              className="m-4 rounded-md bg-[#FA4E09] px-[15%] py-2 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileModal;
