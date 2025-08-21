import React, { useEffect } from "react";
import EducationDetails from "./EducationDetails.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import AddEducationModal from "./AddEducationModal.tsx";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { GraduationCap, Plus, BookOpen } from "lucide-react";

const Education: React.FC = () => {
  const { openModal } = useModalStore();
  const { setEducations, educations, fetchApplicantEducation } =
      useApplicantJobProfile();

  useEffect(() => {
    const doFetch = async () =>
        await fetchApplicantEducation().then((res) => setEducations(res));
    doFetch();
  }, []);

  return (
      <section id="education" className="relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              <p className="text-sm text-gray-500">Add your educational background and qualifications</p>
            </div>
          </div>

          {/* Add Button */}
          <button
              type="button"
              onClick={() => openModal("add-educational-modal")}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-xl p-6">
          {Array.isArray(educations) && educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((education, index) => (
                    <EducationDetails key={education.id || index} education={education} />
                ))}
              </div>
          ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-purple-100 rounded-full">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No education added yet</h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add your educational background to help employers understand your qualifications and academic achievements.
                </p>
                <button
                    type="button"
                    onClick={() => openModal("add-educational-modal")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Education
                </button>
              </div>
          )}

          {/* Add Another Button (when there are existing entries) */}
          {Array.isArray(educations) && educations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => openModal("add-educational-modal")}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg font-medium hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 w-full justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Education
                </button>
              </div>
          )}
        </div>

        <AddEducationModal modalId="add-educational-modal" />
      </section>
  );
};

export default Education;