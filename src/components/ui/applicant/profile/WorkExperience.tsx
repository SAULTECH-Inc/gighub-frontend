
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
    doFetch().then(r=>r);
  }, []);

  return (
      <section id="work-experience" className="relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
              <p className="text-sm text-gray-500">Highlight your professional experience and achievements</p>
            </div>
          </div>

          {/* Add Button */}
          <button
              type="button"
              onClick={() => openModal("add-experience-modal")}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-xl p-6">
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
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-orange-100 rounded-full">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added yet</h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add your work experience to showcase your professional background, skills, and career progression to potential employers.
                </p>
                <button
                    type="button"
                    onClick={() => openModal("add-experience-modal")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Experience
                </button>
              </div>
          )}

          {/* Add Another Button (when there are existing entries) */}
          {Array.isArray(experiences) && experiences.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => openModal("add-experience-modal")}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg font-medium hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 w-full justify-center"
                >
                  <Plus className="w-4 h-4" />
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