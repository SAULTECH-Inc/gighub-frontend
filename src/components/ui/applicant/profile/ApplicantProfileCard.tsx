import React, { useEffect } from "react";
import Image7 from "../../../../assets/images/image7.png";
import Camera from "../../../../assets/icons/Camera.svg";
import { useAuth } from "../../../../store/useAuth.ts";
import { useFileUploadStore } from "../../../../store/useFileUploadStore.ts";
import { EmployerData, FileUploadRequest } from "../../../../utils/types";
import { Action, UserType } from "../../../../utils/enums.ts";
import { USER_TYPE } from "../../../../utils/helpers.ts";

const ApplicantProfileCard: React.FC = () => {
  const { applicant, employer, setApplicantData, setEmployerData } = useAuth();
  const {
    profilePictureUploadRequest,
    setProfilePictureUploadRequest,
    uploadProfilePicture,
    resetProfilePictureUploadRequest,
  } = useFileUploadStore();

  useEffect(() => {
    const uploadFile = async () => {
      console.log("Uploading file...");
      return await uploadProfilePicture(
        profilePictureUploadRequest as FileUploadRequest,
        "gighub/upload",
      );
    };
    if (profilePictureUploadRequest) {
      uploadFile().then((response) => {
        if (response) {
          if (USER_TYPE === UserType.APPLICANT) {
            setApplicantData({
              ...applicant,
              profilePicture: response?.url as string,
            });
          } else {
            setEmployerData({
              ...employer,
              companyLogo: response?.url as string,
            } as EmployerData);
          }
          resetProfilePictureUploadRequest();
        }
      });
    }
  }, [
    applicant,
    employer,
    profilePictureUploadRequest,
    resetProfilePictureUploadRequest,
    setApplicantData,
    setEmployerData,
    uploadProfilePicture,
  ]);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // Update the global form store
      setProfilePictureUploadRequest({
        file: file,
        userId: (USER_TYPE === UserType.APPLICANT
          ? applicant?.id
          : employer?.id) as number,
        whatIsTheItem: "profilePicture",
        userType: USER_TYPE,
        action: Action.PROFILE_PICTURE_UPDATE,
      });
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.getElementById(
      "file-dialog-opener",
    ) as HTMLInputElement;
    fileInput.click();
  };

  return (
    <div className="mx-auto flex h-[123px] w-full items-center justify-between rounded-t-[16px] bg-[#6438C2] p-4 text-white">
      {/* Left Section: Logo and Details */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="relative">
          <img
            src={
              USER_TYPE === UserType.APPLICANT
                ? applicant?.profilePicture || Image7
                : employer?.companyLogo || Image7
            }
            alt="Profile Picture"
            className="h-[80px] w-[80px] rounded-full border-[4px] border-white bg-white md:h-[85px] md:w-[85px] lg:h-[95px] lg:w-[95px]"
          />
          <input
            id="file-dialog-opener"
            type="file"
            hidden={true}
            onChange={handleFileChange}
          />
          <div
            className="absolute right-0 bottom-0 h-[20px] w-[20px] cursor-pointer rounded-full border-2 border-white bg-white p-1 lg:h-[26px] lg:w-[26px]"
            onClick={handleFileUpload}
          >
            <img src={Camera} alt="file dialog button icon" />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-y-1 lg:gap-y-2">
          <h2 className="text-[16px] font-semibold md:text-[20px] lg:text-lg">
            {applicant?.firstName + " " + applicant?.lastName}
          </h2>
          <p className="text-[14px] text-gray-200 md:text-[15px] lg:text-sm">
            Lagos Nigeria
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileCard;
