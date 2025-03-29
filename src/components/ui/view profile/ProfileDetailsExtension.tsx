import React, { useState } from "react";
import { Ellipse115, Ellipse116, Ellipse117 } from "../../../assets/images";
import { ApplicantData } from "../../../utils/types";

const ProfileDetailsExtension: React.FC<{ person: ApplicantData }> = ({person}) => {

  const {
    cv:{
      experiences = [],
    } = {},
  } = person;

  const [showAll, setShowAll] = useState(false);

  const toggleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-full flex flex-col items-center text-[#000000]">
      <div className="bg-white w-[100%] rounded-[16px] max-w-[328px] flex flex-col items-center py-4">
      <div className="flex flex-col gap-4 my-4"></div>
      <p className="font-medium text-lg">Work Experience</p>

      {(experiences ?? []).slice(0, 3).map((exp) => (
        <div key={exp.id} className="border border-gray-300 p-4 rounded-lg shadow-md">
          <p className="font-bold text-lg">{exp.position}</p>
          <p className="text-gray-600">{exp.company} - {exp.city || exp.location}</p>
          <p className="text-gray-500 text-sm">
            {new Date(exp.startDate || "").toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate || "").toLocaleDateString() : "Present"}
          </p>
          {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
        </div>
      ))}

      {(experiences ?? []).length > 3 && (
        <>
          {showAll ? (
            <div className="border border-gray-300 p-4 rounded-lg shadow-md h-[200px] overflow-y-auto">
              {(experiences?.slice(3) || []).map((exp) => (
                <div key={exp.id} className="border-b border-gray-300 pb-4 mb-4 last:border-none">
                  <p className="font-bold text-lg">{exp.position}</p>
                  <p className="text-gray-600">{exp.company} - {exp.city || exp.location}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(exp.startDate || "").toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                  </p>
                  {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                </div>
              ))}
            </div>
          ) : null}

          <button
            className="bg-[#6438C2] text-white font-medium py-2 px-4 rounded-md mt-4 self-start"
            onClick={toggleShowMore}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
          <hr className="my-5 w-full border-[#E6E6E6]" />
          <p className="w-full font-bold">Testimonies</p>
          <div className="flex flex-col">
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
                I really love his job, his that smart guy you may be searching
                for
              </p>
            </div>
          </div>
          <div className="flex flex-col">
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
                I really love his job, his that smart guy you may be searching
                for
              </p>
            </div>
          </div>
          <div className="flex flex-col">
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
                I really love his job, his that smart guy you may be searching
                for
              </p>
            </div>
          </div>
      </>
      )}
    </div>
    </div>
  );
};

export default ProfileDetailsExtension;
