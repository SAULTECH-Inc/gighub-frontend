import React, { useEffect } from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import fileUploaded from "../../../../assets/icons/fileUploaded.svg";
import cancelsmall from "../../../../assets/icons/cancelsmall.svg";
import { BrandAndVisuals, FileUploadRequest } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { Action } from "../../../../utils/enums.ts";

const CompanyBrandingVisualIdentity: React.FC = () => {
  const { employer } = useAuth();
  const {
    brandAndVisuals,
    setBrandAndVisuals,
    updateBrandAndVisuals,
    deleteBrandAndVisuals,
  } = useEmployerProfile();
  const [selectedFile, setSelectedFile] = React.useState<string>("");
  useEffect(() => {
    if (employer) {
      setBrandAndVisuals({
        files: employer?.brandAndVisuals || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer]);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("FILE TO BE UPLOADED ::: ", employer?.id);
    const response = await updateBrandAndVisuals({
      userId: Number(employer?.id),
      userType: employer?.userType,
      file: file,
      action: Action.PROFILE_PICTURE_UPDATE,
      whatIsTheItem: selectedFile,
    } as FileUploadRequest);
    if (response) {
      let bv = brandAndVisuals?.files || [];
      bv = [...bv, response?.url || ""];

      setBrandAndVisuals({
        ...brandAndVisuals,
        files: bv,
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
    const response = await deleteBrandAndVisuals({
      userId: Number(employer?.id),
      userType: employer?.userType,
      fileUrl: brandAndVisuals?.files?.[id],
      action: Action.DELETE_PROFILE_FILE,
      whatIsTheItem: "brandAndVisuals",
    } as FileUploadRequest);
    if (response) {
      bv = bv.filter((_, index) => index !== id);
      setBrandAndVisuals({
        ...brandAndVisuals,
        files: bv,
      } as BrandAndVisuals);
    }
  };
  const shortenFileName = (fileName: string) => {
    if (fileName.length > 15) {
      return fileName.slice(0, 15) + "...";
    }
    return fileName;
  };
  return (
    <section className="mt-4 space-y-5 border-t-[2px] border-t-[#E6E6E6] pt-5">
      <h3 className="mb-4 font-lato text-[20px]">
        Branding and Visual Identity
      </h3>
      <CustomSelect
        options={[
          { label: "Logo", value: "companyLogo" },
          { label: "Banner", value: "banner" },
          { label: "Cover Page", value: "coverPage" },
          { label: "Events", value: "events" },
          { label: "Others", value: "others" },
        ]}
        placeholder="File name"
        onChange={(option: { label: string; value: string }) => {
          setSelectedFile(option.value);
        }}
        className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
      />
      <div className="mx-auto h-[376px] w-full border border-[#E6E6E6] bg-[#FFFFFF] p-4">
        {/* Header */}
        <div className="mb-4 flex h-[42px] w-full cursor-pointer items-center justify-between rounded-[16px] border-[1px] border-[#E6E6E6] p-6">
          <span className="font-lato text-sm text-gray-700">Upload Files</span>
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
              className="cursor-pointer rounded-lg px-4 py-2 font-lato text-sm text-[#6438C2] transition duration-300"
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
              className="mx-auto flex h-[50px] w-full cursor-pointer items-center justify-between rounded-[10px] bg-[#F7F8FA] px-3 py-2"
            >
              <div className="flex items-center space-x-3">
                {/* File Icon */}
                <img src={fileUploaded} alt="uploaded file" />
                <span className="text-black-400 text-[16px]">
                  {shortenFileName(file)}
                </span>
              </div>
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="text-gray-500 hover:text-red-500"
              >
                <img src={cancelsmall} alt="Cancel" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyBrandingVisualIdentity;
