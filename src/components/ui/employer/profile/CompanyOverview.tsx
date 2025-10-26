import React, { useEffect, useState } from "react";
import TextEditor from "../../../common/TextEditor.tsx";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { AboutCompany } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { toast } from "react-toastify";
import {
  FileText,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Target,
} from "lucide-react";
import { useProfileCompletionDetails } from "../../../../hooks/useProfileCompletionDetails.ts";

const CompanyOverview: React.FC = () => {
  const { employer } = useAuth();
  const { aboutCompany, setAboutCompany, updateAboutCompany } =
    useEmployerProfile();
  const [value, setValue] = useState<string>(
    employer?.companyDescription || "",
  );
  const { isEditable, toggleEdit } = useSectionEditable("companyOverview");
  const {refetch} = useProfileCompletionDetails();

  useEffect(() => {
    setAboutCompany({
      companyDescription: value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSaveCompanyOverview = async () => {
    try {
      // Basic validation
      if (!value || value.trim().length < 50) {
        toast.error(
          "Company description should be at least 50 characters long.",
        );
        return;
      }

      const response = await updateAboutCompany(aboutCompany as AboutCompany);
      if (response) {
        toast.success("Company overview updated successfully!");
        toggleEdit();
        refetch().then(r=>r);
      } else {
        toast.error("Failed to update company overview. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update company overview. Please try again.");
    }
  };

  // Calculate character count and word count
  const characterCount = value?.length || 0;
  const wordCount =
    value
      ?.trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length || 0;
  const isContentValid = characterCount >= 50;

  return (
    <section id="overview" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Company Overview
            </h3>
            <p className="text-sm text-gray-500">
              Tell your story and attract the right talent
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
                : "bg-orange-50 text-orange-700 hover:bg-orange-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveCompanyOverview}
              disabled={!isContentValid}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-4">
            {/* Section Title and Guidelines */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="mb-2 flex items-center gap-2 text-lg font-medium text-gray-900">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  About Your Company
                </h4>
                <p className="mb-4 text-sm text-gray-600">
                  Describe your company's mission, values, culture, and what
                  makes you unique as an employer.
                </p>
              </div>

              {/* Character/Word Counter */}
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  <span
                    className={
                      characterCount >= 50 ? "text-green-600" : "text-amber-600"
                    }
                  >
                    {characterCount}
                  </span>
                  <span className="text-gray-400"> characters</span>
                </div>
                <div className="text-xs text-gray-400">{wordCount} words</div>
              </div>
            </div>

            {/* Text Editor */}
            <div className="space-y-2">
              <TextEditor
                disabled={!isEditable}
                value={aboutCompany?.companyDescription || ""}
                onChange={setValue}
              />

              {/* Content Guidelines */}
              {isEditable && (
                <div className="flex items-start gap-2 text-sm">
                  {!isContentValid ? (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Minimum 50 characters required ({50 - characterCount}{" "}
                        more needed)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        Great! Your description meets the minimum length
                        requirement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview - When Not Editing */}
        {!isEditable && value && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Company Description Preview
            </h4>

            <div className="prose prose-sm max-w-none">
              <div
                className="leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>

            {/* Content Stats */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{characterCount} characters</span>
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Content saved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isEditable && !value && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-500">
            <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium">
              No company description added yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Add a compelling company overview to attract top talent
            </p>
          </div>
        )}

        {/* Writing Guidelines */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-3 text-sm font-medium text-blue-800">
              ✍️ Writing Tips for Your Company Overview:
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-800">
                  <Building className="h-4 w-4" />
                  What to Include:
                </h5>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Company mission and vision</li>
                  <li>• Core values and culture</li>
                  <li>• What makes you unique</li>
                  <li>• Growth opportunities</li>
                  <li>• Work environment highlights</li>
                </ul>
              </div>

              <div>
                <h5 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-800">
                  <Target className="h-4 w-4" />
                  Best Practices:
                </h5>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Write in an engaging, authentic tone</li>
                  <li>• Highlight employee benefits and perks</li>
                  <li>• Mention career development opportunities</li>
                  <li>• Include diversity and inclusion efforts</li>
                  <li>• Keep it concise but comprehensive</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-100 p-3">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> A well-written company overview can
                increase application rates by up to 40%. Focus on what makes
                your company a great place to work!
              </p>
            </div>
          </div>
        )}

        {/* Content Quality Indicators */}
        {isEditable && value && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-3 text-sm font-medium text-green-800">
              📊 Content Quality Check:
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                {characterCount >= 50 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <span className="text-sm text-gray-700">
                  Minimum Length ({characterCount >= 50 ? "Met" : "Not Met"})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {characterCount >= 200 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <span className="text-sm text-gray-700">
                  Detailed Content (
                  {characterCount >= 200 ? "Good" : "Add More"})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {characterCount <= 1000 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <span className="text-sm text-gray-700">
                  Optimal Length ({characterCount <= 1000 ? "Good" : "Too Long"}
                  )
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && value && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Company overview saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyOverview;
