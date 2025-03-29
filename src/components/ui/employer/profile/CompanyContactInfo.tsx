import React, {useEffect} from "react";
import {useEmployerProfile} from "../../../../store/useEmployerProfile.ts";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import {ContactInfo} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";

const CompanyContactInfo: React.FC = ()=>{
    const {employer} = useAuth();
    const {contactInfo, setContactInfo, updateContactInfo} = useEmployerProfile();
    const {isEditable, toggleEdit} = useSectionEditable("companyContactInfo");
    useEffect(() => {
        if (employer){
            setContactInfo({
                managerEmail: employer.managerEmail || "",
                managerPhoneNumber: employer.managerPhoneNumber || "",
                companyPhone: employer.companyPhone || "",
                email: employer.email || "",
            });
        }
    }, [employer]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setContactInfo({
            ...contactInfo,
            [e.target.name]: e.target.value
        } as ContactInfo);
    }
    const handleSaveCompanyContactInfo = async () => {
        const response = await updateContactInfo(contactInfo as ContactInfo);
        if (response){
            toggleEdit();
        }
    }
    return (<section className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <div className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2">
            <button onClick={toggleEdit} type="button"
                    className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
            </button>
            <button onClick={handleSaveCompanyContactInfo} disabled={!isEditable} type="button"
                    className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
            </button>
        </div>
        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Contact Information
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Email Address</label>
                <input
                    type="email"
                    value={contactInfo?.email || ""}
                    name="email"
                    onChange={handleChange}
                    disabled={true}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Phone Number</label>
                <input
                    type="tel"
                    value={contactInfo?.companyPhone || ""}
                    name="companyPhone"
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Manager Email</label>
                <input
                    type="email"
                    value={contactInfo?.managerEmail || ""}
                    name="managerEmail"
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Manager Phone Number</label>
                <input
                    type="tel"
                    value={contactInfo?.managerPhoneNumber || ""}
                    name="managerPhoneNumber"
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>

    </section>);
}

export default CompanyContactInfo;
