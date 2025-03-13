import React from 'react';
import {FaLinkSlash} from "react-icons/fa6";
import {IoMdClose} from "react-icons/io";
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";
import {CvResponseDto} from "../../../../utils/types";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import {toast} from "react-toastify";

const FileUploadForm: React.FC = () => {
    const {cvDetails, setCvDetails, updatePortfolioLinks} = useApplicantJobProfile();
    const {isEditable, toggleEdit} = useSectionEditable("work-sample");
    // Handle link input changes
    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...cvDetails?.portfolioLink as string[]];
        updatedLinks[index] = value;
        setCvDetails({
            ...cvDetails,
            portfolioLink: updatedLinks
        } as  CvResponseDto);
    };

    // Remove individual link
    const removeLink = async(index: number) => {
        const updatedLinks = [...cvDetails?.portfolioLink as string[]];
        updatedLinks.splice(index, 1);
        const response = await updatePortfolioLinks(updatedLinks);
        if(response){
            setCvDetails({
                ...cvDetails,
                portfolioLink: updatedLinks
            } as CvResponseDto);
        }
    };

    // Add new link (max 3)
    const addLink = () => {
        const arr= cvDetails?.portfolioLink as string[] || [] as string[];
        if (arr.length < 3) {
            setCvDetails({
               ...cvDetails,
                portfolioLink: [...cvDetails?.portfolioLink || [], ''],
            } as CvResponseDto);
        }
    };

    const handleToggleEdit = () => {
        toggleEdit();
    };

    const handleSavePortfolioLinks = async() => {
        const response = await updatePortfolioLinks(cvDetails?.portfolioLink as string[]);
        if (response) {
            toast.success("Portfolio links updated successfully");
        } else {
            toast.error("Failed to update portfolio links. Please try again later.");
        }
    };

    return (
        <section className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-8">
            <div
                className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2 z-10">
                <button type="button" onClick={handleToggleEdit}
                        className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
                </button>
                <button type="button"
                        onClick={handleSavePortfolioLinks}
                        className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
                </button>
            </div>
            <h3 className="text-xl mb-4">Work sample</h3>

            {/* Upload method selector */}

            {/* File & Link Upload Sections Side by Side */}
            <div className="flex flex-col md:items-start md:flex-row space-x-0 md:space-x-6 space-y-6 md:space-y-0">

                {/* LINKS INPUT BOX */}
                <div className="w-full min-h-[250px] md:h-[250px] p-6 bg-white border border-[#E6E6E6] rounded-[16px]">
                    <span className="text-sm text-gray-700 font-lato">Provide Links</span>

                    {cvDetails?.portfolioLink?.map((link, index) => (
                        <div key={index} className="flex items-center bg-[#F7F8FA] p-2 rounded-[10px] mt-2">
                            <FaLinkSlash/>
                            <input
                                type="url"
                                value={link}
                                disabled={!isEditable}
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                placeholder="Enter a link"
                                className="flex-1 ml-2 p-2 bg-[#F9FAFB] text-sm border border-[#E6E6E6] focus:outline-none focus:ring-0 focus:border-[1px] focus:border-gray"
                            />
                            <button
                                type="button"
                                disabled={!isEditable}
                                onClick={() => removeLink(index)}
                                className="ml-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                <IoMdClose/>
                            </button>
                        </div>
                    ))}

                    {(cvDetails?.portfolioLink || []).length < 3 && (
                        <button type="button" onClick={addLink}
                                className="mt-4 text-sm text-purple-600 hover:underline">
                            Add Another Link
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FileUploadForm;
