import React, { useEffect } from "react";
import JumiaProfile from "../../../../assets/images/JumiaProfile.png";
import Camera from "../../../../assets/icons/Camera.svg";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { Action } from "../../../../utils/enums.ts";
import { EmployerData, FileUploadRequest } from "../../../../utils/types";

const ProfileCard: React.FC = () => {
    const { employer } = useAuth();
    const { uploadFile, employerProfile, setEmployerProfile } = useEmployerProfile();

    useEffect(() => {
        if (employer) {
            setEmployerProfile({
                ...employerProfile,
                companyLogo: employer?.companyLogo ? employer.companyLogo : JumiaProfile
            } as EmployerData);
        }
    }, [employer]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return; // Prevent errors if no file is selected

        try {
            const response = await uploadFile({
                file,
                userId: Number(employer?.id),
                userType: employer?.userType,
                whatIsTheItem: "companyLogo",
                action: Action.PROFILE_PICTURE_UPDATE,
            } as FileUploadRequest);

            if (response?.url) {
                console.log("Uploaded URL: " + response.url);
                setEmployerProfile({
                    ...employerProfile,
                    companyLogo: response.url
                } as EmployerData);
            }
        } catch (error) {
            console.error("File upload failed:", error);
        }
    };

    const handleTriggerFileUploadButton = () => {
        document.getElementById("file-dialog-opener")?.click();
    };

    return (
        <div className="flex items-center justify-between bg-[#6438C2] text-white p-4 rounded-t-[16px] w-full h-[123px] mx-auto">
            {/* Left Section: Logo and Details */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="relative">
                    <img
                        src={employerProfile?.companyLogo || ""}
                        alt="Company Logo"
                        className="w-[55px] h-[55px] md:w-[75px] md:h-[75px] lg:w-[95px] lg:h-[95px] rounded-full border-[4px] bg-white border-white"
                    />
                    <input
                        id="file-dialog-opener"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <button
                        className="absolute bottom-0 right-0 bg-white border-2 border-white rounded-full w-[22px] h-[22px] md:w-[26px] md:h-[26px] flex items-center justify-center cursor-pointer"
                        onClick={handleTriggerFileUploadButton}
                        aria-label="Upload company logo"
                    >
                        <img src={Camera} alt="Upload" className="w-3 md:w-4" />
                    </button>
                </div>

                {/* Company Details */}
                <div>
                    <h2 className="text-sm md:text-base lg:text-lg font-semibold">
                        {employerProfile?.companyName || "Jumia Africa"}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-200">Lagos, Nigeria</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
