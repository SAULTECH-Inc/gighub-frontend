import React, { useState } from "react";
import {
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../../assets/images";
import { ApplicantData } from "../../../utils/types";

const ProfileDetailsExtension: React.FC<{ person: ApplicantData }> = ({
  person,
}) => {
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
    ? person.cv?.experiences || []
    : person.cv?.experiences?.slice(0, 2) || [];

  const hasMoreExperiences = (person.cv?.experiences?.length || 0) > 2;

  return (
    <div className="flex w-full flex-col items-center text-[#000000]">
      <div className="flex w-[100%] max-w-[328px] flex-col items-center rounded-[16px] bg-white py-4">
        <div className="flex w-[90%] flex-col items-center">
          <p className="w-full pt-2 font-bold">Job experience</p>
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
        <div className="flex w-[90%] flex-col">
          <hr className="my-5 w-full border-[#E6E6E6]" />
          <p className="w-full font-bold">Testimonies</p>
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
                I really love his job, his that smart guy you may be searching
                for
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
                I really love his job, his that smart guy you may be searching
                for
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
                I really love his job, his that smart guy you may be searching
                for
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsExtension;
