import React from "react";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import { useAuth } from "../../../../store/useAuth.ts";
import { ApplicantPersonalInfo } from "../../../../utils/types";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import DatePicker from "../../../common/DatePicker.tsx";
import { useCities } from "../../../../hooks/useCities.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";
import { AddressResult, useSearchAddress } from "../../../../hooks/useSearchAddress.ts";
import SearchInput from "../../../common/SearchInput.tsx";
import { User, Mail, Phone, Calendar, MapPin, Globe, Edit3, Save, CheckCircle2 } from "lucide-react";

const PersonalInfo: React.FC = () => {
  const { cities } = useCities();
  const { countries } = useCountries();
  const {
    applicant,
    applicantPersonalInfo,
    setProfileData,
    setApplicantPersonalInfo,
    updateApplicantPersonalInfo,
  } = useAuth();
  const { results } = useSearchAddress(applicantPersonalInfo?.address || "", 300);
  const { isEditable, toggleEdit } = useSectionEditable("personal-info");

  const handleChange = async (e: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    const data = {
      ...applicantPersonalInfo,
      [name]: value,
    } as ApplicantPersonalInfo;
    setApplicantPersonalInfo(data);
  };

  const handleSavePersonalInfo = async () => {
    const response = await updateApplicantPersonalInfo(
        applicantPersonalInfo as ApplicantPersonalInfo,
    );
    if (response) {
      setProfileData({
        ...applicant,
        ...response,
      });
      setApplicantPersonalInfo({
        ...applicantPersonalInfo,
        ...updateApplicantPersonalInfo
      });
      toggleEdit();
    }
  };

  return (
      <section id="personal-info" className="relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-500">Update your personal details and contact information</p>
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
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
            >
              <Edit3 className="w-4 h-4" />
              {isEditable ? 'Cancel' : 'Edit'}
            </button>

            {isEditable && (
                <button
                    onClick={handleSavePersonalInfo}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          {/* Name Fields Row - 3 columns for better spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                First Name
              </label>
              <input
                  type="text"
                  onChange={handleChange}
                  disabled={!isEditable}
                  name="firstName"
                  value={applicantPersonalInfo?.firstName || ""}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                  placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Middle Name</label>
              <input
                  type="text"
                  onChange={handleChange}
                  name="middleName"
                  disabled={!isEditable}
                  value={applicantPersonalInfo?.middleName || ""}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                  placeholder="Enter your middle name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                  type="text"
                  onChange={handleChange}
                  name="lastName"
                  disabled={!isEditable}
                  value={applicantPersonalInfo?.lastName || ""}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                  placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Email Field - Full Width Row */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
                type="email"
                onChange={handleChange}
                name="email"
                disabled={!isEditable}
                value={applicantPersonalInfo?.email || ""}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                    isEditable
                        ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        : 'border-gray-200 bg-gray-100 text-gray-600'
                } focus:outline-none`}
                placeholder="Enter your email address"
            />
          </div>

          {/* Contact & Birth Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                  type="tel"
                  name="phoneNumber"
                  onChange={handleChange}
                  disabled={!isEditable}
                  value={applicantPersonalInfo?.phoneNumber || ""}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                  placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
              <DatePicker
                  selectedDate={
                    new Date(applicantPersonalInfo?.dateOfBirth || "2025-01-10")
                  }
                  disabled={!isEditable}
                  onDateChange={(date) => {
                    const data = {
                      ...applicant,
                      dateOfBirth: date,
                    } as ApplicantPersonalInfo;
                    setApplicantPersonalInfo(data);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
              />
            </div>
          </div>

          {/* Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Globe className="w-4 h-4" />
                Country
              </label>
              <CustomDropdown
                  options={countries}
                  handleSelect={(country) => {
                    const data = {
                      ...applicantPersonalInfo,
                      country: country?.label || "",
                    };
                    setApplicantPersonalInfo(data);
                  }}
                  placeholder={applicantPersonalInfo?.country || "Select country"}
                  disabled={!isEditable}
                  className={`text-left w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4" />
                City
              </label>
              <CustomDropdown
                  options={cities}
                  handleSelect={(city) => {
                    const data = {
                      ...applicantPersonalInfo,
                      city: city?.label || "",
                    };
                    setApplicantPersonalInfo(data);
                  }}
                  placeholder={applicantPersonalInfo?.city || "Select city"}
                  disabled={!isEditable}
                  className={`text-left w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isEditable
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600'
                  } focus:outline-none`}
              />
            </div>
          </div>

          {/* Address Row */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <SearchInput
                onChange={(a) => {
                  setApplicantPersonalInfo({
                    ...applicantPersonalInfo,
                    address: a,
                  });
                }}
                name="address"
                value={applicantPersonalInfo?.address || ""}
                disabled={!isEditable}
                suggestions={results.map((r: AddressResult) => r.display_name)}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                    isEditable
                        ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        : 'border-gray-200 bg-gray-100 text-gray-600'
                } focus:outline-none`}
                placeholder="Enter your full address"
            />
          </div>

          {/* Status Indicator */}
          {!isEditable && (
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Information saved successfully</span>
              </div>
          )}
        </div>
      </section>
  );
};

export default PersonalInfo;