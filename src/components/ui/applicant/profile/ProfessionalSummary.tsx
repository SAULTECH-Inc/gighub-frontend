import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../store/useAuth.ts";
import {
  CvResponseDto,
  ProfessionalSummaryData,
} from "../../../../utils/types";
import TextEditor from "../../../common/TextEditor.tsx";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { FileText, Edit3, Save, CheckCircle2, User } from "lucide-react";
import { useProfileCompletionDetails } from "../../../../hooks/useProfileCompletionDetails.ts";

const ProfessionalSummary: React.FC = () => {
  const {
    applicant,
    setProfileData,
    professionalSummaryData,
    setProfessionalSummaryData,
    updateProfessionalSummaryData,
  } = useAuth();
  const { isEditable, toggleEdit } = useSectionEditable("professional-summary");
  const [value,] = useState<string>(
    professionalSummaryData?.professionalSummary
      ? professionalSummaryData?.professionalSummary
      : "",
  );

  const {refetch} = useProfileCompletionDetails();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfessionalSummaryData({
      ...professionalSummaryData,
      [name]: value,
    } as ProfessionalSummaryData);
  };

  useEffect(() => {
    if (value) {
      setProfessionalSummaryData({
        ...professionalSummaryData,
        professionalSummary: value,
      });
    }
  }, [value]);

  const handleUpdateProfessionalSummary = async () => {
    const response = await updateProfessionalSummaryData(
      professionalSummaryData,
    );
    if (response) {
      setProfileData({
        ...applicant,
        cv: {
          ...applicant.cv,
          professionalSummary: response.professionalSummary,
        } as CvResponseDto,
      });
      setProfessionalSummaryData({
        ...professionalSummaryData,
        ...response,
      });
      toggleEdit();
      refetch().then(r=>r);
    }
  };

  return (
    <section id="professional-summary" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-500">
              Tell us about your professional background and goals
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isEditable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleUpdateProfessionalSummary}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6 rounded-xl bg-gray-50 p-6">
        {/* Professional Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <User className="h-4 w-4" />
            Professional Title
          </label>
          <input
            type="text"
            name="professionalTitle"
            value={professionalSummaryData?.professionalTitle || ""}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full rounded-lg border px-4 py-3 transition-all duration-200 ${
              isEditable
                ? "border-gray-300 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500"
                : "border-gray-200 bg-gray-100 text-gray-600"
            } focus:outline-none`}
            placeholder="e.g., Senior Software Developer, Marketing Manager, UX Designer"
          />
          <p className="text-xs text-gray-500">
            This will appear as your headline on your profile
          </p>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Professional Summary
          </label>
          <div
            className={`rounded-lg border transition-all duration-200 ${
              isEditable
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <TextEditor
              value={professionalSummaryData?.professionalSummary || ""}
              onChange={(content) => {
                setProfessionalSummaryData({
                  ...professionalSummaryData,
                  professionalSummary: content,
                } as ProfessionalSummaryData);
              }}
              disabled={!isEditable}
            />
          </div>
          <p className="text-xs text-gray-500">
            Write a compelling summary of your professional experience, skills,
            and career objectives. This helps employers understand your value
            proposition at a glance.
          </p>
        </div>

        {/* Tips Section */}
        {isEditable && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              💡 Tips for a great summary:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Keep it concise (2-3 sentences or 50-100 words)</li>
              <li>• Highlight your key achievements and skills</li>
              <li>• Mention your career goals and what you're looking for</li>
              <li>
                • Use action words and quantify your achievements when possible
              </li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && (
          <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Summary saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessionalSummary;
