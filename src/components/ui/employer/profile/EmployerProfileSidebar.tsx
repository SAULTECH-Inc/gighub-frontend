import { FC, useState } from "react";
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
  Circle
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  completed?: boolean;
  active?: boolean;
}

const EmployerProfileSidebar: FC = () => {
  const [activeSection, setActiveSection] = useState("company-info");

  // Define sidebar navigation items with icons and completion status
  const sidebarItems: SidebarItem[] = [
    {
      id: "company-info",
      label: "Basic Company Information",
      icon: Building2,
      completed: true,
      active: activeSection === "company-info"
    },
    {
      id: "contact-info",
      label: "Contact Information",
      icon: Phone,
      completed: false,
      active: activeSection === "contact-info"
    },
    {
      id: "branding",
      label: "Branding and Visual",
      icon: Palette,
      completed: false,
      active: activeSection === "branding"
    },
    {
      id: "overview",
      label: "Company Overview",
      icon: FileText,
      completed: false,
      active: activeSection === "overview"
    },
    {
      id: "social",
      label: "Social and Professional Links",
      icon: Share2,
      completed: true,
      active: activeSection === "social"
    },
    {
      id: "compliance",
      label: "Compliance and Verifications",
      icon: Shield,
      completed: false,
      active: activeSection === "compliance"
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const completedSections = sidebarItems.filter(item => item.completed).length;
  const totalSections = sidebarItems.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="relative hidden min-h-screen w-[35%] md:block md:w-[29%] lg:w-[25%] xl:w-[22%]">
      <div className="sticky top-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Profile Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Profile Progress</h3>
              <span className="text-sm font-medium text-purple-600">{completionPercentage}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-600">
              {completedSections} of {totalSections} sections completed
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="mb-8">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
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
                      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                      }`}
                    >
                      <div className={`flex items-center gap-3 flex-1 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'}`}>
                        <IconComponent className="w-4 h-4" />
                        <span className="text-left leading-tight">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}

                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-purple-600" />
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
              className="group flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              to="/employer/profile"
              className="group flex items-center justify-center gap-2 w-full px-4 py-3 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              View Public Profile
            </Link>
          </div>

          {/* Profile Tips */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Quick Tip</h5>
            <p className="text-xs text-blue-700 leading-relaxed">
              Complete all sections to make your company profile more attractive to potential candidates and improve your visibility in search results.
            </p>
          </div>
        </div>

        {/* Bottom CTA - Separate Card */}
        <div className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Ready to Start Hiring?</h4>
            <p className="text-sm text-purple-100 mb-4">
              Complete your profile and start attracting top talent today
            </p>
            <Link
              to="/employer/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              Start Hiring Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileSidebar;