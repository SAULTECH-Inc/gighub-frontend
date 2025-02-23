import React, {useEffect} from "react";
import Image7 from "../../../../assets/images/image7.png";
import Camera from "../../../../assets/icons/Camera.svg";
import { useAuth } from "../../../../store/useAuth.ts";
import { useJobPreferenceStore } from "../../../../store/useJobPreferenceStore.ts";
import {useFileUploadStore} from "../../../../store/useFileUploadStore.ts";
import {FileUploadRequest} from "../../../../utils/types";

const ApplicantProfileCard: React.FC = () => {
    const { applicant, updateProfile } = useAuth();
    const { preferences, addPreference } = useJobPreferenceStore();
    const {profilePictureUploadRequest,
        profilePictureUploadResponse,
        setProfilePictureUploadRequest,
        uploadProfilePicture,
        resetProfilePictureUploadRequest
    } = useFileUploadStore();

    useEffect(() => {
        const uploadFile = async () => {
                return  await uploadProfilePicture(profilePictureUploadRequest as FileUploadRequest,'gighub/upload');
        }
        if(profilePictureUploadRequest?.file){
            uploadFile().then((success) => {
                if(success){
                    resetProfilePictureUploadRequest();
                }
            });
        }
    },[profilePictureUploadRequest]);
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {

            // Update the global form store
            setProfilePictureUploadRequest({
                file: file,
                userId: applicant?.id as number,
                whatIsTheItem: "profilePicture",
                userType: "applicant",
                action: "PROFILE_PICTURE_UPDATE",
            });
        }
    };

    const handleSaveChanges = async () => {
        if (applicant) {
            if (preferences) {
                await addPreference(preferences);
            }
            updateProfile(applicant);
        }
    };

    const handleFileUpload = () => {
        const fileInput = document.getElementById("file-dialog-opener") as HTMLInputElement;
        fileInput.click();
    };

    return (
        <div className="flex items-center justify-between bg-[#6438C2] text-white p-4 rounded-t-[16px] w-full h-[123px] mx-auto">
            {/* Left Section: Logo and Details */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="relative">
                    <img
                        src={
                            profilePictureUploadResponse?.url || Image7
                        }
                        alt="Profile Picture"
                        className="w-[60px] h-[60px] md:w-[85px] md:h-[85px] lg:w-[95px] lg:h-[95px] rounded-full border-[4px] bg-white border-white"
                    />
                    <input
                        id="file-dialog-opener"
                        type="file"
                        hidden={true}
                        onChange={handleFileChange}
                    />
                    <div
                        className="absolute bottom-0 right-0 bg-white border-2 border-white rounded-full w-[20px] h-[20px] lg:w-[26px] lg:h-[26px] p-1 cursor-pointer"
                        onClick={handleFileUpload}
                    >
                        <img src={Camera} alt="file dialog button icon" />
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-y-1 lg:gap-y-2">
                    <h2 className="text-[11px] md:text-[20px] lg:text-lg font-semibold">
                        {applicant?.firstName + " " + applicant?.lastName}
                    </h2>
                    <p className="text-[10px] md:text-[15px] lg:text-sm text-gray-200">Lagos Nigeria</p>
                </div>
            </div>

            {/* Save Changes Button */}
            <button
                onClick={handleSaveChanges}
                className="bg-white font-lato p-2 md:py-3 md:px-5 rounded-[16px] lg:py-2 shadow lg:px-6 hover:bg-gray-200 text-[11px] md:text-lg lg:text-[20px] text-[#000000] transition"
            >
                Update Profile
            </button>
        </div>
    );
};

export default ApplicantProfileCard;
