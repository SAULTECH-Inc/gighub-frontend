import React from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import { CompanyInfos, EmployerData, Option } from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { CompanySizes, Industries } from "../../../../utils/constants.ts";
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
  Globe,
} from "lucide-react";
import { useProfileCompletionDetails } from "../../../../hooks/useProfileCompletionDetails.ts";

const CompanyInfo: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const { countries } = useCountries();
  const { companyInfo, setCompanyInfo, updateCompanyInfo } =
    useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("companyInfo");
  const {refetch} = useProfileCompletionDetails();

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
        refetch().then(r=>r);
      } else {
        toast.error("Failed to update company information. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update company information. Please try again.");
    }
  };

  // Check if required fields are filled
  const isFormValid =
    companyInfo?.companyName && companyInfo?.industry && companyInfo?.country;

  return (
    <section id="company-info" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Company Information
            </h3>
            <p className="text-sm text-gray-500">
              Basic details about your company and business
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
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveCompanyInfo}
              disabled={!isFormValid}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
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
          {/* Company Name */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={companyInfo?.companyName as string}
                name="companyName"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="Enter your company name"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Industry *
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform">
                <Briefcase className="h-4 w-4 text-gray-400" />
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
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-left text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Company Size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Company Size
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform">
                <Users className="h-4 w-4 text-gray-400" />
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
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Country *
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform">
                <Globe className="h-4 w-4 text-gray-400" />
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
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={companyInfo?.city || ""}
                name="city"
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="Enter city"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Address */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Company Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                value={companyInfo?.companyAddress || ""}
                name="companyAddress"
                onChange={handleChange}
                disabled={!isEditable}
                type="text"
                placeholder="Enter full company address"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Required Fields Notice */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              📋 Company Information Guidelines:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>
                • Fields marked with * are required for a complete profile
              </li>
              <li>• Use your official registered company name</li>
              <li>• Select the industry that best describes your business</li>
              <li>
                • Company size helps candidates understand your organization
              </li>
              <li>
                • Accurate location information helps with local talent sourcing
              </li>
            </ul>
          </div>
        )}

        {/* Validation Error */}
        {isEditable && !isFormValid && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            ⚠️ Please fill in all required fields (Company Name, Industry,
            Country) to save changes.
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Company information saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyInfo;
