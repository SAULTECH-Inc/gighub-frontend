import { useAuth } from "../../../store/useAuth.ts";
import React, { useEffect, useState } from "react";
import { checkPasswordStrength } from "../../../utils/helpers.ts";
import { motion, AnimatePresence } from "framer-motion";
import { Action } from "../../../utils/enums.ts";
import { useFileUploadStore } from "../../../store/useFileUploadStore.ts";
import { FileUploadRequest } from "../../../utils/types";
import { RiCameraLine, RiUserLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import Image7 from "../../../assets/images/image7.png";

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
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfilePicture(applicant?.profilePicture);
  }, [applicant]);

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
    setIsLoading(true);

    if (passwordChangeRequest.confirmPassword !== passwordChangeRequest.newPassword) {
      setIsLoading(false);
      return;
    }

    try {
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
      }
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
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
  }, [profilePictureUploadRequest, uploadProfilePicture, resetProfilePictureUploadRequest]);

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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const name = `${applicant?.firstName || ""} ${applicant?.lastName || ""}`.trim();
  const address = `${applicant?.city || ""} ${applicant?.country || ""}`.trim();
  const role = applicant?.cv?.professionalTitle || applicant?.professionalTitle || "";

  return (
    <section className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <RiUserLine className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Account Settings
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Manage your profile information and account security settings.
        </p>
      </div>

      {/* Profile Section Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-lg">Profile Information</h3>
          <p className="text-sm text-gray-600 mt-1">Your basic profile details and photo</p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                <img
                  src={profilePicture || Image7}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={triggerImagePick}
                className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
              >
                <RiCameraLine className="h-4 w-4 text-white" />
              </button>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{name || "Your Name"}</h3>
              <p className="text-gray-600 mt-1">{address || "Your Location"}</p>
              {role && <p className="text-blue-600 font-medium mt-2">{role}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Password Section Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <RiLockPasswordLine className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Security Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.oldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordChangeRequest.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('oldPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.oldPassword ? <RiEyeOffLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordChangeRequest.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.newPassword ? <RiEyeOffLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <AnimatePresence>
                  {passwordChangeRequest.newPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-medium"
                          style={{ color: strengthInfo[passwordStrength]?.color }}
                        >
                          {strengthInfo[passwordStrength]?.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          Password strength
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordChangeRequest.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirmPassword ? <RiEyeOffLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
                </button>
              </div>

              <AnimatePresence>
                {passwordChangeRequest.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    {passwordChangeRequest.confirmPassword === passwordChangeRequest.newPassword ? (
                      <>
                        <RiCheckLine className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <RiCloseLine className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={!isFormValid || isLoading}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                  ${isFormValid && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Account;