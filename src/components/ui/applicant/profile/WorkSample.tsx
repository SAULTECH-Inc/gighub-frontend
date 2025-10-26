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
  Globe,
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
      const validLinks =
        (cvDetails?.portfolioLink as string[])?.filter(
          (link) => link.trim() !== "",
        ) || [];

      const response = await updatePortfolioLinks(validLinks);
      if (response) {
        setCvDetails({
          ...cvDetails,
          portfolioLink: validLinks,
        } as CvResponseDto);
        toast.success("Portfolio links updated successfully");
        toggleEdit();
      } else {
        toast.error(
          "Failed to update portfolio links. Please try again later.",
        );
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
  const validLinks = portfolioLinks.filter(
    (link) => link && link.trim() !== "",
  );

  return (
    <section id="work-samples" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Work Samples & Portfolio
            </h3>
            <p className="text-sm text-gray-500">
              Share links to your best work and portfolio projects
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEdit}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isEditable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleSavePortfolioLinks}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700"
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
          <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            Portfolio Links
          </h4>

          <div className="space-y-4">
            {/* Portfolio Link Inputs */}
            {portfolioLinks.map((link, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <Link className="h-4 w-4 text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <input
                      type="url"
                      value={link}
                      disabled={!isEditable}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://example.com/your-portfolio"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    {/* URL Validation */}
                    {link && !isValidUrl(link) && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <span className="h-1 w-1 rounded-full bg-red-600"></span>
                        Please enter a valid URL (include https://)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Preview Link */}
                    {link && isValidUrl(link) && (
                      <button
                        type="button"
                        onClick={() => window.open(link, "_blank")}
                        className="rounded-lg p-2 text-purple-600 transition-colors duration-200 hover:bg-purple-50"
                        title="Open link in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}

                    {/* Remove Link */}
                    <button
                      type="button"
                      disabled={!isEditable}
                      onClick={() => removeLink(index)}
                      className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Remove link"
                    >
                      <X className="h-4 w-4" />
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
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-3 text-sm text-gray-600 transition-colors duration-200 hover:border-purple-400 hover:text-purple-600"
              >
                <Plus className="h-4 w-4" />
                Add Portfolio Link ({portfolioLinks.length}/3)
              </button>
            )}

            {/* Link Limit Message */}
            {portfolioLinks.length >= 3 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
                <p className="text-sm text-amber-700">
                  📝 Maximum of 3 portfolio links allowed
                </p>
              </div>
            )}
          </div>

          {/* Display Valid Links Summary */}
          {validLinks.length > 0 && !isEditable && (
            <div className="mt-6 space-y-3">
              <h5 className="text-sm font-medium text-gray-700">
                Active Portfolio Links:
              </h5>
              <div className="space-y-2">
                {validLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3"
                  >
                    <Globe className="h-4 w-4 text-purple-600" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 truncate text-sm text-purple-800 hover:text-purple-900 hover:underline"
                    >
                      {link}
                    </a>
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {validLinks.length === 0 && !isEditable && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-500">
              <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p className="text-sm font-medium">No portfolio links added</p>
              <p className="mt-1 text-xs text-gray-400">
                Add links to showcase your work and projects
              </p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              💡 Portfolio Tips:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>
                • Include your best work that's relevant to your target roles
              </li>
              <li>
                • Use professional platforms like GitHub, Behance, or personal
                websites
              </li>
              <li>• Ensure all links are accessible and load quickly</li>
              <li>• Include a brief description or context for each project</li>
              <li>• Maximum of 3 links to keep focus on your best work</li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && validLinks.length > 0 && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Portfolio links saved successfully ({validLinks.length}/3)
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkSamples;
