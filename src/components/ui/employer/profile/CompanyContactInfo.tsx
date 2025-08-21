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
  AlertCircle
} from "lucide-react";

const CompanyContactInfo: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const { contactInfo, setContactInfo, updateContactInfo } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("companyContactInfo");

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
      } else {
        toast.error("Failed to update contact information. Please try again.");
      }
    } catch (error) {
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
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const isFormValid =
    isValidEmail(contactInfo?.email || '') &&
    isValidEmail(contactInfo?.managerEmail || '') &&
    isValidPhone(contactInfo?.companyPhone || '') &&
    isValidPhone(contactInfo?.managerPhoneNumber || '');

  return (
    <section id="contact-info" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-500">How candidates and partners can reach your company</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isEditable
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditable ? 'Cancel' : 'Edit'}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveCompanyContactInfo}
              disabled={!isFormValid}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={contactInfo?.email || ""}
                name="email"
                disabled={true}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
                placeholder="your.email@company.com"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              🔒 This is your account email and cannot be changed here
            </p>
          </div>

          {/* Company Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={contactInfo?.companyPhone || ""}
                name="companyPhone"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            {contactInfo?.companyPhone && !isValidPhone(contactInfo.companyPhone) && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please enter a valid phone number
              </p>
            )}
          </div>

          {/* Manager Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiring Manager Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="p-1 bg-blue-100 rounded">
                  <User className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <input
                type="email"
                value={contactInfo?.managerEmail || ""}
                name="managerEmail"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="hiring.manager@company.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            {contactInfo?.managerEmail && !isValidEmail(contactInfo.managerEmail) && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please enter a valid email address
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Direct contact for hiring and recruitment inquiries
            </p>
          </div>

          {/* Manager Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiring Manager Phone
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="p-1 bg-blue-100 rounded">
                  <Phone className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <input
                type="tel"
                value={contactInfo?.managerPhoneNumber || ""}
                name="managerPhoneNumber"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="+1 (555) 987-6543"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            {contactInfo?.managerPhoneNumber && !isValidPhone(contactInfo.managerPhoneNumber) && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
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
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">📞 Contact Information Guidelines:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Provide accurate contact details for seamless communication</li>
              <li>• Manager contact info helps candidates connect directly with hiring team</li>
              <li>• Include country codes for international phone numbers</li>
              <li>• These details may be shared with interested candidates</li>
              <li>• Keep contact information up-to-date for best results</li>
            </ul>
          </div>
        )}

        {/* Form Validation Error */}
        {isEditable && !isFormValid && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Please correct the validation errors before saving.
          </div>
        )}

        {/* Contact Summary - When Not Editing */}
        {!isEditable && (
          <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Contact Summary
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Contacts */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Company Contacts</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Mail className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Primary Email</p>
                      <p className="text-sm text-green-700">{contactInfo?.email || "Not provided"}</p>
                    </div>
                  </div>
                  {contactInfo?.companyPhone && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Company Phone</p>
                        <p className="text-sm text-green-700">{contactInfo.companyPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Manager Contacts */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Hiring Manager Contacts</h5>
                <div className="space-y-2">
                  {contactInfo?.managerEmail && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Manager Email</p>
                        <p className="text-sm text-blue-700">{contactInfo.managerEmail}</p>
                      </div>
                    </div>
                  )}
                  {contactInfo?.managerPhoneNumber && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Manager Phone</p>
                        <p className="text-sm text-blue-700">{contactInfo.managerPhoneNumber}</p>
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
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Contact information saved successfully</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyContactInfo;