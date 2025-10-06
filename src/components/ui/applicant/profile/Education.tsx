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
    doFetch().then(r=>r);
  }, []);

  return (
    <section id="education" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Education</h3>
            <p className="text-sm text-gray-500">
              Add your educational background and qualifications
            </p>
          </div>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => openModal("add-educational-modal")}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      {/* Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        {Array.isArray(educations) && educations.length > 0 ? (
          <div className="space-y-4">
            {educations.map((education, index) => (
              <EducationDetails
                key={education.id || index}
                education={education}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              No education added yet
            </h4>
            <p className="mx-auto mb-6 max-w-md text-gray-500">
              Add your educational background to help employers understand your
              qualifications and academic achievements.
            </p>
            <button
              type="button"
              onClick={() => openModal("add-educational-modal")}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-purple-700"
            >
              <Plus className="h-5 w-5" />
              Add Your First Education
            </button>
          </div>
        )}

        {/* Add Another Button (when there are existing entries) */}
        {Array.isArray(educations) && educations.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => openModal("add-educational-modal")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-purple-300 px-4 py-2 font-medium text-purple-600 transition-all duration-200 hover:border-purple-400 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4" />
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
