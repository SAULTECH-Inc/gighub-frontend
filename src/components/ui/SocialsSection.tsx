import React, { useState } from "react";
import { useSectionEditable } from "../../store/useEditable.ts";
import { useEmployerProfile } from "../../store/useEmployerProfile.ts";
import { ApplicantData, EmployerData, Socials } from "../../utils/types";
import { useAuth } from "../../store/useAuth.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import { toast } from "react-toastify";
import {
  Share2,
  Edit3,
  Save,
  CheckCircle2,
  ExternalLink,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
} from "lucide-react";
import { useProfileCompletionDetails } from "../../hooks/useProfileCompletionDetails.ts";

const SocialsSection: React.FC = () => {
  const {
    applicant,
    employer,
    updateApplicantSocial,
    setApplicantData,
    setEmployerData,
  } = useAuth();
  const { socials, updateSocials, setSocials } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("socials-and-security");
  const {refetch} = useProfileCompletionDetails();

  const [socialData, setSocialData] = useState<Socials>({
    linkedInProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.linkedInProfile
        : socials?.linkedInProfile,
    twitterProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.twitterProfile
        : socials?.twitterProfile,
    facebookProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.facebookProfile
        : socials?.facebookProfile,
    instagramProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.instagramProfile
        : socials?.instagramProfile,
    githubProfile:
      USER_TYPE === UserType.APPLICANT ? applicant?.githubProfile : "",
  });

  const handleChange = async (e: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setSocialData({ ...socialData, [name]: value });

    if (USER_TYPE === UserType.APPLICANT) {
      setApplicantData({
        ...applicant,
        [name]: value,
      } as ApplicantData);
    } else {
      setSocials({
        ...socials,
        [name]: value,
      } as Socials);
      setEmployerData({
        ...employer,
        [name]: value,
      } as EmployerData);
    }
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };

  const handleSaveSocials = async () => {
    try {
      // Filter out empty values
      const filteredSocialData = Object.fromEntries(
        Object.entries(socialData).filter(
          ([_, value]) => value && value.trim() !== "",
        ),
      );

      const response =
        USER_TYPE === UserType.APPLICANT
          ? await updateApplicantSocial(filteredSocialData as Socials)
          : await updateSocials(filteredSocialData as Socials);

      if (response) {
        setSocialData(response);
        if (USER_TYPE === UserType.APPLICANT) {
          setApplicantData(response as ApplicantData);
        } else {
          setSocials(response);
          setEmployerData({
            ...employer,
            linkedInProfile: response.linkedInProfile,
            twitterProfile: response.twitterProfile,
            facebookProfile: response.facebookProfile,
            instagramProfile: response.instagramProfile,
            githubProfile: response.githubProfile,
          } as EmployerData);
        }
        toast.success("Social profiles updated successfully!");
        toggleEdit();
        refetch().then(r=>r);
      } else {
        toast.error("Failed to update social profiles. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to update social profiles. Please try again.");
    }
  };

  // Validate URL format
  const isValidUrl = (string: string) => {
    if (!string) return true; // Empty is valid
    try {
      new URL(string);
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  };

  // Social platform configurations
  const socialPlatforms = [
    {
      name: "linkedInProfile",
      label: "LinkedIn Profile",
      placeholder: "https://linkedin.com/in/your-profile",
      icon: Linkedin,
      color: "blue",
      description: "Professional networking profile",
      showFor: "both",
    },
    {
      name: "twitterProfile",
      label: "Twitter Profile",
      placeholder: "https://twitter.com/your-handle",
      icon: Twitter,
      color: "sky",
      description: "Social media and professional updates",
      showFor: "both",
    },
    {
      name: "facebookProfile",
      label: "Facebook Profile",
      placeholder: "https://facebook.com/your-profile",
      icon: Facebook,
      color: "blue",
      description: "Social networking profile",
      showFor: "employer",
    },
    {
      name: "instagramProfile",
      label: "Instagram Profile",
      placeholder: "https://instagram.com/your-handle",
      icon: Instagram,
      color: "pink",
      description: "Visual portfolio and lifestyle",
      showFor: "both",
    },
    {
      name: "githubProfile",
      label: "GitHub Profile",
      placeholder: "https://github.com/your-username",
      icon: Github,
      color: "gray",
      description: "Code repositories and projects",
      showFor: "applicant",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "sky":
        return "bg-sky-50 border-sky-200 text-sky-700";
      case "pink":
        return "bg-pink-50 border-pink-200 text-pink-700";
      case "gray":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600 bg-blue-100";
      case "sky":
        return "text-sky-600 bg-sky-100";
      case "pink":
        return "text-pink-600 bg-pink-100";
      case "gray":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Filter platforms based on user type
  const visiblePlatforms = socialPlatforms.filter(
    (platform) =>
      platform.showFor === "both" ||
      (platform.showFor === "applicant" && USER_TYPE === UserType.APPLICANT) ||
      (platform.showFor === "employer" && USER_TYPE === UserType.EMPLOYER),
  );

  // Get active social links
  const activeSocialLinks = visiblePlatforms.filter(
    (platform) =>
      socialData[platform.name as keyof typeof socialData] &&
      socialData[platform.name as keyof typeof socialData]?.trim() !== "",
  );

  return (
    <section id="social" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Share2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Social & Professional Links
            </h3>
            <p className="text-sm text-gray-500">
              Connect your social media and professional profiles
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
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleSaveSocials}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-6 flex items-center gap-2 text-lg font-medium text-gray-900">
            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
            Profile Links
          </h4>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {visiblePlatforms.map((platform) => {
              const IconComponent = platform.icon;
              const value =
                socialData[platform.name as keyof typeof socialData] || "";
              const isValid = isValidUrl(value);

              return (
                <div key={platform.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {platform.label}
                  </label>

                  <div className="relative">
                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                      <div
                        className={`rounded p-1 ${getIconColorClasses(platform.color)}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    <input
                      name={platform.name}
                      value={value}
                      disabled={!isEditable}
                      onChange={handleChange}
                      type="url"
                      placeholder={platform.placeholder}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-12 text-sm transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    {/* External Link Button */}
                    {value && isValid && (
                      <button
                        type="button"
                        onClick={() => window.open(value, "_blank")}
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform p-1 text-gray-400 transition-colors duration-200 hover:text-indigo-600"
                        title="Open profile in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* URL Validation */}
                  {value && !isValid && (
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <span className="h-1 w-1 rounded-full bg-red-600"></span>
                      Please enter a valid URL (include https://)
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    {platform.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Social Links Summary */}
        {activeSocialLinks.length > 0 && !isEditable && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Connected Profiles ({activeSocialLinks.length})
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeSocialLinks.map((platform) => {
                const IconComponent = platform.icon;
                const value =
                  socialData[platform.name as keyof typeof socialData];

                return (
                  <a
                    key={platform.name}
                    href={value || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 hover:shadow-sm ${getColorClasses(platform.color)}`}
                  >
                    <div
                      className={`rounded-full p-2 ${getIconColorClasses(platform.color)}`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {platform.label}
                      </p>
                      <p className="truncate text-xs opacity-75">{value}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeSocialLinks.length === 0 && !isEditable && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-500">
            <Share2 className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium">No social profiles connected</p>
            <p className="mt-1 text-xs text-gray-400">
              Add your social media and professional profiles to enhance your
              presence
            </p>
          </div>
        )}

        {/* Tips Section */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              💡 Social Profile Tips:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Ensure your profiles are professional and up-to-date</li>
              <li>• Use complete URLs including https:// for proper linking</li>
              <li>
                • LinkedIn is especially important for professional networking
              </li>
              <li>
                • GitHub showcases your technical projects and code quality
              </li>
              <li>
                • Keep your social media content appropriate for potential
                employers
              </li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && activeSocialLinks.length > 0 && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Social profiles saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialsSection;
