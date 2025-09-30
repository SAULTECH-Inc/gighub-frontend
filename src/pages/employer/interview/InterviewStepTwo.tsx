import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, FileText, MapPin, Phone, Users, Video } from "lucide-react";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";
import CustomSelect from "../../../components/common/CustomSelect.tsx";
import { InterviewScheduleDetails, Option } from "../../../utils/types";
import { INTERVIEW_TYPES, PLATFORM_OPTIONS } from "../../../utils/constants.ts";

// Validation schema
interface ValidationErrors {
  interviewType?: string;
  interviewPlatform?: string;
  interviewLink?: string;
  interviewerPhoneNumber1?: string;
  interviewAddress?: string;
  interviewCity?: string;
  interviewState?: string;
}

const InterviewStepTwo: React.FC = () => {
  const { nextStep, prevStep, interviewDetails, setInterviewDetails } = useScheduleInterview();

  const [selectedInterviewType, setSelectedInterviewType] = useState<Option | null>(
    INTERVIEW_TYPES.find(type => type.value === interviewDetails?.interviewType) || null
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize selected type from store on mount
  useEffect(() => {
    if (interviewDetails?.interviewType && !selectedInterviewType) {
      const foundType = INTERVIEW_TYPES.find(type => type.value === interviewDetails.interviewType);
      if (foundType) {
        setSelectedInterviewType(foundType);
      }
    }
  }, [interviewDetails?.interviewType, selectedInterviewType]);

  // Enhanced validation function
  const validateForm = useCallback((): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!selectedInterviewType) {
      newErrors.interviewType = "Please select an interview type.";
    }

    if (selectedInterviewType?.value === "virtual-meeting" || selectedInterviewType?.value === "hybrid") {
      if (!interviewDetails?.interviewPlatform) {
        newErrors.interviewPlatform = "Please select a platform for virtual meetings.";
      }
      if (!interviewDetails?.interviewLink?.trim()) {
        newErrors.interviewLink = "Please provide a meeting link.";
      } else if (!isValidUrl(interviewDetails.interviewLink)) {
        newErrors.interviewLink = "Please provide a valid meeting link.";
      }
    }

    if (["phone-call", "hybrid", "in-person"].includes(selectedInterviewType?.value || "")) {
      if (!interviewDetails?.interviewerPhoneNumber1?.trim()) {
        newErrors.interviewerPhoneNumber1 = "Please provide a contact phone number.";
      } else if (!isValidPhoneNumber(interviewDetails.interviewerPhoneNumber1)) {
        newErrors.interviewerPhoneNumber1 = "Please provide a valid phone number.";
      }
    }

    if (["in-person", "hybrid"].includes(selectedInterviewType?.value || "")) {
      if (!interviewDetails?.interviewAddress?.trim()) {
        newErrors.interviewAddress = "Please provide the interview address.";
      }
      if (!interviewDetails?.interviewCity?.trim()) {
        newErrors.interviewCity = "Please provide the city.";
      }
      if (!interviewDetails?.interviewState?.trim()) {
        newErrors.interviewState = "Please provide the state/region.";
      }
    }

    return newErrors;
  }, [selectedInterviewType, interviewDetails]);

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Phone number validation helper
  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
  };

  // Enhanced interview type selection handler
  const handleInterviewTypeSelection = useCallback((type: Option) => {
    setSelectedInterviewType(type);
    setInterviewDetails({
      ...interviewDetails,
      interviewType: type.value,
      // Clear dependent fields when type changes
      ...(type.value !== "virtual-meeting" && type.value !== "hybrid" && {
        interviewPlatform: undefined,
        interviewLink: undefined,
      }),
      ...(type.value !== "phone-call" && type.value !== "hybrid" && type.value !== "in-person" && {
        interviewerPhoneNumber1: undefined,
        interviewerPhoneNumber2: undefined,
      }),
      ...(type.value !== "in-person" && type.value !== "hybrid" && {
        interviewAddress: undefined,
        interviewCity: undefined,
        interviewState: undefined,
      }),
    } as InterviewScheduleDetails);

    // Clear type-related errors
    setErrors(prev => ({ ...prev, interviewType: undefined }));
  }, [interviewDetails, setInterviewDetails]);

  // Generic input change handler
  const handleInputChange = useCallback((field: keyof InterviewScheduleDetails, value: string) => {
    setInterviewDetails({
      ...interviewDetails,
      [field]: value,
    } as InterviewScheduleDetails);

    // Clear field-specific error
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, [interviewDetails, setInterviewDetails]);

  // Enhanced next step handler with validation
  const handleNextStep = useCallback(async () => {
    setIsSubmitting(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Add a small delay for better UX
      setTimeout(() => {
        nextStep();
        setIsSubmitting(false);
      }, 300);
    } else {
      setIsSubmitting(false);
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [validateForm, nextStep]);

  // Input component with enhanced styling
  const InputField: React.FC<{
    label: string;
    placeholder: string;
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    required?: boolean;
  }> = ({ label, placeholder, value, onChange, error, type = "text", required = false }) => (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        data-error={!!error}
        className={`w-full rounded-[10px] border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
            : "border-[#E6E6E6] bg-white focus:border-[#6438C2] focus:ring-[#6438C2]/20"
        }`}
      />
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  // Get current type configuration
  const currentTypeConfig = INTERVIEW_TYPES.find(type => type.value === selectedInterviewType?.value);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white px-4 py-6">
        <div className="flex w-full flex-col gap-6 sm:w-[95%]">

          {/* Interview Type Selection */}
          <section className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-[#000000] sm:text-xl">
                Interview Type
              </h4>
              <p className="text-sm text-gray-600 sm:text-base">
                Choose how you want to conduct the interview
              </p>
            </div>

            {/* Interview Type Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INTERVIEW_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedInterviewType?.value === type.value;

                return (
                  <div
                    key={type.value}
                    onClick={() => handleInterviewTypeSelection(type)}
                    className={`relative cursor-pointer rounded-[10px] border-2 p-4 transition-all hover:shadow-md ${
                      isSelected
                        ? "border-[#6438C2] bg-[#6438C2]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 rounded-full bg-[#6438C2] p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${type.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{type.label}</h5>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.interviewType && (
              <div className="flex items-center gap-1 text-sm text-red-600" data-error="true">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.interviewType}</span>
              </div>
            )}
          </section>

          {/* Dynamic Form Fields Based on Interview Type */}
          {selectedInterviewType && (
            <section className="space-y-6">
              <div className="rounded-[10px] border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  {currentTypeConfig && <currentTypeConfig.icon className="h-5 w-5 text-[#6438C2]" />}
                  <h5 className="font-medium text-gray-900">
                    {selectedInterviewType.label} Details
                  </h5>
                </div>

                <div className="space-y-4">
                  {/* Virtual Meeting Fields */}
                  {(selectedInterviewType.value === "virtual-meeting" || selectedInterviewType.value === "hybrid") && (
                    <div className="space-y-4">
                      <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Virtual Meeting Setup
                      </h6>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Platform <span className="text-red-500">*</span>
                          </label>
                          <CustomSelect
                            options={PLATFORM_OPTIONS}
                            placeholder="Select Platform"
                            value={(PLATFORM_OPTIONS.find(p => p?.value === interviewDetails?.interviewPlatform) || PLATFORM_OPTIONS[0])?.value}
                            onChange={(option) => {
                              handleInputChange("interviewPlatform", option.value);
                            }}
                            className={`w-full rounded-[10px] border px-4 py-3 text-sm ${
                              errors.interviewPlatform ? "border-red-300" : "border-[#E6E6E6]"
                            }`}
                          />
                          {errors.interviewPlatform && (
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              <span>{errors.interviewPlatform}</span>
                            </div>
                          )}
                        </div>

                        <InputField
                          label="Meeting Link"
                          placeholder="https://zoom.us/j/..."
                          value={interviewDetails?.interviewLink}
                          onChange={(value) => handleInputChange("interviewLink", value)}
                          error={errors.interviewLink}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone Call Fields */}
                  {(["phone-call", "hybrid", "in-person"].includes(selectedInterviewType.value)) && (
                    <div className="space-y-4">
                      <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Information
                      </h6>

                      <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                          label="Primary Phone"
                          placeholder="+1 (555) 123-4567"
                          value={interviewDetails?.interviewerPhoneNumber1}
                          onChange={(value) => handleInputChange("interviewerPhoneNumber1", value)}
                          error={errors.interviewerPhoneNumber1}
                          type="tel"
                          required
                        />

                        <InputField
                          label="Alternative Phone"
                          placeholder="+1 (555) 987-6543"
                          value={interviewDetails?.interviewerPhoneNumber2}
                          onChange={(value) => handleInputChange("interviewerPhoneNumber2", value)}
                          type="tel"
                        />
                      </div>
                    </div>
                  )}

                  {/* Location Fields */}
                  {(["in-person", "hybrid"].includes(selectedInterviewType.value)) && (
                    <div className="space-y-4">
                      <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Meeting Location
                      </h6>

                      <div className="space-y-4">
                        <InputField
                          label="Address"
                          placeholder="123 Business Ave, Suite 456"
                          value={interviewDetails?.interviewAddress}
                          onChange={(value) => handleInputChange("interviewAddress", value)}
                          error={errors.interviewAddress}
                          required
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <InputField
                            label="City"
                            placeholder="New York"
                            value={interviewDetails?.interviewCity}
                            onChange={(value) => handleInputChange("interviewCity", value)}
                            error={errors.interviewCity}
                            required
                          />

                          <InputField
                            label="State/Region"
                            placeholder="NY"
                            value={interviewDetails?.interviewState}
                            onChange={(value) => handleInputChange("interviewState", value)}
                            error={errors.interviewState}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assessment Type Info */}
                  {selectedInterviewType.value === "assessment" && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <div className="flex items-center gap-2 text-blue-700">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Assessment Interview</span>
                      </div>
                      <p className="mt-2 text-sm text-blue-600">
                        This interview will focus on evaluating the candidate's skills through practical assessments and tasks.
                      </p>
                    </div>
                  )}

                  {/* Group Interview Info */}
                  {selectedInterviewType.value === "group-interview" && (
                    <div className="rounded-lg bg-pink-50 border border-pink-200 p-4">
                      <div className="flex items-center gap-2 text-pink-700">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Group Interview</span>
                      </div>
                      <p className="mt-2 text-sm text-pink-600">
                        Multiple candidates will be interviewed together in this session.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-2 my-4 flex w-[96%] max-w-[900px] justify-end gap-4">
        <button
          onClick={prevStep}
          className="rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Back
        </button>

        <button
          onClick={handleNextStep}
          disabled={!selectedInterviewType || isSubmitting}
          className="rounded-[15px] bg-[#6438C2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5329a8] focus:outline-none focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Validating..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default InterviewStepTwo;
