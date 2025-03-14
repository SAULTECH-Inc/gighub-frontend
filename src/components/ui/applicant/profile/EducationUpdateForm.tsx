import React, {useEffect, useState} from "react";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {cities,
    classOfDegrees, countries,
    EducationResponseDto,
    fieldsOfStudies,
    institutions,
    Option
} from "../../../../utils/types";
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";

interface EductionUpdateFormProps {
    educationData: EducationResponseDto;
    isEditable: boolean;
}

const EducationUpdateForm: React.FC<EductionUpdateFormProps> = ({
                                                                    educationData,
    isEditable,

                                                                }) => {

    const {applicantEducation, setApplicantEducation} = useApplicantJobProfile();
    const [description, setDescription] = useState<string>(
        educationData?.description || ""
    );


    useEffect(() => {
        if(description !=null || description !== undefined || description === ""){
            setApplicantEducation({
                ...applicantEducation,
                description: description,
            });
        }
    }, [description, educationData]);



    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setApplicantEducation({
            ...applicantEducation,
            [name]: new Date(value),
        })
    }

    return (<div className="w-full flex flex-col gap-y-5">
        <div className="w-full flex  flex-col md:flex-row gap-x-2 md:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Degree</label>
                <CustomDropdown
                    placeholder={applicantEducation?.degree || "Select a degree..."}
                    options={classOfDegrees}
                    disabled={!isEditable}
                    handleSelect={(selected: Option) => {
                        setApplicantEducation({
                            ...applicantEducation,
                            institution: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>Field of Study</label>
                <CustomDropdown
                    placeholder={applicantEducation?.fieldOfStudy || "Select a field of study..."}
                    options={fieldsOfStudies}
                    disabled={!isEditable}
                    handleSelect={(selected: Option) => {
                        setApplicantEducation({
                            ...applicantEducation,
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
                    disabled={!isEditable}
                    placeholder={applicantEducation?.institution || "Select an institution..."}
                    handleSelect={(selected: Option) => {
                        setApplicantEducation({
                            ...applicantEducation,
                            institution: selected.value,
                        })
                    }}
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>

            <div className="w-full flex flex-col gap-y-2">
                <label>Degree</label>
                <CustomDropdown
                    placeholder={applicantEducation?.institution || "Select a institution..."}
                    options={institutions}
                    disabled={!isEditable}
                    handleSelect={(selected: Option) => {
                        setApplicantEducation({
                            ...applicantEducation,
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
                    placeholder={applicantEducation?.country || "Select a country..."}
                    options={countries}
                    disabled={!isEditable}
                    handleSelect={(selected: Option) => {
                        setApplicantEducation({
                            ...applicantEducation,
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
                    placeholder={applicantEducation?.city || "Select a city..."}
                    options={cities}
                    disabled={!isEditable}
                    handleSelect={(selected: Option) => {
                        setApplicantEducation({
                            ...applicantEducation,
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
                           disabled={!isEditable}
                           value={applicantEducation?.startDate ? new Date(applicantEducation.startDate).toISOString().split('T')[0] : ""}
                           onChange={handleChangeDate}
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
                <div className="w-1/2 flex flex-col gap-y-2">
                    <label>End</label>
                    <input type="date"
                           name="endDate"
                           disabled={!isEditable}
                           value={applicantEducation?.endDate ? new Date(applicantEducation.endDate).toISOString().split('T')[0] : ""}
                           onChange={handleChangeDate}
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
            <label>Description</label>
            <RichTextEditor disabled={!isEditable} value={applicantEducation?.description || ""} onChange={setDescription}/>
        </div>
    </div>)
}

export default EducationUpdateForm;