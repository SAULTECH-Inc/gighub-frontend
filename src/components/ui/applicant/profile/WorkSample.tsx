import React from "react";
import { FaLinkSlash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { CvResponseDto } from "../../../../utils/types";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { toast } from "react-toastify";

const FileUploadForm: React.FC = () => {
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
    const response = await updatePortfolioLinks(updatedLinks);
    if (response) {
      setCvDetails({
        ...cvDetails,
        portfolioLink: updatedLinks,
      } as CvResponseDto);
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
    const response = await updatePortfolioLinks(
      cvDetails?.portfolioLink as string[],
    );
    if (response) {
      toast.success("Portfolio links updated successfully");
    } else {
      toast.error("Failed to update portfolio links. Please try again later.");
    }
  };

  return (
    <section className="relative mt-4 space-y-8 border-t-[2px] border-t-[#E6E6E6] pt-5">
      <div className="absolute top-2 right-1 z-10 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          type="button"
          onClick={handleToggleEdit}
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleSavePortfolioLinks}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="mb-4 text-xl">Work sample</h3>

      {/* Upload method selector */}

      {/* File & Link Upload Sections Side by Side */}
      <div className="flex flex-col space-y-6 space-x-0 md:flex-row md:items-start md:space-y-0 md:space-x-6">
        {/* LINKS INPUT BOX */}
        <div className="min-h-[250px] w-full rounded-[16px] border border-[#E6E6E6] bg-white p-6 md:h-[250px]">
          <span className="font-lato text-sm text-gray-700">Provide Links</span>

          {cvDetails?.portfolioLink?.map((link, index) => (
            <div
              key={index}
              className="mt-2 flex items-center rounded-[10px] bg-[#F7F8FA] p-2"
            >
              <FaLinkSlash />
              <input
                type="url"
                value={link}
                disabled={!isEditable}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="Enter a link"
                className="focus:border-gray ml-2 flex-1 border border-[#E6E6E6] bg-[#F9FAFB] p-2 text-sm focus:border-[1px] focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                disabled={!isEditable}
                onClick={() => removeLink(index)}
                className="ml-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <IoMdClose />
              </button>
            </div>
          ))}

          {(cvDetails?.portfolioLink || []).length < 3 && (
            <button
              type="button"
              onClick={addLink}
              className="mt-4 text-sm text-purple-600 hover:underline"
            >
              Add Another Link
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FileUploadForm;
