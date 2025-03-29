import Image7 from "../../../assets/images/image7.png";
import Camera from "../../../assets/images/cam.svg";
import { useAuth } from "../../../store/useAuth.ts";
import React, { useEffect, useState } from "react";
import { checkPasswordStrength } from "../../../utils/helpers.ts";
import AlertBox from "../../../components/common/AlertBox.tsx";
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


    const [profilePicture, setProfilePicture] = useState(applicant?.profilePicture);


    useEffect(() => {
        setProfilePicture(applicant?.profilePicture);
    }, [applicant]);

    const [alertData, setAlertData] = useState<{
        show: boolean;
        type: "error" | "success";
        message: string;
    }>({
        show: false,
        type: "error",
        message: "",
    });

    const [passwordChangeRequest, setPasswordChangeRequest] = useState<IPasswordChangeRequest>({
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

        if (passwordChangeRequest.confirmPassword !== passwordChangeRequest.newPassword) {
            setAlertData({
                show: true,
                type: "error",
                message: "Confirm password does not match.",
            });
            return;
        }

        const response = await changePassword(
            passwordChangeRequest.newPassword,
            passwordChangeRequest.oldPassword,
            passwordChangeRequest.confirmPassword
        );

        if (response) {
            setAlertData({
                show: true,
                type: "success",
                message: "Password changed successfully.",
            });
            setPasswordChangeRequest({
                newPassword: "",
                oldPassword: "",
                confirmPassword: "",
            });
            setPasswordStrength(-1);
        } else {
            setAlertData({
                show: true,
                type: "error",
                message: "Failed to change password.",
            });
        }
    };

    useEffect(() => {
        const uploadFile = async () => {
            return await uploadProfilePicture(
                profilePictureUploadRequest as FileUploadRequest,
                "gighub/upload"
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
    const name = (`${applicant?.firstName || ""} ${applicant?.lastName || ""}`).trim();

    const address = (`${applicant?.city || ""} ${applicant?.country || ""}`).trim();
    const role = applicant?.cv?.professionalTitle || applicant?.professionalTitle || "";

    return (
        <>
            {alertData.show && (
                <AlertBox
                    type={alertData.type}
                    message={alertData.message}
                    autoClose={true}
                    position="auto"
                />
            )}

            <div className="w-full flex justify-center items-start min-h-screen pt-12 bg-gray-100 shadow-md">
                <div className="flex flex-col w-[90%] h-auto min-h-[580px] bg-white rounded-[16px]">
                    {/* Profile Section */}
                    <div className="p-10 flex items-center gap-4">
                        <div className="relative w-[95px] h-[95px]">
                            <img
                                src={profilePicture || Image7}
                                alt="Profile"
                                className="w-full h-full rounded-full border-[4px] bg-white border-white"
                            />
                            <div
                                className="absolute bottom-[-8px] right-[-8px] bg-[#6B5AED] rounded-full
                 w-[28px] h-[28px] flex items-center justify-center cursor-pointer shadow-md
                 transform translate-x-[-30%] translate-y-[-30%]"
                            >
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
                                    className="w-[16px] h-[16px]"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold">{name}</h3>
                            <p className="text-gray-500">{address}</p>
                        </div>

                        <span className="ml-auto text-[#6438C2] font-medium">{role}</span>
                    </div>

                    <hr className="w-full border-t border-[#E6E6E6] my-3" />

                    <div className="flex flex-col px-10 self-center">
                        <h3 className="text-lg font-semibold">Change Password</h3>
                        <form className="mt-4 space-y-4">
                            <div className="flex gap-x-6">
                                {/* Current Password */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-medium">Current Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordChangeRequest.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="focus:outline-none focus:border-[#E6E6E6] focus:ring-0 w-[359px] h-[38px] px-3 border-[#E6E6E6] bg-[#F7F7F7] rounded-md outline-none"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 ml-5 font-medium">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordChangeRequest.newPassword}
                                        onChange={handlePasswordChange}
                                        className="focus:outline-none focus:border-[#E6E6E6] focus:ring-0 w-[359px] h-[38px] px-3 border-[#E6E6E6] bg-[#F7F7F7] outline-none"
                                    />

                                    {/* Password Strength Indicator */}
                                    <AnimatePresence>
                                        {passwordChangeRequest.newPassword && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="mt-1"
                                            >
                        <span
                            className="text-xs"
                            style={{ color: strengthInfo[passwordStrength]?.color }}
                        >
                          {strengthInfo[passwordStrength]?.label}
                        </span>
                                                <div className="h-1 w-full rounded bg-gray-200 mt-1">
                                                    <div
                                                        className="h-full rounded transition-all duration-300"
                                                        style={{
                                                            width: strengthInfo[passwordStrength]?.width,
                                                            backgroundColor: strengthInfo[passwordStrength]?.color,
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordChangeRequest.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="focus:outline-none focus:border-[#E6E6E6] focus:ring-0 w-[754px] h-[38px] px-3 border-[#E6E6E6] bg-[#F7F7F7] outline-none"
                                />
                                <AnimatePresence>
                                    {passwordChangeRequest.confirmPassword &&
                                        passwordChangeRequest.confirmPassword !== passwordChangeRequest.newPassword && (
                                            <motion.span
                                                initial={{ opacity: 0, y: -3 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-xs text-red-500 mt-1"
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
                                    className={`mt-4 w-[164px] h-[47px] text-white px-5 py-2 font-medium rounded-[10px] ${
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
        </>
    );
};

export default Account;
