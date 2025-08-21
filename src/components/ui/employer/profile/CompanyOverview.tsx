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
  Target
} from "lucide-react";

const CompanyOverview: React.FC = () => {
  const { employer } = useAuth();
  const { aboutCompany, setAboutCompany, updateAboutCompany } = useEmployerProfile();
  const [value, setValue] = useState<string>(employer?.companyDescription || "");
  const { isEditable, toggleEdit } = useSectionEditable("companyOverview");

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
        toast.error("Company description should be at least 50 characters long.");
        return;
      }

      const response = await updateAboutCompany(aboutCompany as AboutCompany);
      if (response) {
        toast.success("Company overview updated successfully!");
        toggleEdit();
      } else {
        toast.error("Failed to update company overview. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update company overview. Please try again.");
    }
  };

  // Calculate character count and word count
  const characterCount = value?.length || 0;
  const wordCount = value?.trim().split(/\s+/).filter(word => word.length > 0).length || 0;
  const isContentValid = characterCount >= 50;

  return (
    <section id="overview" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Company Overview</h3>
            <p className="text-sm text-gray-500">Tell your story and attract the right talent</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isEditable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditable ? 'Cancel' : 'Edit'}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveCompanyOverview}
              disabled={!isContentValid}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="space-y-4">
            {/* Section Title and Guidelines */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  About Your Company
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Describe your company's mission, values, culture, and what makes you unique as an employer.
                </p>
              </div>

              {/* Character/Word Counter */}
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  <span className={characterCount >= 50 ? 'text-green-600' : 'text-amber-600'}>
                    {characterCount}
                  </span>
                  <span className="text-gray-400"> characters</span>
                </div>
                <div className="text-xs text-gray-400">
                  {wordCount} words
                </div>
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
                      <AlertCircle className="w-4 h-4" />
                      <span>Minimum 50 characters required ({50 - characterCount} more needed)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Great! Your description meets the minimum length requirement</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview - When Not Editing */}
        {!isEditable && value && (
          <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Company Description Preview
            </h4>

            <div className="prose prose-sm max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>

            {/* Content Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{characterCount} characters</span>
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Content saved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isEditable && !value && (
          <div className="mt-6 text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">No company description added yet</p>
            <p className="text-xs text-gray-400 mt-1">Add a compelling company overview to attract top talent</p>
          </div>
        )}

        {/* Writing Guidelines */}
        {isEditable && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-3">✍️ Writing Tips for Your Company Overview:</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  What to Include:
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Company mission and vision</li>
                  <li>• Core values and culture</li>
                  <li>• What makes you unique</li>
                  <li>• Growth opportunities</li>
                  <li>• Work environment highlights</li>
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Best Practices:
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Write in an engaging, authentic tone</li>
                  <li>• Highlight employee benefits and perks</li>
                  <li>• Mention career development opportunities</li>
                  <li>• Include diversity and inclusion efforts</li>
                  <li>• Keep it concise but comprehensive</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> A well-written company overview can increase application rates by up to 40%.
                Focus on what makes your company a great place to work!
              </p>
            </div>
          </div>
        )}

        {/* Content Quality Indicators */}
        {isEditable && value && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-3">📊 Content Quality Check:</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {characterCount >= 50 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm text-gray-700">
                  Minimum Length ({characterCount >= 50 ? 'Met' : 'Not Met'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {characterCount >= 200 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm text-gray-700">
                  Detailed Content ({characterCount >= 200 ? 'Good' : 'Add More'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {characterCount <= 1000 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm text-gray-700">
                  Optimal Length ({characterCount <= 1000 ? 'Good' : 'Too Long'})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && value && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Company overview saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyOverview;