import React from "react";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { CvResponseDto } from "../../../../utils/types";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { toast } from "react-toastify";
import {
  Link,
  Plus,
  X,
  Edit3,
  Save,
  CheckCircle2,
  Briefcase,
  ExternalLink,
  Globe
} from "lucide-react";

const WorkSamples: React.FC = () => {
  const { cvDetails, setCvDetails, updatePortfolioLinks } =
    useApplicantJobProfile();
  const { isEditable, toggleEdit } = useSectionEditable("work-sample");

  // Handle link input changes
  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...(cvDetails?.portfolioLink as string[])];
    updatedLinks[index] = value;
    setCvDetails({
      ...cvDetails,
      portfolioLink: updatedLinks,
    } as CvResponseDto);
  };

  // Remove individual link
  const removeLink = async (index: number) => {
    const updatedLinks = [...(cvDetails?.portfolioLink as string[])];
    updatedLinks.splice(index, 1);

    try {
      const response = await updatePortfolioLinks(updatedLinks);
      if (response) {
        setCvDetails({
          ...cvDetails,
          portfolioLink: updatedLinks,
        } as CvResponseDto);
        toast.success("Portfolio link removed successfully");
      }
    } catch (error) {
      toast.error("Failed to remove link. Please try again.");
    }
  };

  // Add new link (max 3)
  const addLink = () => {
    const arr = (cvDetails?.portfolioLink as string[]) || ([] as string[]);
    if (arr.length < 3) {
      setCvDetails({
        ...cvDetails,
        portfolioLink: [...(cvDetails?.portfolioLink || []), ""],
      } as CvResponseDto);
    }
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };

  const handleSavePortfolioLinks = async () => {
    try {
      // Filter out empty links before saving
      const validLinks = (cvDetails?.portfolioLink as string[])?.filter(link => link.trim() !== '') || [];

      const response = await updatePortfolioLinks(validLinks);
      if (response) {
        setCvDetails({
          ...cvDetails,
          portfolioLink: validLinks,
        } as CvResponseDto);
        toast.success("Portfolio links updated successfully");
        toggleEdit();
      } else {
        toast.error("Failed to update portfolio links. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to update portfolio links. Please try again later.");
    }
  };

  // Validate URL format
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const portfolioLinks = cvDetails?.portfolioLink || [];
  const validLinks = portfolioLinks.filter(link => link && link.trim() !== '');

  return (
    <section id="work-samples" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Work Samples & Portfolio</h3>
            <p className="text-sm text-gray-500">Share links to your best work and portfolio projects</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEdit}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isEditable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditable ? 'Cancel' : 'Edit'}
          </button>

          {isEditable && (
            <button
              onClick={handleSavePortfolioLinks}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
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
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Portfolio Links
          </h4>

          <div className="space-y-4">
            {/* Portfolio Link Inputs */}
            {portfolioLinks.map((link, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <Link className="w-4 h-4 text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <input
                      type="url"
                      value={link}
                      disabled={!isEditable}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://example.com/your-portfolio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    {/* URL Validation */}
                    {link && !isValidUrl(link) && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        Please enter a valid URL (include https://)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Preview Link */}
                    {link && isValidUrl(link) && (
                      <button
                        type="button"
                        onClick={() => window.open(link, '_blank')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        title="Open link in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}

                    {/* Remove Link */}
                    <button
                      type="button"
                      disabled={!isEditable}
                      onClick={() => removeLink(index)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove link"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Link Button */}
            {isEditable && portfolioLinks.length < 3 && (
              <button
                type="button"
                onClick={addLink}
                className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Portfolio Link ({portfolioLinks.length}/3)
              </button>
            )}

            {/* Link Limit Message */}
            {portfolioLinks.length >= 3 && (
              <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  📝 Maximum of 3 portfolio links allowed
                </p>
              </div>
            )}
          </div>

          {/* Display Valid Links Summary */}
          {validLinks.length > 0 && !isEditable && (
            <div className="mt-6 space-y-3">
              <h5 className="text-sm font-medium text-gray-700">Active Portfolio Links:</h5>
              <div className="space-y-2">
                {validLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm text-purple-800 hover:text-purple-900 hover:underline truncate"
                    >
                      {link}
                    </a>
                    <ExternalLink className="w-4 h-4 text-purple-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {validLinks.length === 0 && !isEditable && (
            <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50 mt-4">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium">No portfolio links added</p>
              <p className="text-xs text-gray-400 mt-1">Add links to showcase your work and projects</p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {isEditable && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Portfolio Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include your best work that's relevant to your target roles</li>
              <li>• Use professional platforms like GitHub, Behance, or personal websites</li>
              <li>• Ensure all links are accessible and load quickly</li>
              <li>• Include a brief description or context for each project</li>
              <li>• Maximum of 3 links to keep focus on your best work</li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && validLinks.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Portfolio links saved successfully ({validLinks.length}/3)
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkSamples;