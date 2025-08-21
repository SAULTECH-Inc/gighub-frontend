import React from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {
  CompanyInfos,
  EmployerData,
  Option,
} from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { Industries } from "../../../../utils/industries.ts";
import { CompanySizes } from "../../../../utils/constants.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";
import { toast } from "react-toastify";
import {
  Building2,
  Edit3,
  Save,
  CheckCircle2,
  MapPin,
  Users,
  Briefcase,
  Globe
} from "lucide-react";

const CompanyInfo: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const { countries } = useCountries();
  const { companyInfo, setCompanyInfo, updateCompanyInfo } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("companyInfo");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    } as CompanyInfos);
    setEmployerData({
      ...employer,
      [e.target.name]: e.target.value,
    } as EmployerData);
  };

  const handleSaveCompanyInfo = async () => {
    try {
      const response = await updateCompanyInfo(companyInfo as CompanyInfos);
      if (response) {
        console.log("Company Info updated successfully");
        setCompanyInfo(response);
        toast.success("Company information updated successfully!");
        toggleEdit();
      } else {
        toast.error("Failed to update company information. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update company information. Please try again.");
    }
  };

  // Check if required fields are filled
  const isFormValid = companyInfo?.companyName && companyInfo?.industry && companyInfo?.country;

  return (
    <section id="company-info" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
            <p className="text-sm text-gray-500">Basic details about your company and business</p>
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
              onClick={handleSaveCompanyInfo}
              disabled={!isFormValid}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
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
          {/* Company Name */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={companyInfo?.companyName as string}
                name="companyName"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="Enter your company name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Briefcase className="w-4 h-4 text-gray-400" />
              </div>
              <CustomDropdown
                placeholder={companyInfo?.industry || "Select industry"}
                handleSelect={(option: Option) => {
                  setCompanyInfo({
                    ...companyInfo,
                    industry: option.value,
                  } as CompanyInfos);
                  setEmployerData({
                    ...employer,
                    industry: option.value,
                  } as EmployerData);
                }}
                options={Industries}
                disabled={!isEditable}
                className="text-left w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <CustomSelect
                options={CompanySizes}
                placeholder={companyInfo?.companySize || "Select company size"}
                onChange={(option: Option) => {
                  setCompanyInfo({
                    ...companyInfo,
                    companySize: option.label,
                  } as CompanyInfos);
                  setEmployerData({
                    ...employer,
                    companySize: option.label,
                  } as EmployerData);
                }}
                disabled={!isEditable}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
              <CustomSelect
                options={countries}
                placeholder={companyInfo?.country || "Select country"}
                onChange={(option: Option) => {
                  setCompanyInfo({
                    ...companyInfo,
                    country: option.value,
                  } as CompanyInfos);
                  setEmployerData({
                    ...employer,
                    country: option.label,
                  } as EmployerData);
                }}
                disabled={!isEditable}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={companyInfo?.city || ""}
                name="city"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="Enter city"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Address */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <input
                value={companyInfo?.companyAddress || ""}
                name="companyAddress"
                onChange={handleChange}
                disabled={!isEditable}
                type="text"
                placeholder="Enter full company address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Required Fields Notice */}
        {isEditable && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Company Information Guidelines:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Fields marked with * are required for a complete profile</li>
              <li>• Use your official registered company name</li>
              <li>• Select the industry that best describes your business</li>
              <li>• Company size helps candidates understand your organization</li>
              <li>• Accurate location information helps with local talent sourcing</li>
            </ul>
          </div>
        )}

        {/* Validation Error */}
        {isEditable && !isFormValid && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            ⚠️ Please fill in all required fields (Company Name, Industry, Country) to save changes.
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Company information saved successfully</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyInfo;