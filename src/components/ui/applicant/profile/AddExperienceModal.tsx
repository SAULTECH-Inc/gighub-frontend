import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React, {useEffect, useState} from "react";
import useModalStore from "../../../../store/modalStateStores.ts";
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";
import {
    CvResponseDto,
    ExperienceResponseDto,
    institutions,
    Option
} from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import {toast} from "react-toastify";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import {jobLocation} from "../../../../utils/constants.ts";

interface AddExperienceModalProp {
    modalId: string;
}

const AddExperienceModal: React.FC<AddExperienceModalProp> = ({modalId}) => {
    const {experience, setCvDetails, cvDetails, setExperience, addExperience, setExperiences, experiences, resetExperience} = useApplicantJobProfile();
    const [description, setDescription] = useState(experience?.description ?? "");
    const {modals, closeModal} = useModalStore();
    const isOpen = modals[modalId];
    const [currentlyEnrolled, setCurrentEnrolled] = useState<boolean>(false);

    useEffect(() => {
        setExperience({
            ...experience,
            description: description,
        });
        if (currentlyEnrolled) {
            setExperience({...experience, endDate: new Date() });
        }
    }, [description]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setExperience({
            ...experience,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await addExperience(experience);
        if (response) {
            toast.success("Experience added successfully");
            setTimeout(()=>{
                closeModal(modalId);
                resetExperience();
            },1000);
            const exp: ExperienceResponseDto[] = [...experiences || []];
            exp.push(response);
            setExperience(response);
            setExperiences(exp);
            setCvDetails({
                ...cvDetails,
                experiences: exp,
            } as CvResponseDto);
        }
    }
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setExperience({
            ...experience,
            [name]: new Date(value),
        })
    }

    if (!isOpen) return null;

    return (<div className="fixed w-screen h-screen -top-3 inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <form
            className="relative m-2 w-[360px] h-auto md:w-[690px] p-5 md:p-8 lg:p-10 shadow-lg bg-white rounded-[16px] flex flex-col gap-y-5 overflow-y-scroll md:overflow-y-hidden">
            <div className="w-full flex flex-col md:flex-row gap-x-2 mg:gap-x-6 gap-y-3">
                <div className="w-full flex flex-col gap-y-2">
                    <label>Company name</label>
                    <input
                        type="text"
                        name="company"
                        value={experience.company}
                        onChange={handleChange}
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col gap-y-2">
                    <label>Your Role</label>
                    <CustomDropdown
                        placeholder="Enter your role"
                        options={institutions}
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
                        placeholder="Location"
                        options={jobLocation}
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
                        placeholder="Enter city"
                        options={institutions}
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
            <div className="w-full flex  flex-col md:grid md:grid-cols-2 gap-x-2 md:gap-x-6 gap-y-3">
                <div className="w-full flex flex-col md:col-span-1 gap-y-2">
                    <label>Start</label>
                    <input type="date"
                           name="startDate"
                           onChange={handleChangeDate}
                           value={experience?.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : ""}
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
                {
                    !currentlyEnrolled && (<div className="w-full flex flex-col md:col-span-1 gap-y-2">
                        <label>End</label>
                        <input type="date"
                               name="endDate"
                               onChange={handleChangeDate}
                               value={experience?.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : ""}
                               className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>)
                }

            </div>
            <div className="flex lg:justify-end justify-start">
                <span>
                    <CustomCheckbox
                        label="Currently there"
                        checked={currentlyEnrolled}
                        onChange={
                            e => {
                                setCurrentEnrolled(e.target.checked);
                            }
                        }
                    />
            </span>
            </div>

            <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
                <label>Description</label>
                <RichTextEditor value={experience?.description || ""}
                                onChange={setDescription}/>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    type="button"
                    className="px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium">
                    Add
                </button>
                <button
                    type="button"
                    onClick={() => closeModal(modalId)}
                    className="ml-4 px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-gray-500 font-medium">
                    Cancel
                </button>
            </div>
        </form>
    </div>)
}

export default AddExperienceModal;