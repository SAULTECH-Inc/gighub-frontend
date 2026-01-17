import { FC, useState } from "react";
import { Link } from "react-scroll";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Target,
  Award,
  Upload,
  FolderOpen,
  Globe,
  Shield,
  Search,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileCompletionResponse } from "../../../../utils/types";

interface Props{
completionDetails: ProfileCompletionResponse
}
const ApplicantProfileSidebar: FC<Props> = ({completionDetails}) => {
  const [activeSection, setActiveSection] = useState("personal-info");
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "personal-info",
      label: "Personal Information",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "professional-summary",
      label: "Professional Summary",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "work-experience",
      label: "Work Experience",
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "job-preferences",
      label: "Job Preferences",
      icon: Target,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "skills-competences",
      label: "Skills & Competencies",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "resume-cover-letter",
      label: "Resume & Cover Letters",
      icon: Upload,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: "work-sample",
      label: "Work Sample",
      icon: FolderOpen,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      id: "company-socials",
      label: "Social & Professional Links",
      icon: Globe,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      id: "verification",
      label: "Verification",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="w-full">
      {/* Main Navigation Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6438C2] to-[#8B5CF6] px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Profile Sections</h3>
          <p className="mt-1 text-sm text-purple-100">
            Complete all sections for best results
          </p>
        </div>

        {/* Navigation Items */}
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <Link
                  key={`${item.id}-${index}`}
                  to={item.id}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onSetActive={() => setActiveSection(item.id)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                    isActive
                      ? `${item.bgColor} ${item.color} border border-gray-200 shadow-sm`
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 ${isActive ? "bg-white shadow-sm" : "bg-gray-100 group-hover:bg-gray-200"} transition-colors duration-200`}
                  >
                    <IconComponent
                      className={`h-4 w-4 ${isActive ? item.color : "text-gray-600"}`}
                    />
                  </div>

                  <div className="flex-1">
                    <span className="text-sm leading-tight font-medium">
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActive
                        ? "rotate-90 transform text-gray-400"
                        : "text-gray-300 group-hover:text-gray-400"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            navigate("/applicant/find-jobs");
          }}
          className="group flex w-full transform items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#6438C2] to-[#8B5CF6] px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        >
          <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          Find Jobs
          <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Quick Stats Card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h4 className="mb-4 font-semibold text-gray-800">Profile Strength</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completeness</span>
            <span className="text-sm font-semibold text-[#6438C2]">{completionDetails?.percentage}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-gradient-to-r from-[#6438C2] to-[#8B5CF6]" style={{width: completionDetails?.percentage}}></div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(completionDetails?.sections?.filter(p=>p.isComplete)?.length || 0)}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{8-(completionDetails?.sections?.filter(p=>p.isComplete)?.length || 0)}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileSidebar;
