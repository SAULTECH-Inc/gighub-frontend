import React, { useState } from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import {
  ComplianceAndVerifications,
  EmployerData,
} from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { toast } from "react-toastify";
import {
  Shield,
  Edit3,
  Save,
  CheckCircle2,
  Building,
  FileText,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Award,
  Verified,
} from "lucide-react";
import { useProfileCompletionDetails } from "../../../../hooks/useProfileCompletionDetails.ts";

const ComplianceAndVerification: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const {
    complianceAndVerification,
    setComplianceAndVerification,
    updateComplianceAndVerification,
  } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable(
    "complianceAndVerification",
  );

  const [showRegistrationNumber, setShowRegistrationNumber] = useState(false);
  const [showTaxNumber, setShowTaxNumber] = useState(false);
  const {refetch} = useProfileCompletionDetails();

  const handleToggleEdit = () => {
    toggleEdit();
  };

  const handleSaveComplianceVerification = async () => {
    try {
      // Basic validation
      if (!complianceAndVerification?.registrationNumber?.trim()) {
        toast.error("Business registration number is required.");
        return;
      }

      if (!complianceAndVerification?.taxIdentificationNumber?.trim()) {
        toast.error("Tax identification number is required.");
        return;
      }

      const response = await updateComplianceAndVerification(
        complianceAndVerification as ComplianceAndVerifications,
      );

      if (response) {
        setComplianceAndVerification(response);
        toast.success("Compliance information updated successfully!");
        toggleEdit();
        refetch().then(r=>r);
      } else {
        toast.error(
          "Failed to update compliance information. Please try again.",
        );
      }
    } catch (error) {
      toast.error("Failed to update compliance information. Please try again.");
    }
  };

  // Mask sensitive information
  const maskNumber = (number: string) => {
    if (!number || number.length < 4) return number;
    const visiblePart = number.slice(-4);
    const maskedPart = "*".repeat(number.length - 4);
    return maskedPart + visiblePart;
  };

  // Validate format (basic validation)
  const validateRegistrationNumber = (regNumber: string) => {
    if (!regNumber)
      return { isValid: false, message: "Registration number is required" };
    if (regNumber.length < 6)
      return {
        isValid: false,
        message: "Registration number should be at least 6 characters",
      };
    return { isValid: true, message: "" };
  };

  const validateTaxNumber = (taxNumber: string) => {
    if (!taxNumber)
      return {
        isValid: false,
        message: "Tax identification number is required",
      };
    if (taxNumber.length < 6)
      return {
        isValid: false,
        message: "Tax number should be at least 6 characters",
      };
    return { isValid: true, message: "" };
  };

  const regValidation = validateRegistrationNumber(
    complianceAndVerification?.registrationNumber || "",
  );
  const taxValidation = validateTaxNumber(
    complianceAndVerification?.taxIdentificationNumber || "",
  );
  const isFormValid = regValidation.isValid && taxValidation.isValid;

  const hasComplianceInfo =
    complianceAndVerification?.registrationNumber ||
    complianceAndVerification?.taxIdentificationNumber;

  return (
    <section id="compliance" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Compliance & Verification
            </h3>
            <p className="text-sm text-gray-500">
              Business registration and tax information for legal compliance
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEdit}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isEditable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveComplianceVerification}
              disabled={!isFormValid}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        {/* Security Notice */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <h5 className="mb-1 text-sm font-medium text-blue-800">
                🔒 Secure Business Information
              </h5>
              <p className="text-sm text-blue-700">
                Your business registration and tax information is encrypted and
                securely stored. This information is used for verification
                purposes and regulatory compliance only.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Business Registration Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Business Registration Number *
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <div className="rounded bg-emerald-100 p-1">
                  <Building className="h-4 w-4 text-emerald-600" />
                </div>
              </div>

              <input
                type={showRegistrationNumber ? "text" : "password"}
                value={complianceAndVerification?.registrationNumber || ""}
                disabled={!isEditable}
                onChange={(event) => {
                  setComplianceAndVerification({
                    ...complianceAndVerification,
                    registrationNumber: event.target.value,
                  });
                  setEmployerData({
                    ...employer,
                    registrationNumber: event.target.value,
                  } as EmployerData);
                }}
                placeholder="Enter business registration number"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-12 text-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowRegistrationNumber(!showRegistrationNumber)
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 transform p-1 text-gray-400 transition-colors duration-200 hover:text-emerald-600"
                title={
                  showRegistrationNumber
                    ? "Hide registration number"
                    : "Show registration number"
                }
              >
                {showRegistrationNumber ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {complianceAndVerification?.registrationNumber &&
              !regValidation.isValid && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{regValidation.message}</span>
                </div>
              )}

            <p className="mt-2 text-xs text-gray-500">
              Official business registration number from your jurisdiction
            </p>
          </div>

          {/* Tax Identification Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tax Identification Number *
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <div className="rounded bg-emerald-100 p-1">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
              </div>

              <input
                type={showTaxNumber ? "text" : "password"}
                value={complianceAndVerification?.taxIdentificationNumber || ""}
                disabled={!isEditable}
                onChange={(event) => {
                  setComplianceAndVerification({
                    ...complianceAndVerification,
                    taxIdentificationNumber: event.target.value,
                  });
                  setEmployerData({
                    ...employer,
                    taxIdentificationNumber: event.target.value,
                  } as EmployerData);
                }}
                placeholder="Enter tax identification number"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-12 text-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowTaxNumber(!showTaxNumber)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform p-1 text-gray-400 transition-colors duration-200 hover:text-emerald-600"
                title={showTaxNumber ? "Hide tax number" : "Show tax number"}
              >
                {showTaxNumber ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {complianceAndVerification?.taxIdentificationNumber &&
              !taxValidation.isValid && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{taxValidation.message}</span>
                </div>
              )}

            <p className="mt-2 text-xs text-gray-500">
              Tax ID, EIN, VAT number, or equivalent tax identifier
            </p>
          </div>
        </div>

        {/* Compliance Status - When Not Editing */}
        {hasComplianceInfo && !isEditable && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Compliance Status
            </h4>

            <div className="space-y-4">
              {/* Registration Number Display */}
              {complianceAndVerification?.registrationNumber && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-200 p-2">
                      <Building className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-emerald-900">
                        Business Registration
                      </h5>
                      <p className="text-sm text-emerald-700">
                        {showRegistrationNumber
                          ? complianceAndVerification.registrationNumber
                          : maskNumber(
                              complianceAndVerification.registrationNumber,
                            )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegistrationNumber(!showRegistrationNumber)
                      }
                      className="rounded-lg p-2 text-emerald-600 transition-colors duration-200 hover:bg-emerald-200"
                      title={
                        showRegistrationNumber ? "Hide number" : "Show number"
                      }
                    >
                      {showRegistrationNumber ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <Verified className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              )}

              {/* Tax Number Display */}
              {complianceAndVerification?.taxIdentificationNumber && (
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-200 p-2">
                      <FileText className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-900">
                        Tax Identification
                      </h5>
                      <p className="text-sm text-blue-700">
                        {showTaxNumber
                          ? complianceAndVerification.taxIdentificationNumber
                          : maskNumber(
                              complianceAndVerification.taxIdentificationNumber,
                            )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTaxNumber(!showTaxNumber)}
                      className="rounded-lg p-2 text-blue-600 transition-colors duration-200 hover:bg-blue-200"
                      title={showTaxNumber ? "Hide number" : "Show number"}
                    >
                      {showTaxNumber ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <Verified className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              )}

              {/* Compliance Benefits */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Legal Compliance
                    </p>
                    <p className="text-xs text-green-700">
                      Meets regulatory requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Verified Business
                    </p>
                    <p className="text-xs text-purple-700">
                      Builds candidate trust
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasComplianceInfo && !isEditable && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-500">
            <Shield className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium">
              No compliance information provided
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Add your business registration and tax details for verification
            </p>
          </div>
        )}

        {/* Guidelines */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-amber-800">
              📋 Compliance Information Guidelines:
            </h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>
                • Provide accurate business registration number from your
                jurisdiction
              </li>
              <li>
                • Include your official tax identification number (TIN, EIN,
                VAT, etc.)
              </li>
              <li>
                • This information is required for legal compliance and business
                verification
              </li>
              <li>
                • All data is encrypted and securely stored according to privacy
                regulations
              </li>
              <li>
                • Verification helps build trust with potential employees and
                partners
              </li>
            </ul>
          </div>
        )}

        {/* Form Validation Error */}
        {isEditable &&
          !isFormValid &&
          (complianceAndVerification?.registrationNumber ||
            complianceAndVerification?.taxIdentificationNumber) && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Please correct the validation errors before saving.
            </div>
          )}

        {/* Status Indicator */}
        {!isEditable && hasComplianceInfo && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Compliance information saved securely
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplianceAndVerification;
