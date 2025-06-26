import React, { useEffect } from "react";
import WorkExperienceDetails from "./WorkExperienceDetails.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import AddExperienceModal from "./AddExperienceModal.tsx";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";

const WorkExperience: React.FC = () => {
  const { openModal } = useModalStore();
  const { experiences, setExperiences, fetchExperiences } =
    useApplicantJobProfile();
  useEffect(() => {
    const doFetch = async () =>
      await fetchExperiences().then((res) => setExperiences(res));
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="work-experience"
      className="relative mt-4 space-y-3 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <h3 className="font-lato mb-4 text-[20px]">Work Experience</h3>
      <div className="flex flex-col gap-y-4">
        {Array.isArray(experiences) &&
          experiences.map((experience, index) => (
            <WorkExperienceDetails key={index} experienceData={experience} />
          ))}
      </div>
      {/* Add Education Button */}
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={() => openModal("add-experience-modal")}
          className="flex h-[39px] w-[197px] items-center rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 font-medium text-purple-600 hover:underline"
        >
          Add experience
          <span className="ml-2 text-xl font-bold">+</span>
        </button>
      </div>
      <AddExperienceModal modalId="add-experience-modal" />
    </section>
  );
};

export default WorkExperience;
