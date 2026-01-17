import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCameraLine,
  RiUserLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiCheckLine,
  RiCloseLine,
  RiShieldCheckLine,
  RiSmartphoneLine,
  RiKeyLine,
  RiAlertLine,
  RiQrCodeLine,
  RiRefreshLine,
  RiDeleteBinLine,
  RiSave3Line,
  RiLogoutBoxLine,
  RiComputerLine,
  RiTimeLine,
} from "react-icons/ri";
import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import { toast } from "react-toastify";
import {
  changePassword,
  deleteAccount,
  disableTwoFactor,
  enableTwoFactor,
  generate2faQrCodeAndSecret,
  regenerateBackupCodes,
} from "../../../services/api";
import {
  APIResponse, DeviceContext,
  GenerateQrcodeResponse, Session,
  TwoFactorEnabledResponse
} from "../../../utils/types";
import { useAuth } from "../../../store/useAuth.ts";
import { isCurrentSession, USER_TYPE } from "../../../utils/helpers.ts";
import { UserType } from "../../../utils/enums.ts";
import { useSettingsStore } from "../../../store/useSettingsStore.ts";
import ConfirmationDialog from "../../../components/ui/Prompts.tsx";
import { useUserDeviceLocations } from "../../../hooks/useUserDeviceLocations.ts";
import moment from "moment";

type StrengthLevel = {
  label: string;
  color: string;
  width: string;
};

const checkPasswordStrength = (password: string): number => {
  if (!password) return -1;
  if (password.length < 6) return -1;
  if (password.length < 8) return 0;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  if (hasUpper && hasNumber && hasSpecial) return 2;
  if ((hasUpper && hasNumber) || (hasNumber && hasSpecial)) return 1;
  return 0;
};

const strengthInfo: Record<number, StrengthLevel> = {
  [-1]: { label: "Too weak", color: "#ef4444", width: "20%" },
  0: { label: "Weak", color: "#facc15", width: "33%" },
  1: { label: "Moderate", color: "#f59e0b", width: "66%" },
  2: { label: "Strong", color: "#22c55e", width: "100%" },
};

interface ShowPasswordParams {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  location: string | null;
  role: string | null;
  profilePicture: string | null;
}

