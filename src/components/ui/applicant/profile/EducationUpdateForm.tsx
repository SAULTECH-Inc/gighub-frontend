import React, {useEffect, useState} from "react";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {
    ApplicantData, cities,
    classOfDegrees, countries,
    EducationResponseDto,
    fieldsOfStudies,
    institutions,
    Option
} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";
import useEducationFormStore from "../../../../store/useEducationFormStore.tsx";
import {toast} from "react-toastify";

interface EductionUpdateFormProps {
    educationData: EducationResponseDto;
}

const EducationUpdateForm: React.FC<EductionUpdateFormProps> = ({
                                                                    educationData
                                                                }) => {
    const {applicant, setProfileData} = useAuth();
    const {education, setEducation, submitEducation, resetEducation} = useEducationFormStore();
    const [description, setDescription] = useState<string>(
        education?.description || ""
    );


    useEffect(() => {
        setEducation({
            ...education,
            ...educationData,
            description: description,

        })
    }, [description, educationData]);


    const handleUpdateEducation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            // Submit the education update
            const success = await submitEducation(education, applicant?.id || 0, applicant?.cv?.id || 0);

            if (success) {
                toast.success("Education updated successfully!");
                resetEducation();

                // Update the state with the modified education entry
                const educations = applicant?.cv?.educations || [];
                const updatedEducations = educations.map((edu) =>
                    edu.id === education.id ? education : edu
                );

                setProfileData({
                    ...applicant,
                    cv: {
                        ...applicant?.cv,
                        educations: updatedEducations,
                    },
                } as ApplicantData);
            }
        } catch (error) {
            toast.error("Failed to update education.");
            console.error("Error updating education:", error);
        }
    };


    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEducation({
            ...education,
            [name]: new Date(value),
        })
    }

    return (<div className="w-full flex flex-col gap-y-5">
        <div className="w-full flex flex-col md:flex-row gap-x-2 mg:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Degree</label>
                <CustomDropdown
                    placeholder={education?.degree || "Select a degree..."}
                    options={classOfDegrees}
                    handleSelect={(selected: Option) => {
                        setEducation({
                            ...education,
                            institution: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>Field of Study</label>
                <CustomDropdown
                    placeholder={education?.fieldOfStudy || "Select a field of study..."}
                    options={fieldsOfStudies}
                    handleSelect={(selected: Option) => {
                        setEducation({
                            ...education,
                            fieldOfStudy: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 md:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Institution</label>
                <CustomDropdown
                    options={institutions}
                    placeholder={education?.institution || "Select an institution..."}
                    handleSelect={(selected: Option) => {
                        setEducation({
                            ...education,
                            institution: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>

            <div className="w-full flex flex-col gap-y-2">
                <label>Degree</label>
                <CustomDropdown
                    placeholder={education?.institution || "Select a institution..."}
                    options={institutions}
                    handleSelect={(selected: Option) => {
                        setEducation({
                            ...education,
                            institution: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 md:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Country</label>
                <CustomDropdown
                    placeholder={education?.country || "Select a country..."}
                    options={countries}
                    handleSelect={(selected: Option) => {
                        setEducation({
                            ...education,
                            country: selected.value,
                        })
                    }
                    }
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>City</label>
                <CustomDropdown
                    placeholder={education?.city || "Select a city..."}
                    options={cities}
                    handleSelect={(selected: Option) => {
                        setEducation({
                            ...education,
                            city: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 gap-y-3 md:gap-x-6">
            <div className="md:w-1/2 flex gap-x-2 md:gap-x-6 px-2 md:px-0">
                <div className="w-1/2 flex flex-col gap-y-2">
                    <label>Start</label>
                    <input type="date"
                           name="startDate"
                           value={education?.startDate ? new Date(education.startDate).toISOString().split('T')[0] : ""}
                           onChange={handleChangeDate}
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
                <div className="w-1/2 flex flex-col gap-y-2">
                    <label>End</label>
                    <input type="date"
                           name="endDate"
                           value={education?.endDate ? new Date(education.endDate).toISOString().split('T')[0] : ""}
                           onChange={handleChangeDate}
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
            <label>Description</label>
            <RichTextEditor value={education?.description || ""} onChange={setDescription}/>
        </div>
        <div className="flex justify-end">
            <button
                onClick={handleUpdateEducation}
                type="button"
                className="px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium">
                Update
            </button>
            <button
                className="ml-4 px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-gray-500 font-medium">
                Cancel
            </button>
        </div>
    </div>)
}

export default EducationUpdateForm;