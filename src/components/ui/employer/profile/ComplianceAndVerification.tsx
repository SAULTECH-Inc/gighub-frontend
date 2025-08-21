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
  Verified
} from "lucide-react";

const ComplianceAndVerification: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const {
    complianceAndVerification,
    setComplianceAndVerification,
    updateComplianceAndVerification,
  } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("complianceAndVerification");

  const [showRegistrationNumber, setShowRegistrationNumber] = useState(false);
  const [showTaxNumber, setShowTaxNumber] = useState(false);

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
      } else {
        toast.error("Failed to update compliance information. Please try again.");
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
    if (!regNumber) return { isValid: false, message: "Registration number is required" };
    if (regNumber.length < 6) return { isValid: false, message: "Registration number should be at least 6 characters" };
    return { isValid: true, message: "" };
  };

  const validateTaxNumber = (taxNumber: string) => {
    if (!taxNumber) return { isValid: false, message: "Tax identification number is required" };
    if (taxNumber.length < 6) return { isValid: false, message: "Tax number should be at least 6 characters" };
    return { isValid: true, message: "" };
  };

  const regValidation = validateRegistrationNumber(complianceAndVerification?.registrationNumber || '');
  const taxValidation = validateTaxNumber(complianceAndVerification?.taxIdentificationNumber || '');
  const isFormValid = regValidation.isValid && taxValidation.isValid;

  const hasComplianceInfo = complianceAndVerification?.registrationNumber || complianceAndVerification?.taxIdentificationNumber;

  return (
    <section id="compliance" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Compliance & Verification</h3>
            <p className="text-sm text-gray-500">Business registration and tax information for legal compliance</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEdit}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isEditable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditable ? 'Cancel' : 'Edit'}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveComplianceVerification}
              disabled={!isFormValid}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 rounded-xl p-6">
        {/* Security Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-800 mb-1">🔒 Secure Business Information</h5>
              <p className="text-sm text-blue-700">
                Your business registration and tax information is encrypted and securely stored. This information
                is used for verification purposes and regulatory compliance only.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Registration Number *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="p-1 bg-emerald-100 rounded">
                  <Building className="w-4 h-4 text-emerald-600" />
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
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={() => setShowRegistrationNumber(!showRegistrationNumber)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                title={showRegistrationNumber ? "Hide registration number" : "Show registration number"}
              >
                {showRegistrationNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {complianceAndVerification?.registrationNumber && !regValidation.isValid && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{regValidation.message}</span>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Official business registration number from your jurisdiction
            </p>
          </div>

          {/* Tax Identification Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Identification Number *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="p-1 bg-emerald-100 rounded">
                  <FileText className="w-4 h-4 text-emerald-600" />
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
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={() => setShowTaxNumber(!showTaxNumber)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                title={showTaxNumber ? "Hide tax number" : "Show tax number"}
              >
                {showTaxNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {complianceAndVerification?.taxIdentificationNumber && !taxValidation.isValid && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
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
          <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Compliance Status
            </h4>

            <div className="space-y-4">
              {/* Registration Number Display */}
              {complianceAndVerification?.registrationNumber && (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-200 rounded-full">
                      <Building className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-emerald-900">Business Registration</h5>
                      <p className="text-sm text-emerald-700">
                        {showRegistrationNumber
                          ? complianceAndVerification.registrationNumber
                          : maskNumber(complianceAndVerification.registrationNumber)
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRegistrationNumber(!showRegistrationNumber)}
                      className="p-2 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors duration-200"
                      title={showRegistrationNumber ? "Hide number" : "Show number"}
                    >
                      {showRegistrationNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Verified className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              )}

              {/* Tax Number Display */}
              {complianceAndVerification?.taxIdentificationNumber && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-200 rounded-full">
                      <FileText className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-900">Tax Identification</h5>
                      <p className="text-sm text-blue-700">
                        {showTaxNumber
                          ? complianceAndVerification.taxIdentificationNumber
                          : maskNumber(complianceAndVerification.taxIdentificationNumber)
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTaxNumber(!showTaxNumber)}
                      className="p-2 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                      title={showTaxNumber ? "Hide number" : "Show number"}
                    >
                      {showTaxNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Verified className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              )}

              {/* Compliance Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Legal Compliance</p>
                    <p className="text-xs text-green-700">Meets regulatory requirements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Verified Business</p>
                    <p className="text-xs text-purple-700">Builds candidate trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasComplianceInfo && !isEditable && (
          <div className="mt-6 text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">No compliance information provided</p>
            <p className="text-xs text-gray-400 mt-1">Add your business registration and tax details for verification</p>
          </div>
        )}

        {/* Guidelines */}
        {isEditable && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-2">📋 Compliance Information Guidelines:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Provide accurate business registration number from your jurisdiction</li>
              <li>• Include your official tax identification number (TIN, EIN, VAT, etc.)</li>
              <li>• This information is required for legal compliance and business verification</li>
              <li>• All data is encrypted and securely stored according to privacy regulations</li>
              <li>• Verification helps build trust with potential employees and partners</li>
            </ul>
          </div>
        )}

        {/* Form Validation Error */}
        {isEditable && !isFormValid && (complianceAndVerification?.registrationNumber || complianceAndVerification?.taxIdentificationNumber) && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Please correct the validation errors before saving.
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && hasComplianceInfo && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Compliance information saved securely
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplianceAndVerification;