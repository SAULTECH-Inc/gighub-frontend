import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Phone,
  Palette,
  FileText,
  Share2,
  Shield,
  LayoutDashboard,
  Eye,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { ProfileCompletionResponse } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  completed?: boolean;
  active?: boolean;
}

interface Props{
  completionDetails: ProfileCompletionResponse
}

const EmployerProfileSidebar: FC<Props> = ({completionDetails}) => {
  const [activeSection, setActiveSection] = useState("company-info");
  const {employer} = useAuth();

  // Define sidebar navigation items with icons and completion status
  const sidebarItems: SidebarItem[] = [
    {
      id: "company-info",
      label: "Basic Company Information",
      icon: Building2,
      completed: true,
      active: activeSection === "company-info",
    },
    {
      id: "contact-info",
      label: "Contact Information",
      icon: Phone,
      completed: false,
      active: activeSection === "contact-info",
    },
    {
      id: "branding",
      label: "Branding and Visual",
      icon: Palette,
      completed: false,
      active: activeSection === "branding",
    },
    {
      id: "overview",
      label: "Company Overview",
      icon: FileText,
      completed: false,
      active: activeSection === "overview",
    },
    {
      id: "social",
      label: "Social and Professional Links",
      icon: Share2,
      completed: true,
      active: activeSection === "social",
    },
    {
      id: "compliance",
      label: "Compliance and Verifications",
      icon: Shield,
      completed: false,
      active: activeSection === "compliance",
    },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative hidden min-h-screen w-[35%] md:block md:w-[29%] lg:w-[25%] xl:w-[22%]">
      <div className="sticky top-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Profile Progress */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Progress
              </h3>
              <span className="text-sm font-medium text-purple-600">
                {completionDetails?.percentage || 0}%
              </span>
            </div>

            <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                style={{ width: `${completionDetails?.percentage || 0}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-600">
              {completionDetails?.sections?.filter((p) => p.isComplete)
                ?.length || 0}{" "}
              of 6 sections completed
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="mb-8">
            <h4 className="mb-4 text-sm font-medium tracking-wide text-gray-500 uppercase">
              Profile Sections
            </h4>

            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = item.active;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSectionClick(item.id)}
                      className={`group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "border border-purple-200 bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                      }`}
                    >
                      <div
                        className={`flex flex-1 items-center gap-3 ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-purple-500"}`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-left leading-tight">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300" />
                        )}

                        {isActive && (
                          <ChevronRight className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/employer/dashboard"
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              to={`/employers/${employer?.id}/${employer?.companyName}/profile`}
              className="group flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 px-4 py-3 text-sm font-medium text-purple-700 transition-colors duration-200 hover:bg-purple-50"
            >
              <Eye className="h-4 w-4" />
              View Public Profile
            </Link>
          </div>

          {/* Profile Tips */}
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h5 className="mb-2 text-sm font-medium text-blue-800">
              💡 Quick Tip
            </h5>
            <p className="text-xs leading-relaxed text-blue-700">
              Complete all sections to make your company profile more attractive
              to potential candidates and improve your visibility in search
              results.
            </p>
          </div>
        </div>

        {/* Bottom CTA - Separate Card */}
        <div className="mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="text-center">
            <h4 className="mb-2 font-semibold">Ready to Start Hiring?</h4>
            <p className="mb-4 text-sm text-purple-100">
              Complete your profile and start attracting top talent today
            </p>
            <Link
              to="/employer/manage-jobs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-purple-700 transition-colors duration-200 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Start Hiring Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileSidebar;
