import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React, {useEffect, useState} from "react";
import useModalStore from "../../../../store/modalStateStores.ts";
import {useAuth} from "../../../../store/useAuth.ts";
import {
    ApplicantData,
    cities,
    classOfDegrees,
    countries,
    EducationResponseDto,
    fieldsOfStudies,
    institutions,
    Option
} from "../../../../utils/types";
import useEducationFormStore from "../../../../store/useEducationFormStore.tsx";
import {toast} from "react-toastify";

interface AddEducationModalProp {
    modalId: string;
}

const AddEducationModal: React.FC<AddEducationModalProp> = ({modalId}) => {
    const {modals, closeModal} = useModalStore();
    const isOpen = modals[modalId];
    const {applicant, setProfileData} = useAuth();
    const {education, setEducation, submitEducation, resetEducation} = useEducationFormStore();
    const [description, setDescription] = useState<string>(
        education?.description || ""
    );
    const [currentlyEnrolled, setCurrentEnrolled] = useState<boolean>(false);


    useEffect(() => {
        // Avoid unnecessary updates by comparing values before setting state
        setEducation({
            ...education,
            description: description,

        })
        if (currentlyEnrolled) {
            setEducation({...education, endDate: new Date() });
        }
    }, [description, currentlyEnrolled]);





    const handleAddEducation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const success = await submitEducation(education, applicant?.id || 0, applicant?.cv?.id || 0);
            if (success) {
                toast.success("Education updated successfully!");
                resetEducation();
                const educations: EducationResponseDto[] = [...applicant?.cv?.educations || []];
                educations.push(education);
                setProfileData({
                    ...applicant,
                    cv: {
                        ...applicant?.cv,
                        educations: educations
                    }
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


    if (!isOpen) return null;
    //   flex flex-col justify-evenly py-[5px]
    return (<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

        <form className="m-2 w-[360px] h-[680px] md:w-[690px] md:h-[850px] lg:w-[820px] lg:h-[830px] p-5 md:p-8 lg:p-10 shadow-lg bg-white rounded-[16px] flex flex-col gap-y-5 overflow-y-scroll md:overflow-y-hidden">
            <h3>Not Specified</h3>
            <div className="w-full flex flex-col md:flex-row gap-x-6">
                <div className="w-full flex flex-col gap-y-2">
                    <label>Degree</label>
                    <CustomDropdown
                        placeholder="Enter class of degree"
                        options={classOfDegrees}
                        handleSelect={(selected: Option) => {
                            setEducation({
                                ...education,
                                degree: selected.value,
                            })
                        }}
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col gap-y-2">
                    <label>Field of Study</label>
                    <CustomDropdown
                        placeholder="Enter field of study"
                        options={fieldsOfStudies}
                        handleSelect={(selected: Option) => {
                            setEducation({
                                ...education,
                                fieldOfStudy: selected.value,
                            })
                        }}
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-x-6">
                <div className="w-full flex flex-col gap-y-2">
                    <label>Institution</label>
                    <CustomDropdown
                        placeholder="Enter institution"
                        options={institutions}
                        handleSelect={(selected: Option) => {
                            setEducation({
                                ...education,
                                institution: selected.value,
                            })
                        }}
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col gap-y-2">
                    <label>Country</label>
                    <CustomDropdown
                        placeholder="Enter country"
                        options={countries}
                        handleSelect={(selected: Option) => {
                            setEducation({
                                ...education,
                                country: selected.value,
                            })
                        }}
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
            </div>
            <div className="w-full flex md:flex-row flex-col lg:gap-x-6 gap-x-2">
                <div className="w-full md:w-1/2 flex flex-col gap-y-2">
                    <label>City</label>
                    <CustomDropdown
                        placeholder="Enter city"
                        options={cities}
                        handleSelect={(selected: Option) => {
                            setEducation({
                                ...education,
                                city: selected.value,
                            })
                        }}
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="lg:w-1/2 w-full flex flex-col md:flex-row lg:gap-x-6 gap-x-2">
                    <div className="w-full md:w-1/2 flex flex-col gap-y-2">
                        <label>Start</label>
                        <input type="date"
                               name="startDate"
                               onChange={handleChangeDate}
                               value={education?.startDate ? new Date(education.startDate).toISOString().split('T')[0] : ""}
                               className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    {!currentlyEnrolled && (<div className="w-full md:w-1/2 flex flex-col gap-y-2">
                        <label>End</label>
                        <input type="date"
                               name="endDate"
                               disabled={currentlyEnrolled}
                               onChange={handleChangeDate}
                               value={education?.endDate ? new Date(education.endDate).toISOString().split('T')[0] : ""}
                               className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>)}

                </div>
            </div>
            <div className="flex lg:justify-end justify-start">
                <span>
                <input type="checkbox" onChange={
                    e => {
                        setCurrentEnrolled(e.target.checked);
                    }
                }/>
                <label className="ml-2">Currently there</label>
            </span>
            </div>

            <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
                <label>Description</label>
                <RichTextEditor onChange={setDescription} value={description}/>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleAddEducation}
                    type="button"
                    className="px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium">
                    Update
                </button>
                <button
                    onClick={() => closeModal(modalId)}
                    className="ml-4 px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-gray-500 font-medium">
                    Cancel
                </button>
            </div>
        </form>
    </div>)
}

export default AddEducationModal;