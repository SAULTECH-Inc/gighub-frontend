import Image7 from "../../../assets/images/image7.png";
import Camera from "../../../assets/images/cam.svg";
import { useAuth } from "../../../store/useAuth.ts";
import React, { useEffect, useState } from "react";
import { checkPasswordStrength } from "../../../utils/helpers.ts";
import { motion, AnimatePresence } from "framer-motion";
import { Action } from "../../../utils/enums.ts";
import { useFileUploadStore } from "../../../store/useFileUploadStore.ts";
import { FileUploadRequest } from "../../../utils/types";

interface IPasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface IStrengthInfo {
  label: string;
  color: string;
  width: string;
}

const strengthInfo: Record<number | "-1", IStrengthInfo> = {
  "-1": { label: "Too weak", color: "#ef4444", width: "20%" },
  0: { label: "Weak", color: "#facc15", width: "33%" },
  1: { label: "Moderate", color: "#f59e0b", width: "66%" },
  2: { label: "Strong", color: "#22c55e", width: "100%" },
};

const Account = () => {
  const { applicant, changePassword } = useAuth();
  const {
    profilePictureUploadRequest,
    setProfilePictureUploadRequest,
    uploadProfilePicture,
    resetProfilePictureUploadRequest,
  } = useFileUploadStore();

  const [profilePicture, setProfilePicture] = useState(
    applicant?.profilePicture,
  );

  useEffect(() => {
    setProfilePicture(applicant?.profilePicture);
  }, [applicant]);

  const [passwordChangeRequest, setPasswordChangeRequest] =
    useState<IPasswordChangeRequest>({
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
    });

  const [passwordStrength, setPasswordStrength] = useState<number>(-1);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    setPasswordChangeRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      passwordChangeRequest.confirmPassword !==
      passwordChangeRequest.newPassword
    ) {
      return;
    }

    const response = await changePassword(
      passwordChangeRequest.newPassword,
      passwordChangeRequest.oldPassword,
      passwordChangeRequest.confirmPassword,
    );

    if (response) {
      setPasswordChangeRequest({
        newPassword: "",
        oldPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(-1);
    } else {
      /* empty */
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      return await uploadProfilePicture(
        profilePictureUploadRequest as FileUploadRequest,
        "gighub/upload",
      );
    };

    if (profilePictureUploadRequest?.file) {
      uploadFile().then((resp) => {
        if (resp) {
          setProfilePicture(resp.url as string);
          resetProfilePictureUploadRequest();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilePictureUploadRequest]);

  const isFormValid =
    passwordChangeRequest.oldPassword &&
    passwordChangeRequest.newPassword &&
    passwordChangeRequest.confirmPassword &&
    passwordStrength >= 1 &&
    passwordChangeRequest.newPassword === passwordChangeRequest.confirmPassword;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfilePictureUploadRequest({
        file: files[0],
        userId: applicant?.id as number,
        whatIsTheItem: "profilePicture",
        userType: "applicant",
        action: Action.PROFILE_PICTURE_UPDATE,
      });
    }
  };

  const triggerImagePick = () => {
    document.getElementById("profilePic")?.click();
  };
  const name =
    `${applicant?.firstName || ""} ${applicant?.lastName || ""}`.trim();

  const address = `${applicant?.city || ""} ${applicant?.country || ""}`.trim();
  const role =
    applicant?.cv?.professionalTitle || applicant?.professionalTitle || "";

  return (
    <div className="bg-gray-100 flex min-h-screen w-full items-start justify-center pt-12 shadow-md">
      <div className="flex h-auto min-h-[680px] w-[90%] flex-col rounded-[16px] bg-white md:min-h-[590px]">
        {/* Profile Section */}
        <div className="flex items-center gap-4 p-10">
          <div className="relative h-[95px] w-[95px]">
            <img
              src={profilePicture || Image7}
              alt="Profile"
              className="h-full w-full rounded-full border-[4px] border-white bg-white"
            />
            <div className="absolute bottom-[-8px] right-[-8px] flex h-[28px] w-[28px] translate-x-[-30%] translate-y-[-30%] transform cursor-pointer items-center justify-center rounded-full bg-[#6B5AED] shadow-md">
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                className="hidden"
                accept="image/*"
                capture="environment"
                hidden
                onChange={handleImageUpload}
              />
              <img
                onClick={triggerImagePick}
                src={Camera}
                alt="Edit Profile"
                className="h-[16px] w-[16px]"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-gray-500">{address}</p>
          </div>

          <span className="ml-auto font-medium text-[#6438C2]">{role}</span>
        </div>

        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        <div className="flex w-full flex-col self-center px-10">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <form className="mt-4 flex w-full flex-col gap-y-8">
            <div className="flex w-full flex-col gap-y-8 md:flex-row md:gap-x-6">
              {/* Current Password */}
              <div className="flex w-full flex-col">
                <label className="text-gray-700 font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordChangeRequest.oldPassword}
                  onChange={handlePasswordChange}
                  className="h-[38px] w-full rounded-md border-[#E6E6E6] bg-[#F7F7F7] px-3 outline-none focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                />
              </div>

              {/* New Password */}
              <div className="flex w-full flex-col">
                <label className="text-gray-700 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordChangeRequest.newPassword}
                  onChange={handlePasswordChange}
                  className="h-[38px] border-[#E6E6E6] bg-[#F7F7F7] px-3 outline-none focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                />

                {/* Password Strength Indicator */}
                <AnimatePresence>
                  {passwordChangeRequest.newPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className=""
                    >
                      <span
                        className="text-xs"
                        style={{ color: strengthInfo[passwordStrength]?.color }}
                      >
                        {strengthInfo[passwordStrength]?.label}
                      </span>
                      <div className="bg-gray-200 mt-1 h-1 w-full rounded">
                        <div
                          className="h-full rounded transition-all duration-300"
                          style={{
                            width: strengthInfo[passwordStrength]?.width,
                            backgroundColor:
                              strengthInfo[passwordStrength]?.color,
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex w-full flex-col">
              <label className="text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordChangeRequest.confirmPassword}
                onChange={handlePasswordChange}
                className="h-[38px] w-full border-[#E6E6E6] bg-[#F7F7F7] px-3 outline-none focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
              />
              <AnimatePresence>
                {passwordChangeRequest.confirmPassword &&
                  passwordChangeRequest.confirmPassword !==
                    passwordChangeRequest.newPassword && (
                    <motion.span
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-xs text-red-500"
                    >
                      Passwords do not match
                    </motion.span>
                  )}
              </AnimatePresence>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={!isFormValid}
                className={`mt-4 h-[47px] rounded-[10px] px-5 py-2 font-medium text-white md:w-[164px] ${
                  isFormValid
                    ? "bg-[#6438C2] hover:bg-[#5730af]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
