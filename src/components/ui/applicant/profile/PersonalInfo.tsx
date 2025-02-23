import React, {useEffect} from "react";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {useAuth} from "../../../../store/useAuth.ts";
import {ApplicantData, Option} from "../../../../utils/types";

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

const countries: Option[] = [
    {label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "United Kingdom", value: "UK" },
    { label: "Australia", value: "AU" },
    { label: "Nigeria", value: "NG" },
    { label: "India", value: "IN" },
]
const PersonalInfo: React.FC = () => {
    const {applicant, setProfileData} = useAuth();
    const [city, setCity] = React.useState<Option | null>({
        label:  applicant?.city ? applicant.city : "",
        value: applicant?.city ? applicant.city : "",
    });
    const [country, setCountry] = React.useState<Option | null>({
        label:  applicant?.country? applicant.country : "",
        value: applicant?.country? applicant.country : "",
    });

    useEffect(() => {
        setProfileData(
            {
               ...applicant as ApplicantData,
                city: city?.value || "",
                country: country?.value || "",
            }
        )
    }, [city, country]);


    const handleChange = async(e: { target: HTMLInputElement | HTMLTextAreaElement; })=>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        const updatedApplicant: Partial<ApplicantData> = {...applicant as ApplicantData, [name]: value};
        await setProfileData(updatedApplicant);
    }
    return (
        <section id="personal-info" className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
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
                            name="firstName"
                            value={`${applicant?.firstName || ""}`}
                            className="text-left flex h-12 items-start rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Middle Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="middleName"
                            value={`${applicant?.middleName || ""}`}
                            className="text-left flex h-12 items-start rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Last Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="lastName"
                            value={`${applicant?.lastName || ""}`}
                            className="text-left flex h-12 items-start rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Email address</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="email"
                            value={applicant?.email || ""}
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
                            value={applicant?.phoneNumber || ""}
                            className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Date of birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={applicant?.dateOfBirth || ""}
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
                            placeholder={applicant?.country || ""}
                            className="rounded-[10px] h-12 text-start  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                        />
                    </div>

                    <div className="w-full flex flex-col gap-x-8">
                        <label className="text-sm text-gray-600 mb-1">City</label>
                        <CustomDropdown
                            options={cities}
                            handleSelect={setCity}
                            placeholder={applicant?.city || ""}
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
                        value={applicant?.address || ""}
                        className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>

            </div>
        </section>
    );
}

export default PersonalInfo;