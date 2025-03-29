import React, {useEffect} from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";
import {useEmployerProfile} from "../../../../store/useEmployerProfile.ts";
import fileUploaded from "../../../../assets/icons/fileUploaded.svg";
import cancelsmall from "../../../../assets/icons/cancelsmall.svg";
import {BrandAndVisuals, FileUploadRequest} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";
import {Action} from "../../../../utils/enums.ts";

const CompanyBrandingVisualIdentity: React.FC = ()=>{
    const{employer} = useAuth();
    const {brandAndVisuals, setBrandAndVisuals, updateBrandAndVisuals, deleteBrandAndVisuals} = useEmployerProfile();
    const [selectedFile, setSelectedFile] = React.useState<string>("");
    useEffect(() => {
        if (employer){
            setBrandAndVisuals({
                files: employer?.brandAndVisuals || []
            });
        }
    }, [employer]);
    const handleFileUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log("FILE TO BE UPLOADED ::: ", employer?.id);
        const response = await updateBrandAndVisuals({
            userId: Number(employer?.id),
            userType: employer?.userType,
            file: file,
            action: Action.PROFILE_PICTURE_UPDATE,
            whatIsTheItem: selectedFile
        }as FileUploadRequest);
        if (response){
            let bv = brandAndVisuals?.files || [];
            bv = [...bv, response?.url || ""];

            setBrandAndVisuals({
                ...brandAndVisuals,
                files: bv
            } as BrandAndVisuals);
            setSelectedFile("");
        }
    };
    const handleTriggerFileUpload = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput?.click();
    };


    const handleRemove = async (id: number) => {
        let bv = brandAndVisuals?.files || [];
        const response= await deleteBrandAndVisuals({
            userId: Number(employer?.id),
            userType: employer?.userType,
            fileUrl: brandAndVisuals?.files?.[id],
            action: Action.DELETE_PROFILE_FILE,
            whatIsTheItem: "brandAndVisuals",
        } as FileUploadRequest);
        if (response){
            bv = bv.filter((_, index) => index!== id);
            setBrandAndVisuals({
                ...brandAndVisuals,
                files: bv
            } as BrandAndVisuals);
        }
    };
    const shortenFileName = (fileName: string) => {
        if (fileName.length > 15){
            return fileName.slice(0, 15) + "...";
        }
        return fileName;
    };
    return (<section className="space-y-5 mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <h3 className="font-lato text-[20px] mb-4">
            Branding and Visual Identity
        </h3>
        <CustomSelect
            options={[
                {label: "Logo", value: "companyLogo"},
                {label: "Banner", value: "banner"},
                {label: "Cover Page", value: "coverPage"},
                {label: "Events", value: "events"},
                {label: "Others", value: "others"},
            ]}
            placeholder="File name"
            onChange={(option: { label: string; value: string }) => {
                setSelectedFile(option.value);
            }}
            className="rounded-[10px] text-left bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
        />
        <div className="border border-[#E6E6E6]  p-4 w-full h-[376px] bg-[#FFFFFF] mx-auto">
            {/* Header */}
            <div
                className="cursor-pointer flex justify-between items-center p-6 mb-4 border-[1px] border-[#E6E6E6] h-[42px] w-full rounded-[16px]">
                <span className="text-sm font-lato text-gray-700">Upload Files</span>
                <div className="relative inline-block">
                    {/* Hidden native file input */}
                    <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {/* Custom button for file upload */}
                    <button
                        type="button"
                        onClick={handleTriggerFileUpload}
                        disabled={selectedFile === null || selectedFile === ""}
                        className="cursor-pointer text-[#6438C2] text-sm font-lato px-4 py-2 rounded-lg transition duration-300"
                    >
                        Browse File
                    </button>
                </div>

            </div>

            {/* File List */}
            <div className="space-y-2">
                {brandAndVisuals?.files?.map((file: string, id) => (
                    <div
                        key={id}
                        className="cursor-pointer flex justify-between items-center bg-[#F7F8FA] px-3 py-2 rounded-[10px] w-full h-[50px] mx-auto"
                    >
                        <div className="flex items-center space-x-3">
                            {/* File Icon */}
                            <img src={fileUploaded} alt="uploaded file"/>
                            <span className="text-[16px] text-black-400">{shortenFileName(file)}</span>
                        </div>
                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => handleRemove(id)}
                            className="text-gray-500 hover:text-red-500"
                        >
                            <img src={cancelsmall} alt="Cancel"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>);
}

export default CompanyBrandingVisualIdentity;
