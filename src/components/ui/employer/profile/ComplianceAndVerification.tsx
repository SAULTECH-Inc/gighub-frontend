import React, {useEffect} from "react";
import {useEmployerProfile} from "../../../../store/useEmployerProfile.ts";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import {ComplianceAndVerifications} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";

const ComplianceAndVerification: React.FC = ()=>{
    const{employer} = useAuth();
    const {complianceAndVerification,setComplianceAndVerification, updateComplianceAndVerification} = useEmployerProfile();
    const {isEditable, toggleEdit} = useSectionEditable("complianceAndVerification");
    useEffect(() => {
        if(employer){
            setComplianceAndVerification({
                registrationNumber: employer?.registrationNumber || "",
                taxIdentificationNumber: employer?.taxIdentificationNumber || "",
            });
        }
    }, [employer]);
    const handleToggleEdit = () => {
        toggleEdit();
    };
    const handleSaveComplianceVerification = async () => {
        const response = await updateComplianceAndVerification(complianceAndVerification as ComplianceAndVerifications);
        if(response) {
            toggleEdit();
        }
    }
    return (<section className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
        <div
            className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2 z-10">
            <button type="button" onClick={handleToggleEdit}
                    className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
            </button>
            <button type="button"
                    onClick={handleSaveComplianceVerification}
                    className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
            </button>
        </div>
        <h3 className="font-lato text-[20px] mb-4">
            Compliance and Verifications
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Business Registration Number</label>
                <input
                    type="text"
                    value={complianceAndVerification?.registrationNumber}
                    disabled={!isEditable}
                    onChange={event => {
                        setComplianceAndVerification({
                           ...complianceAndVerification,
                            registrationNumber: event.target.value
                        });
                    }}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Tax Identification number</label>
                <input
                    type="text"
                    value={complianceAndVerification?.taxIdentificationNumber}
                    disabled={!isEditable}
                    onChange={event => {
                        setComplianceAndVerification({
                           ...complianceAndVerification,
                            taxIdentificationNumber: event.target.value
                        });
                    }}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
    </section>);
}

export default ComplianceAndVerification;