const Account = () => {
  const { applicant, employer, logout } = useAuth();
  const { employerSettings, applicantSettings } = useSettingsStore();

  // User profile state
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    location: null,
    role: null,
    profilePicture: null,
  });

  // Password change state
  const [passwordChangeRequest, setPasswordChangeRequest] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState<ShowPasswordParams>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(-1);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    USER_TYPE === UserType.APPLICANT ? applicantSettings?.enable2fa : employerSettings?.enable2fa
  );
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disable2FACode, setDisable2FACode] = useState("");
  const [regenerateCode, setRegenerateCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  // Security settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const { data: Res } = useUserDeviceLocations();

  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (Res?.data && Res?.data?.length > 0) {
      const devices: DeviceContext[] = Res.data || [];
      const mapped = devices.map((d) => {
        return ({
          id: d.deviceId,
          device: d.device,
          location: d.location,
          lastActive: moment(d.lastActive).fromNow(),
          current: isCurrentSession(d)
        });
      });
      setSessions(mapped);
    }
  }, [Res?.data]);

  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  // Update user profile when applicant/employer changes
  useEffect(() => {
    if (USER_TYPE === UserType.APPLICANT && applicant) {
      setUser({
        name: `${applicant.firstName} ${applicant.lastName}`,
        email: applicant.email || "",
        location:
          applicant?.city && applicant?.country
            ? `${applicant.city}, ${applicant.country}`
            : null,
        role: applicant?.cv?.professionalTitle || applicant?.professionalTitle || null,
        profilePicture: applicant?.profilePicture || null,
      });
    } else if (USER_TYPE === UserType.EMPLOYER && employer) {
      setUser({
        name: employer?.companyName || "",
        email: employer?.email || "",
        location:
          employer?.city && employer?.country ? `${employer.city}, ${employer.country}` : null,
        role: null,
        profilePicture: employer?.companyLogo || null,
      });
    }
  }, [applicant, employer]);

  // Sync 2FA status with settings
  useEffect(() => {
    const enabled =
      USER_TYPE === UserType.APPLICANT ? applicantSettings?.enable2fa : employerSettings?.enable2fa;
    setTwoFactorEnabled(enabled || false);
  }, [applicantSettings?.enable2fa, employerSettings?.enable2fa]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
    setPasswordChangeRequest((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof ShowPasswordParams): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSavePassword = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsPasswordLoading(true);

    try {
      const response = await changePassword(passwordChangeRequest);
      if (response.statusCode === 200) {
        setPasswordChangeRequest({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength(-1);
        toast.success("Password changed successfully!");
      } else {
        toast.error(response.message || "Password change unsuccessful");
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
      console.error("Password change error:", error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const isPasswordFormValid =
    passwordChangeRequest.oldPassword &&
    passwordChangeRequest.newPassword &&
    passwordChangeRequest.confirmPassword &&
    passwordStrength >= 1 &&
    passwordChangeRequest.newPassword === passwordChangeRequest.confirmPassword;

  // 2FA Functions
  const handleGenerate2FA = async () => {
    setIs2FALoading(true);
    try {
      const email = USER_TYPE === UserType.APPLICANT ? applicant.email : employer?.email;
      if (!email) {
        toast.error("User email not found");
        return;
      }

      const response: APIResponse<GenerateQrcodeResponse> = await generate2faQrCodeAndSecret(email);
      if (response.statusCode === 201 && response.data) {
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
        setShowSetup2FA(true);
      } else {
        toast.error(response.message || "Failed to generate 2FA");
      }
    } catch (error) {
      toast.error("An error occurred while generating 2FA");
      console.error("Generate 2FA error:", error);
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.warning("Please enter a valid 6-digit code");
      return;
    }
    setIs2FALoading(true);

    try {
      const response: APIResponse<TwoFactorEnabledResponse> = await enableTwoFactor(
        secret,
        verificationCode
      );
      if (response.statusCode === 200 && response.data) {
        const codes = response.data.backupCodes;
        setBackupCodes(codes);
        setTwoFactorEnabled(true);
        setShowBackupCodes(true);
        setShowSetup2FA(false);
        setVerificationCode("");

        // // Update settings
        // if (USER_TYPE === UserType.APPLICANT) {
        //   const updatedSettings = { ...applicantSettings, enable2fa: true };
        //   await updateUserSettings(updatedSettings, UserType.APPLICANT);
        // } else {
        //   const updatedSettings = { ...employerSettings, enable2fa: true };
        //   await updateUserSettings(updatedSettings, UserType.EMPLOYER);
        // }

        toast.success("2FA enabled successfully!");
      } else {
        toast.error(response.message || "Failed to enable 2FA");
      }
    } catch (error) {
      toast.error("An error occurred while enabling 2FA");
      console.error("Enable 2FA error:", error);
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (disable2FACode.length !== 6) {
      toast.warning("Please enter a valid 6-digit code");
      return;
    }
    setIs2FALoading(true);

    try {
      const response: APIResponse<void> = await disableTwoFactor(disable2FACode);
      if (response.statusCode === 200) {
        setTwoFactorEnabled(false);
        setBackupCodes([]);
        setShowDisable2FAModal(false);
        setDisable2FACode("");

        // // Update settings
        // if (USER_TYPE === UserType.APPLICANT) {
        //   const updatedSettings = { ...applicantSettings, enable2fa: false };
        //   await updateUserSettings(updatedSettings, UserType.APPLICANT);
        // } else {
        //   const updatedSettings = { ...employerSettings, enable2fa: false };
        //   await updateUserSettings(updatedSettings, UserType.EMPLOYER);
        // }

        toast.success("2FA disabled successfully");
      } else {
        toast.error(response.message || "Failed to disable 2FA");
      }
    } catch (error) {
      toast.error("An error occurred while disabling 2FA");
      console.error("Disable 2FA error:", error);
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (regenerateCode.length !== 6) {
      toast.warning("Please enter a valid 6-digit code");
      return;
    }
    setIs2FALoading(true);

    try {
      const response = await regenerateBackupCodes(regenerateCode);
      if (response.statusCode === 200 && response.data) {
        const codes: string[] = response.data.backupCodes;
        setBackupCodes(codes);
        setShowBackupCodes(true);
        setShowRegenerateModal(false);
        setRegenerateCode("");
        toast.success("Backup codes regenerated successfully");
      } else {
        toast.error(response.message || "Failed to regenerate backup codes");
      }
    } catch (error) {
      toast.error("An error occurred while regenerating backup codes");
      console.error("Regenerate backup codes error:", error);
    } finally {
      setIs2FALoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.info("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const downloadBackupCodes = () => {
    const content = `Backup Codes for ${user.email}\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join("\n")}\n\nKeep these codes safe. Each can only be used once.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "2fa-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  const handleDelete = async () => {
    try {
      const response = await deleteAccount();
      if (response.statusCode === 200) {
        toast.success("Account deleted successfully");
        await logout();
      } else {
        toast.error(response.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred while deleting account");
      console.error("Delete account error:", error);
    }
  };

  const handleToggle2FA = (state: boolean) => {
    if (state) {
      handleGenerate2FA().then(r => r);
    } else {
      // Show modal to confirm disable with 2FA code
      setShowDisable2FAModal(true);
    }
  };

  return (
    <section className="flex w-full flex-col space-y-6 px-4 py-10 md:px-8">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-2 flex items-center space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <RiUserLine className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        </div>
        <p className="text-sm text-gray-600">
          Manage your profile, security, and account preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          <p className="mt-1 text-sm text-gray-600">Your basic profile details</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                <img
                  src={user?.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:bg-blue-700">
                <RiCameraLine className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{user.name || "User"}</h3>
              {user?.location && <p className="mt-1 text-gray-600">{user.location}</p>}
              {user.role && <p className="mt-2 font-medium text-blue-600">{user.role}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RiShieldCheckLine className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <ToggleSwitch
              isOn={twoFactorEnabled}
              onToggle={handleToggle2FA}
              disabled={is2FALoading}
            />
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!twoFactorEnabled && !showSetup2FA && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <RiSmartphoneLine className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  2FA is currently disabled
                </h4>
                <p className="mb-6 text-sm text-gray-600">
                  Enable two-factor authentication to secure your account with an authenticator app
                </p>
                <button
                  onClick={handleGenerate2FA}
                  disabled={is2FALoading}
                  className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <RiShieldCheckLine className="h-5 w-5" />
                  <span>{is2FALoading ? "Loading..." : "Enable 2FA"}</span>
                </button>
              </motion.div>
            )}

            {showSetup2FA && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start space-x-3">
                    <RiAlertLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Setup Instructions:</p>
                      <ol className="mt-2 list-decimal space-y-1 pl-4">
                        <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                        <li>Scan the QR code below or enter the secret key manually</li>
                        <li>Enter the 6-digit code from your app to verify</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
                      {qrCode ? (
                        <img src={qrCode} alt="QR Code" className="h-48 w-48" />
                      ) : (
                        <RiQrCodeLine className="h-48 w-48 text-gray-300" />
                      )}
                    </div>
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p className="mb-1 text-xs font-medium text-gray-600">Secret Key</p>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900">{secret}</code>
                        <button
                          onClick={() => copyToClipboard(secret)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RiSave3Line className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-center text-2xl tracking-widest outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter the 6-digit code from your authenticator app
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleEnable2FA}
                        disabled={verificationCode.length !== 6 || is2FALoading}
                        className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {is2FALoading ? "Verifying..." : "Enable 2FA"}
                      </button>
                      <button
                        onClick={() => {
                          setShowSetup2FA(false);
                          setVerificationCode("");
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {twoFactorEnabled && !showSetup2FA && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center space-x-3">
                    <RiCheckLine className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Two-factor authentication is enabled and protecting your account
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-300 p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <RiKeyLine className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Backup Codes</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {showBackupCodes ? "Hide" : "Show"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showBackupCodes && backupCodes.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">
                              Save these codes in a secure location
                            </p>
                            <button
                              onClick={downloadBackupCodes}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Download
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {backupCodes.map((code, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded bg-white p-2 font-mono text-sm"
                              >
                                <span>{code}</span>
                                <button
                                  onClick={() => copyToClipboard(code)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <RiSave3Line className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowRegenerateModal(true)}
                    disabled={is2FALoading}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg border border-blue-600 p-3 font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                  >
                    <RiRefreshLine className="h-5 w-5" />
                    <span>Regenerate Backup Codes</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Security Preferences */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Security Preferences</h3>
          <p className="mt-1 text-sm text-gray-600">Manage your security notifications</p>
        </div>
        <div className="divide-y divide-gray-200 p-6">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive security alerts via email</p>
            </div>
            <ToggleSwitch isOn={emailNotifications} onToggle={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-900">Login Alerts</p>
              <p className="text-sm text-gray-600">Get notified of new sign-ins</p>
            </div>
            <ToggleSwitch isOn={loginAlerts} onToggle={setLoginAlerts} />
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
          <p className="mt-1 text-sm text-gray-600">Manage your logged-in devices</p>
        </div>
        <div className="divide-y divide-gray-200 p-6">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-gray-100 p-3">
                  <RiComputerLine className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{session.device}</p>
                    {session.current && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{session.location}</p>
                  <div className="mt-1 flex items-center space-x-1 text-xs text-gray-500">
                    <RiTimeLine className="h-3 w-3" />
                    <span>{session.lastActive}</span>
                  </div>
                </div>
              </div>
              {!session.current && (
                <button className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  <RiLogoutBoxLine className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Password Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4">
          <div className="flex items-center space-x-3">
            <RiLockPasswordLine className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-600">Update your password regularly</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 pr-12 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("oldPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.oldPassword ? (
                      <RiEyeOffLine className="h-5 w-5" />
                    ) : (
                      <RiEyeLine className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordChangeRequest.newPassword}
                    onChange={handlePasswordChange}
                    className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 pr-12 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.newPassword ? (
                      <RiEyeOffLine className="h-5 w-5" />
                    ) : (
                      <RiEyeLine className="h-5 w-5" />
                    )}
                  </button>
                </div>

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
                        <span className="text-xs text-gray-500">Password strength</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
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
                  className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 pr-12 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirmPassword ? (
                    <RiEyeOffLine className="h-5 w-5" />
                  ) : (
                    <RiEyeLine className="h-5 w-5" />
                  )}
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
                    {passwordChangeRequest.confirmPassword ===
                    passwordChangeRequest.newPassword ? (
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
                onClick={handleSavePassword}
                disabled={!isPasswordFormValid || isPasswordLoading}
                className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
                  isPasswordFormValid && !isPasswordLoading
                    ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                {isPasswordLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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

      {/* Danger Zone */}
      <div className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          <p className="mt-1 text-sm text-red-600">Irreversible actions for your account</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteAccountDialog(true)}
              className="flex items-center space-x-2 rounded-lg border-2 border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-50"
            >
              <RiDeleteBinLine className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Disable 2FA Modal - Custom Modal */}
      {showDisable2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <RiAlertLine className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Disable Two-Factor Authentication
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Enter your 6-digit 2FA code to disable two-factor authentication. This will make your account less secure.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  2FA Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={disable2FACode}
                  onChange={(e) => setDisable2FACode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-center text-2xl tracking-widest outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                {disable2FACode && disable2FACode.length !== 6 && (
                  <p className="mt-1 text-xs text-gray-500">Enter all 6 digits</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 rounded-b-xl bg-gray-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowDisable2FAModal(false);
                  setDisable2FACode("");
                }}
                disabled={is2FALoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                disabled={disable2FACode.length !== 6 || is2FALoading}
                className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {is2FALoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Disabling...</span>
                  </div>
                ) : (
                  "Disable 2FA"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Backup Codes Modal - Custom Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <RiRefreshLine className="h-6 w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Regenerate Backup Codes
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    This will invalidate all existing backup codes. Enter your 6-digit 2FA code to continue.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  2FA Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={regenerateCode}
                  onChange={(e) => setRegenerateCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-center text-2xl tracking-widest outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                {regenerateCode && regenerateCode.length !== 6 && (
                  <p className="mt-1 text-xs text-gray-500">Enter all 6 digits</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 rounded-b-xl bg-gray-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowRegenerateModal(false);
                  setRegenerateCode("");
                }}
                disabled={is2FALoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerateBackupCodes}
                disabled={regenerateCode.length !== 6 || is2FALoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {is2FALoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Regenerating...</span>
                  </div>
                ) : (
                  "Regenerate Codes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Dialog */}
      {showDeleteAccountDialog && (
        <ConfirmationDialog
          title="Delete Account"
          message="Are you sure you want to delete your account? Note: this action is irreversible and all your data will be permanently deleted."
          confirmText="Yes, Delete"
          isOpen={showDeleteAccountDialog}
          onClose={() => setShowDeleteAccountDialog(false)}
          onConfirm={handleDelete}
          cancelText="Cancel"
          requiresTyping={true}
        />
      )}
    </section>
  );
};

export default Account;
