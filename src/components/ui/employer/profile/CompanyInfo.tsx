import React, {useEffect} from "react";
import {useEmployerProfile} from "../../../../store/useEmployerProfile.ts";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {CompanyInfos, countries, Option} from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import {useAuth} from "../../../../store/useAuth.ts";

const CompanyInfo: React.FC = ()=>{
    const {employer} = useAuth();
    const {companyInfo, setCompanyInfo, updateCompanyInfo} = useEmployerProfile();
    const {isEditable, toggleEdit} = useSectionEditable("companyInfo");
    useEffect(() => {
        if(employer){
            setCompanyInfo({
                companyName: employer?.companyName,
                industry: employer?.industry || "",
                companySize: employer?.companySize || "",
                country: employer?.country || "",
                city: employer.city || "",
                companyAddress: employer.companyAddress || "",
            });
        }
    }, [employer]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCompanyInfo({
            ...companyInfo,
            [e.target.name]: e.target.value
        } as CompanyInfos);
    }
    const handleSaveCompanyInfo = async () => {
        const response = await updateCompanyInfo(companyInfo as CompanyInfos);
        if (response){
            toggleEdit();
        }
    }
    return (
        <section className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
            <div className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2">
                <button onClick={toggleEdit} type="button"
                        className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
                </button>
                <button onClick={handleSaveCompanyInfo} disabled={!isEditable} type="button"
                        className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
                </button>
            </div>
            <h3 className="font-lato text-[20px] mb-4">
                Company Information
            </h3>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
                <div className="flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Company Name</label>
                    <input
                        type="text"
                        value={
                            companyInfo?.companyName || ""
                        }
                        name="companyName"
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
                <div className="w-full flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Industry</label>
                    <CustomDropdown
                        placeholder={
                            companyInfo?.industry || ""
                        }
                        handleSelect={(option: Option)=>{
                            setCompanyInfo({
                                ...companyInfo,
                                industry: option.value
                            } as CompanyInfos);
                        }}
                        options={countries}

                        disabled={!isEditable}
                        className="rounded-[10px] text-left bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Company Size</label>
                    <CustomSelect
                        options={[
                            { value: "small", label: "1-10 Employees" },
                            { value: "medium", label: "11-50 Employees" },
                            { value: "large", label: "51-200 Employees" },
                            { value: "enterprise", label: "201+ Employees" }
                        ]}
                        placeholder={
                            companyInfo?.companySize || ""
                        }
                        onChange={(option: Option)=>{
                            setCompanyInfo({
                                ...companyInfo,
                                companySize: option.value
                            } as CompanyInfos);
                        }}
                        disabled={!isEditable}
                        className="rounded-[10px] text-left  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Country</label>
                    <CustomSelect
                        options={countries}
                        placeholder={
                            companyInfo?.country || ""
                        }
                        onChange={(option: Option)=>{
                            setCompanyInfo({
                                ...companyInfo,
                                country: option.value
                            } as CompanyInfos);
                        }}
                        disabled={!isEditable}
                        className="rounded-[10px] text-left  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">City</label>
                    <input
                        type="text"
                        value={
                            companyInfo?.city || ""
                        }
                        name="city"
                        onChange={handleChange}
                        disabled={!isEditable}
                        className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>

                <div className="w-full flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Address</label>
                    <input
                        value={
                            companyInfo?.companyAddress || ""
                        }
                        name="companyAddress"
                        onChange={handleChange}
                        type="text"
                        className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
            </div>
        </section>
    );
}

export default CompanyInfo;
