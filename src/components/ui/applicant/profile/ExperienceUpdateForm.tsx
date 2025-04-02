import React, {useEffect, useState} from "react";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {ExperienceResponseDto, institutions, Option} from "../../../../utils/types";
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";
import CustomSelect from "../../../common/CustomSelect.tsx";
import {jobLocation} from "../../../../utils/constants.ts";

interface ExperienceUpdateFormProps {
    experienceData: ExperienceResponseDto;
    isEditable: boolean;
}

const ExperienceUpdateForm: React.FC<ExperienceUpdateFormProps> = ({
                                                                       experienceData,
                                                                       isEditable
                                                                   }) => {
    const {experience, setExperience} = useApplicantJobProfile();
    const [description, setDescription] = useState(experienceData?.description ?? "");

    useEffect(() => {
        if(description !=null || description !== undefined || description === ""){
            setExperience({
                ...experience,
                description: description,
            });
        }
    }, [description]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExperience({
            ...experience,
            [e.target.name]: e.target.value,
        });
    }
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setExperience({
            ...experience,
            [name]: new Date(value),
        })
    }
    return (<div className="w-full flex flex-col gap-y-5">
        <div className="w-full flex flex-col md:flex-row gap-x-2 mg:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Company name</label>
                <input
                    type="text"
                    name="company"
                    value={experienceData.company}
                    disabled={!isEditable}
                    onChange={handleChange}
                    className="rounded-[10px] text-start w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>Your Role</label>
                <CustomDropdown
                    placeholder={experienceData.position}
                    options={institutions}
                    disabled={!isEditable}
                    handleSelect={(option: Option) => {
                        setExperience({
                            ...experience,
                            position: option.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 md:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Location</label>
                <CustomSelect
                    placeholder={experienceData.location}
                    options={jobLocation}
                    disabled={!isEditable}
                    onChange={(option: Option) => {
                        setExperience({
                            ...experience,
                            location: option.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>City</label>
                <CustomDropdown
                    placeholder={experienceData.city}
                    options={institutions}
                    disabled={!isEditable}
                    handleSelect={(option: Option) => {
                        setExperience({
                            ...experience,
                            city: option.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 gap-y-3 md:gap-x-6">
            <div className="w-full flex flex-col gap-y-2">
                <label>Start</label>
                <input type="date"
                       name="startDate"
                       disabled={!isEditable}
                       onChange={handleChangeDate}
                       value={experienceData?.startDate ? new Date(experienceData.startDate).toISOString().split('T')[0] : ""}
                       className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>End</label>
                <input type="date"
                       name="endDate"
                       disabled={!isEditable}
                       onChange={handleChangeDate}
                       value={experienceData?.endDate ? new Date(experienceData.endDate).toISOString().split('T')[0] : ""}
                       className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
            </div>
        </div>

        <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
            <label>Description</label>
            <RichTextEditor value={description} disabled={!isEditable} onChange={setDescription}/>
        </div>
    </div>)
}

export default ExperienceUpdateForm;
