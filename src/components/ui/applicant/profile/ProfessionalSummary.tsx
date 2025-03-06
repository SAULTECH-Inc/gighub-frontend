import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../store/useAuth.ts";
import {CvResponseDto, ProfessionalSummaryData} from "../../../../utils/types";
import TextEditor from "../../../common/TextEditor.tsx";
import {useSectionEditable} from "../../../../store/useEditable.ts";

const ProfessionalSummary: React.FC = () => {
    const {applicant, setProfileData, professionalSummaryData, setProfessionalSummaryData, updateProfessionalSummaryData} = useAuth();
    const {isEditable, toggleEdit} = useSectionEditable("professional-summary");
    const [value, setValue] = useState<string>(
        professionalSummaryData?.professionalSummary ? professionalSummaryData?.professionalSummary: "");
// In ProfessionalSummary.tsx
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
                professionalSummary: value
            });
        }
    }, [value]);

    const handleUpdateProfessionalSummary = async () => {
        const response = await updateProfessionalSummaryData(professionalSummaryData);
        if (response) {
            setProfileData({
               ...applicant,
                cv: {
                   ...applicant.cv,
                    professionalSummary: response.professionalSummary,
                } as CvResponseDto
            });
            toggleEdit();
        }
    }

    const handleEditorChange = (content: React.SetStateAction<string>) => {
        setProfessionalSummaryData({
            ...professionalSummaryData,
            professionalSummary: content as string
        });
    };




    return (
        <section id="professional-summary" className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <div className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2">
                <button onClick={toggleEdit} type="button"
                        className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
                </button>
                <button disabled={!isEditable} type="button"
                        onClick={handleUpdateProfessionalSummary}
                        className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
                </button>
            </div>
            <h3 className="font-lato text-[20px] mb-4">
                Professional Summary
            </h3>
            <div className="w-full flex flex-col">
                <label
                    htmlFor="professionalTitle"
                    className="text-sm text-gray-600 mb-1"
                >
                    Professional Title
                </label>
                <input
                    type="text"
                    name="professionalTitle"
                    value={professionalSummaryData?.professionalTitle}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col mt-4">
                <label className="text-[16px] text-gray-600 mb-5">Short bio</label>

                {/* Textarea */}
                <TextEditor value={value} onChange={(content)=>{
                    setValue(content);
                    handleEditorChange(content);
                }} disabled={!isEditable}/>
            </div>
        </section>
    );
};

export default ProfessionalSummary;
