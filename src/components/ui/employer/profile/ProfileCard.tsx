import React, { useEffect } from "react";
import JumiaProfile from "../../../../assets/images/JumiaProfile.png";
import Camera from "../../../../assets/icons/Camera.svg";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { Action } from "../../../../utils/enums.ts";
import { EmployerData, FileUploadRequest } from "../../../../utils/types";
import { AVATAR_API_URL } from "../../../../utils/constants.ts";

const ProfileCard: React.FC = () => {
  const { employer } = useAuth();
  const { uploadFile, employerProfile, setEmployerProfile } =
    useEmployerProfile();

  useEffect(() => {
    if (employer) {
      setEmployerProfile({
        ...employerProfile,
        companyLogo: employer?.companyLogo
          ? employer.companyLogo
          : JumiaProfile,
      } as EmployerData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          companyLogo: response.url,
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
    <div className="mx-auto flex h-[123px] w-full items-center justify-between rounded-t-[16px] bg-[#6438C2] p-4 text-white">
      {/* Left Section: Logo and Details */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="relative">
          <img
            src={
              (employerProfile?.companyLogo as string) ||
              AVATAR_API_URL.concat(employer?.companyName as string)
            }
            alt="Company Logo"
            className="h-[55px] w-[55px] rounded-full border-[4px] border-white bg-white md:h-[75px] md:w-[75px] lg:h-[95px] lg:w-[95px]"
          />
          <input
            id="file-dialog-opener"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            className="absolute right-0 bottom-0 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-2 border-white bg-white md:h-[26px] md:w-[26px]"
            onClick={handleTriggerFileUploadButton}
            aria-label="Upload company logo"
          >
            <img src={Camera} alt="Upload" className="w-3 md:w-4" />
          </button>
        </div>

        {/* Company Details */}
        <div>
          <h2 className="text-sm font-semibold md:text-base lg:text-lg">
            {employerProfile?.companyName || "Company"}
          </h2>
          {!employerProfile?.city && employerProfile?.country && (
            <p className="text-xs text-gray-200 md:text-sm">
              {employerProfile?.city || "City"},{" "}
              {employerProfile?.country || "Country"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
