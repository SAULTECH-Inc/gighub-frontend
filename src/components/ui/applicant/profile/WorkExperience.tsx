import React, { useEffect } from "react";
import WorkExperienceDetails from "./WorkExperienceDetails.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import AddExperienceModal from "./AddExperienceModal.tsx";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { Briefcase, Plus, TrendingUp } from "lucide-react";

const WorkExperience: React.FC = () => {
  const { openModal } = useModalStore();
  const { experiences, setExperiences, fetchExperiences } =
    useApplicantJobProfile();

  useEffect(() => {
    const doFetch = async () =>
      await fetchExperiences().then((res) => setExperiences(res));
    doFetch().then((r) => r);
  }, []);

  return (
    <section id="work-experience" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2">
            <Briefcase className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Work Experience
            </h3>
            <p className="text-sm text-gray-500">
              Highlight your professional experience and achievements
            </p>
          </div>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => openModal("add-experience-modal")}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {/* Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        {Array.isArray(experiences) && experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <div key={experience.id || index}>
                <WorkExperienceDetails experienceData={experience} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-orange-100 p-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              No work experience added yet
            </h4>
            <p className="mx-auto mb-6 max-w-md text-gray-500">
              Add your work experience to showcase your professional background,
              skills, and career progression to potential employers.
            </p>
            <button
              type="button"
              onClick={() => openModal("add-experience-modal")}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-orange-700"
            >
              <Plus className="h-5 w-5" />
              Add Your First Experience
            </button>
          </div>
        )}

        {/* Add Another Button (when there are existing entries) */}
        {Array.isArray(experiences) && experiences.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => openModal("add-experience-modal")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-orange-300 px-4 py-2 font-medium text-orange-600 transition-all duration-200 hover:border-orange-400 hover:bg-orange-50"
            >
              <Plus className="h-4 w-4" />
              Add Another Experience
            </button>
          </div>
        )}
      </div>

      <AddExperienceModal modalId="add-experience-modal" />
    </section>
  );
};

export default WorkExperience;
