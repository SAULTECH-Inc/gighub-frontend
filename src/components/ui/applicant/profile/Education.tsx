import React, { useEffect } from "react";
import EducationDetails from "./EducationDetails.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import AddEducationModal from "./AddEducationModal.tsx";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";

const Education: React.FC = () => {
  const { openModal } = useModalStore();
  const { setEducations, educations, fetchApplicantEducation } =
    useApplicantJobProfile();
  useEffect(() => {
    const doFetch = async () =>
      await fetchApplicantEducation().then((res) => setEducations(res));
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section
      id="education"
      className="mt-4 space-y-3 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <h3 className="font-lato mb-4 text-[20px]">Education</h3>
      <div className="flex flex-col gap-y-4">
        {Array.isArray(educations) &&
          educations.map((education, index) => (
            <EducationDetails key={index} education={education} />
          ))}
      </div>
      {/* Add Education Button */}
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={() => openModal("add-educational-modal")}
          className="flex h-[39px] w-[197px] items-center rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 font-medium text-purple-600 hover:underline"
        >
          Add education
          <span className="ml-2 text-xl font-bold">+</span>
        </button>
      </div>
      <AddEducationModal modalId="add-educational-modal" />
    </section>
  );
};

export default Education;
