import React, {useEffect} from "react";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {useAuth} from "../../../../store/useAuth.ts";
import {ApplicantPersonalInfo, countries, Option} from "../../../../utils/types";
import {useSectionEditable} from "../../../../store/useEditable.ts";

const cities: Option[] = [
    {label: "New York", value: "NY" },
    { label: "Los Angeles", value: "LA" },
    { label: "Chicago", value: "CHI" },
    { label: "Houston", value: "HOU" },
    { label: "Philadelphia", value: "PHL" },
    { label: "San Francisco", value: "SF" },
    { label: "Seattle", value: "SEA" },
    { label: "Boston", value: "BOS" },
    { label: "Washington D.C.", value: "WASH" },
    { label: "Atlanta", value: "ATL" },
    { label: "Dallas", value: "DAL" },
    { label: "San Diego", value: "SAN" },
    { label: "San Jose", value: "SJC" },
]
const PersonalInfo: React.FC = () => {
    const {applicant,applicantPersonalInfo, setProfileData, setApplicantPersonalInfo, updateApplicantPersonalInfo} = useAuth();
    const {isEditable, toggleEdit} = useSectionEditable("personal-info");
    const [city, setCity] = React.useState<Option | null>({
        label:  applicantPersonalInfo?.city ? applicant.city as string : "",
        value: applicantPersonalInfo?.city ? applicant.city as string : "",
    });
    const [country, setCountry] = React.useState<Option | null>({
        label:  applicantPersonalInfo?.country? applicant.country as string : "",
        value: applicantPersonalInfo?.country? applicant.country as string : "",
    });

    useEffect(() => {
        const data = {
            ...applicantPersonalInfo,
            city: city?.value || "",
            country: country?.value || "",
        };
        setApplicantPersonalInfo(data);

    }, [city, country]);


    const handleChange = async(e: { target: HTMLInputElement | HTMLTextAreaElement; })=>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        const data = {
            ...applicant,
            [name]: value,
        } as ApplicantPersonalInfo;
        setApplicantPersonalInfo(data);
    }
    const handleSavePersonalInfo = async()=>{
        const response = await updateApplicantPersonalInfo(applicantPersonalInfo as ApplicantPersonalInfo);
        if(response){
            setProfileData(
                {
                    ...applicant,
                    ...response
                }
            );
            toggleEdit();
        }
    }
    return (
        <section id="personal-info" className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
            <div className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2">
                <button onClick={toggleEdit} type="button" className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit</button>
                <button onClick={handleSavePersonalInfo} disabled={!isEditable}  type="button" className={`${!isEditable ? "cursor-not-allowed":"cursor-pointer" } bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save</button>
            </div>
            <h3 className="font-lato text-[20px] mb-4">
                Personal Information
            </h3>
            <div className="w-full flex flex-col gap-y-5">
                <div className="w-full lg:flex grid grid-cols-1 items-center gap-x-8">
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">First Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            disabled={!isEditable}
                            name="firstName"
                            value={`${applicantPersonalInfo?.firstName || ""}`}
                            className="text-left flex h-12 items-start rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Middle Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="middleName"
                            disabled={!isEditable}
                            value={`${applicantPersonalInfo?.middleName || ""}`}
                            className="text-left flex h-12 items-start rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Last Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="lastName"
                            disabled={!isEditable}
                            value={`${applicantPersonalInfo?.lastName || ""}`}
                            className="text-left flex h-12 items-start rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Email address</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="email"
                            disabled={!isEditable}
                            value={applicantPersonalInfo?.email || ""}
                            className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                </div>
                <div className="w-full lg:flex grid grid-cols-1 items-center gap-x-8">
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Phone number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            onChange={handleChange}
                            disabled={!isEditable}
                            value={applicantPersonalInfo?.phoneNumber || ""}
                            className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Date of birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={applicantPersonalInfo?.dateOfBirth || ""}
                            disabled={!isEditable}
                            onChange={handleChange}
                            className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                </div>
                <div className="w-full lg:flex grid grid-cols-1 items-center gap-x-8">
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Country</label>
                        <CustomDropdown
                            options={countries}
                            handleSelect={setCountry}
                            placeholder={applicantPersonalInfo?.country || ""}
                            disabled={!isEditable}
                            className="rounded-[10px] h-12 text-start  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                        />
                    </div>

                    <div className="w-full flex flex-col gap-x-8">
                        <label className="text-sm text-gray-600 mb-1">City</label>
                        <CustomDropdown
                            options={cities}
                            handleSelect={setCity}
                            placeholder={applicantPersonalInfo?.city || ""}
                            disabled={!isEditable}
                            className="rounded-[10px] h-12 text-start  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Address</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="address"
                        value={applicantPersonalInfo?.address || ""}
                        disabled={!isEditable}
                        className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>

            </div>
        </section>
    );
}

export default PersonalInfo;
