import React, { useEffect } from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { ContactInfo, EmployerData } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { toast } from "react-toastify";
import {
  Phone,
  Mail,
  User,
  Edit3,
  Save,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useProfileCompletionDetails } from "../../../../hooks/useProfileCompletionDetails.ts";

const CompanyContactInfo: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const { contactInfo, setContactInfo, updateContactInfo } =
    useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("companyContactInfo");
  const {refetch} = useProfileCompletionDetails();

  useEffect(() => {
    if (employer) {
      setContactInfo({
        managerEmail: employer.managerEmail || "",
        managerPhoneNumber: employer.managerPhoneNumber || "",
        companyPhone: employer.companyPhone || "",
        email: employer.email || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    } as ContactInfo);
    setEmployerData({
      ...employer,
      [e.target.name]: e.target.value,
    } as EmployerData);
  };

  const handleSaveCompanyContactInfo = async () => {
    try {
      const response = await updateContactInfo(contactInfo as ContactInfo);
      if (response) {
        console.log("Company Contact Info updated successfully");
        setContactInfo(response);
        toast.success("Contact information updated successfully!");
        toggleEdit();
        refetch().then(r=>r);
      } else {
        toast.error("Failed to update contact information. Please try again.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to update contact information. Please try again.");
    }
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    if (!email) return true; // Empty is valid for optional fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (basic validation)
  const isValidPhone = (phone: string) => {
    if (!phone) return true; // Empty is valid for optional fields
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const isFormValid =
    isValidEmail(contactInfo?.email || "") &&
    isValidEmail(contactInfo?.managerEmail || "") &&
    isValidPhone(contactInfo?.companyPhone || "") &&
    isValidPhone(contactInfo?.managerPhoneNumber || "");

  return (
    <section id="contact-info" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <Phone className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Contact Information
            </h3>
            <p className="text-sm text-gray-500">
              How candidates and partners can reach your company
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isEditable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveCompanyContactInfo}
              disabled={!isFormValid}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Primary Email (Read-only) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Primary Email Address
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={contactInfo?.email || ""}
                name="email"
                disabled={true}
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 py-3 pr-10 pl-10 text-sm text-gray-600"
                placeholder="your.email@company.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              🔒 This is your account email and cannot be changed here
            </p>
          </div>

          {/* Company Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Company Phone Number
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={contactInfo?.companyPhone || ""}
                name="companyPhone"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
            {contactInfo?.companyPhone &&
              !isValidPhone(contactInfo.companyPhone) && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid phone number
                </p>
              )}
          </div>

          {/* Manager Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hiring Manager Email
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <div className="rounded bg-blue-100 p-1">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
              </div>
              <input
                type="email"
                value={contactInfo?.managerEmail || ""}
                name="managerEmail"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="hiring.manager@company.com"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
            {contactInfo?.managerEmail &&
              !isValidEmail(contactInfo.managerEmail) && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid email address
                </p>
              )}
            <p className="mt-1 text-xs text-gray-500">
              Direct contact for hiring and recruitment inquiries
            </p>
          </div>

          {/* Manager Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hiring Manager Phone
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <div className="rounded bg-blue-100 p-1">
                  <Phone className="h-3 w-3 text-blue-600" />
                </div>
              </div>
              <input
                type="tel"
                value={contactInfo?.managerPhoneNumber || ""}
                name="managerPhoneNumber"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="+1 (555) 987-6543"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
            {contactInfo?.managerPhoneNumber &&
              !isValidPhone(contactInfo.managerPhoneNumber) && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid phone number
                </p>
              )}
            <p className="mt-1 text-xs text-gray-500">
              Alternative contact for urgent hiring matters
            </p>
          </div>
        </div>

        {/* Contact Information Guide */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              📞 Contact Information Guidelines:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>
                • Provide accurate contact details for seamless communication
              </li>
              <li>
                • Manager contact info helps candidates connect directly with
                hiring team
              </li>
              <li>• Include country codes for international phone numbers</li>
              <li>• These details may be shared with interested candidates</li>
              <li>• Keep contact information up-to-date for best results</li>
            </ul>
          </div>
        )}

        {/* Form Validation Error */}
        {isEditable && !isFormValid && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            Please correct the validation errors before saving.
          </div>
        )}

        {/* Contact Summary - When Not Editing */}
        {!isEditable && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Contact Summary
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Company Contacts */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">
                  Company Contacts
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <Mail className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Primary Email
                      </p>
                      <p className="text-sm text-green-700">
                        {contactInfo?.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {contactInfo?.companyPhone && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                      <Phone className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Company Phone
                        </p>
                        <p className="text-sm text-green-700">
                          {contactInfo.companyPhone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Manager Contacts */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">
                  Hiring Manager Contacts
                </h5>
                <div className="space-y-2">
                  {contactInfo?.managerEmail && (
                    <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Manager Email
                        </p>
                        <p className="text-sm text-blue-700">
                          {contactInfo.managerEmail}
                        </p>
                      </div>
                    </div>
                  )}
                  {contactInfo?.managerPhoneNumber && (
                    <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Manager Phone
                        </p>
                        <p className="text-sm text-blue-700">
                          {contactInfo.managerPhoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Contact information saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyContactInfo;
