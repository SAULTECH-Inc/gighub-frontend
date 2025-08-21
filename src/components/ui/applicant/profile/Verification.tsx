import React, { useState } from "react";
import { useAuth } from "../../../../store/useAuth.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { toast } from "react-toastify";
import {
  Shield,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  IdCard,
  Eye,
  EyeOff,
  Lock,
  FileCheck
} from "lucide-react";

const ComplianceAndVerification: React.FC = () => {
  const {
    applicant,
    setApplicantData,
      updateVerificationDetails,
  } = useAuth();
  const { isEditable, toggleEdit } = useSectionEditable("socials-and-security");

  const [showIdNumber, setShowIdNumber] = useState(false);
  const [verificationData, setVerificationData] = useState({
    governmentIdentificationNumber: applicant?.governmentIdentificationNumber || "",
    // Add more verification fields if needed in the future
  });

  const handleChange = async (e: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setVerificationData({
      ...verificationData,
      [name]: value,
    });


    setApplicantData({
      ...applicant,
      [name]: value,
    });
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };

  const handleSaveVerification = async () => {
    try {
      const response = await updateVerificationDetails({
        ...applicant
      });

      setApplicantData({
        ...applicant,
        governmentIdentificationNumber: response?.data?.governmentIdentificationNumber || "",
      })

      if (response) {
        toast.success("Verification information updated successfully");
        toggleEdit();
      } else {
        toast.error("Failed to update verification information. Please try again.");
      }
    } catch (error: any) {
      toast.error("Failed to update verification information. Please try again.", error);
    }
  };

  // Mask ID number for security
  const maskIdNumber = (id: string) => {
    if (!id || id.length < 4) return id;
    const visiblePart = id.slice(-4);
    const maskedPart = "*".repeat(id.length - 4);
    return maskedPart + visiblePart;
  };

  // Validate ID number format (basic validation)
  const validateIdNumber = (id: string) => {
    if (!id) return { isValid: true, message: "" };

    // Basic validation - adjust based on your requirements
    if (id.length < 6) {
      return {
        isValid: false,
        message: "ID number should be at least 6 characters"
      };
    }

    if (!/^[A-Za-z0-9]+$/.test(id)) {
      return {
        isValid: false,
        message: "ID number should contain only letters and numbers"
      };
    }

    return { isValid: true, message: "" };
  };

  const idValidation = validateIdNumber(verificationData.governmentIdentificationNumber);
  const hasIdNumber = verificationData.governmentIdentificationNumber && verificationData.governmentIdentificationNumber.trim() !== '';

  return (
    <section id="compliance-verification" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Identity Verification</h3>
            <p className="text-sm text-gray-500">Secure verification for account compliance and security</p>
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
              onClick={handleSaveVerification}
              type="button"
              disabled={!idValidation.isValid}
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
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Government Identification
          </h4>

          {/* Security Notice */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-1">🔒 Security Notice</h5>
                <p className="text-sm text-blue-700">
                  Your identification information is encrypted and securely stored. We use this information
                  for identity verification and compliance purposes only.
                </p>
              </div>
            </div>
          </div>

          {/* ID Number Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Government ID Number *
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="p-1 bg-emerald-100 rounded">
                    <IdCard className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <input
                  type={showIdNumber ? "text" : "password"}
                  name="governmentIdentificationNumber"
                  value={applicant?.governmentIdentificationNumber || ""}
                  disabled={!isEditable}
                  onChange={handleChange}
                  placeholder="Enter your government ID number"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                {/* Toggle Visibility Button */}
                <button
                  type="button"
                  onClick={() => setShowIdNumber(!showIdNumber)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                  title={showIdNumber ? "Hide ID number" : "Show ID number"}
                >
                  {showIdNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Validation Message */}
              {verificationData.governmentIdentificationNumber && !idValidation.isValid && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{idValidation.message}</span>
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Enter your national ID, passport number, or driver's license number
              </p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        {hasIdNumber && !isEditable && (
          <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Verification Status
            </h4>

            <div className="space-y-4">
              {/* ID Number Display */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-200 rounded-full">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-emerald-900">Government ID</h5>
                    <p className="text-sm text-emerald-700">
                      {showIdNumber
                        ? verificationData.governmentIdentificationNumber
                        : maskIdNumber(verificationData.governmentIdentificationNumber)
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIdNumber(!showIdNumber)}
                    className="p-2 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors duration-200"
                    title={showIdNumber ? "Hide ID number" : "Show ID number"}
                  >
                    {showIdNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              {/* Verification Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Enhanced Security</p>
                    <p className="text-xs text-blue-700">Your account is more secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Verified Profile</p>
                    <p className="text-xs text-purple-700">Employers can trust your identity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasIdNumber && !isEditable && (
          <div className="mt-6 text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">No verification information provided</p>
            <p className="text-xs text-gray-400 mt-1">Add your government ID for account verification and enhanced security</p>
          </div>
        )}

        {/* Guidelines Section */}
        {isEditable && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-2">📋 Verification Guidelines:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Use your official government-issued identification number</li>
              <li>• Accepted documents: National ID, Passport, Driver's License</li>
              <li>• Information is encrypted and used only for verification purposes</li>
              <li>• Verification helps build trust with potential employers</li>
              <li>• Contact support if you need help with verification</li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && hasIdNumber && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Verification information saved securely
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplianceAndVerification;