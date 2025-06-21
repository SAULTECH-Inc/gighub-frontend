import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Shield,
  Users,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  Search,
  Network,
} from "lucide-react";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import MainFooter from "../../components/layouts/MainFooter.tsx";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isCollapsible?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  children,
  icon,
  isCollapsible = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);

  return (
    <div
      id={id}
      className="border-gray-200 mb-8 overflow-hidden rounded-lg border bg-white shadow-lg"
    >
      <div
        className={`to-orange-50 border-gray-200 border-b bg-gradient-to-r from-purple-100 px-6 py-4 ${
          isCollapsible
            ? "hover:to-orange-100 cursor-pointer transition-colors hover:from-purple-200"
            : ""
        }`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-purple-600">{icon}</div>}
            <h2 className="text-gray-800 text-xl font-semibold">{title}</h2>
          </div>
          {isCollapsible && (
            <div className="text-gray-500">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="text-gray-700 px-6 py-6 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const HighlightBox: React.FC<{
  children: React.ReactNode;
  type?: "warning" | "info" | "success";
}> = ({ children, type = "info" }) => {
  const styles = {
    warning:
      "bg-orange-50 border-orange-300 text-orange-800 border-l-4 border-l-orange-500",
    info: "bg-purple-50 border-purple-300 text-purple-800 border-l-4 border-l-purple-500",
    success:
      "bg-green-50 border-green-300 text-green-800 border-l-4 border-l-green-500",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type]} my-4`}>
      {children}
    </div>
  );
};

const TermsAndConditions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const sections = [
    "Acceptance of Terms",
    "Description of Service",
    "User Accounts and Registration",
    "Job Seeker Responsibilities",
    "Employer and Job Posting Guidelines",
    "Payment and Subscription Terms",
    "Auto-Apply and Smart Matching Services",
    "Professional Networking Features",
    "Data Privacy and Protection",
    "Platform Fees and Premium Features",
    "Dispute Resolution",
    "Limitation of Liability",
    "Account Termination",
    "Modifications to Terms",
    "Contact Information",
  ];

  const scrollToSection = (sectionTitle: string) => {
    const element = document.getElementById(
      sectionTitle.toLowerCase().replace(/\s+/g, "-"),
    );
    element?.scrollIntoView({ behavior: "smooth" });
    setShowTableOfContents(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
      ) : (
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      )}
      {/* Header */}
      <div className="to-orange-600 bg-gradient-to-r from-purple-600 via-indigo-700 text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="mb-4 text-4xl font-bold">Terms and Conditions</h1>
          <p className="text-xl opacity-90">
            GigHub Professional Platform Agreement
          </p>
          <div className="mt-6 flex items-center space-x-6 text-sm opacity-75">
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Last Updated: June 18, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={16} />
              <span>Version 3.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowTableOfContents(!showTableOfContents)}
              className="to-orange-500 hover:to-orange-600 rounded-lg bg-gradient-to-r from-purple-600 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:shadow-xl"
              style={{ boxShadow: "0 0 20px rgba(100, 56, 194, 0.3)" }}
            >
              Table of Contents
            </button>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      {showTableOfContents && (
        <div className="border-b bg-white shadow-lg">
          <div className="mx-auto max-w-4xl px-6 py-6">
            <h3 className="mb-4 text-lg font-semibold text-purple-700">
              Table of Contents
            </h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(section)}
                  className="rounded px-3 py-2 text-left text-purple-600 transition-colors hover:bg-purple-50 hover:shadow-md"
                >
                  {index + 1}. {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <HighlightBox type="warning">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <strong>Important Notice:</strong> By using GigHub's job search
              and professional networking platform, you agree to be bound by
              these Terms and Conditions. Please read them carefully before
              using our services.
            </div>
          </div>
        </HighlightBox>

        <Section
          title="Acceptance of Terms"
          icon={<Shield size={20} />}
          id="acceptance-of-terms"
        >
          <p className="mb-4">
            Welcome to GigHub! These Terms and Conditions ("Terms") govern your
            use of the GigHub job search, job posting, professional networking,
            and career development platform, including our website, mobile
            applications, and all associated services (collectively, the
            "Service").
          </p>
          <p className="mb-4">
            By accessing or using GigHub, you agree to be bound by these Terms.
            If you do not agree to these Terms, you may not access or use our
            Service. These Terms apply to all users including job seekers,
            employers, recruiters, and professional networkers.
          </p>
          <HighlightBox>
            <strong>Professional Use:</strong> You must be at least 16 years old
            to create a profile for job searching purposes, or 18 years old to
            post jobs or use employer features.
          </HighlightBox>
        </Section>

        <Section
          title="Description of Service"
          icon={<Briefcase size={20} />}
          id="description-of-service"
        >
          <p className="mb-4">
            GigHub is a comprehensive professional platform that connects job
            seekers with employers and facilitates career development through:
          </p>
          <ul className="text-gray-700 mb-4 list-inside list-disc space-y-2">
            <li>
              <strong className="text-purple-600">
                Job Search & Discovery:
              </strong>{" "}
              Advanced job search with filters, recommendations, and
              personalized matches
            </li>
            <li>
              <strong className="text-purple-600">
                Auto-Apply Technology:
              </strong>{" "}
              Automated job application submission based on your preferences and
              qualifications
            </li>
            <li>
              <strong className="text-purple-600">Smart Role Matching:</strong>{" "}
              AI-powered matching between candidates and job opportunities
            </li>
            <li>
              <strong className="text-purple-600">
                Professional Networking:
              </strong>{" "}
              Connect with industry professionals, colleagues, and potential
              employers
            </li>
            <li>
              <strong className="text-purple-600">Candidate Scouting:</strong>{" "}
              Tools for employers to find and recruit top talent
            </li>
            <li>
              <strong className="text-purple-600">Career Development:</strong>{" "}
              Resume building, skill assessments, and professional growth
              resources
            </li>
          </ul>
          <div className="rounded-lg border-l-4 border-l-green-400 bg-gradient-to-r from-purple-50 to-green-50 p-4">
            <p className="text-green-800">
              <strong>Our Mission:</strong> To revolutionize the job market by
              creating meaningful connections between talented professionals and
              forward-thinking employers through cutting-edge technology and
              personalized career services.
            </p>
          </div>
        </Section>

        <Section
          title="User Accounts and Registration"
          icon={<Users size={20} />}
          isCollapsible={true}
          id="user-accounts-and-registration"
        >
          <h3 className="mb-3 font-semibold text-purple-700">
            Profile Creation
          </h3>
          <p className="mb-4">
            To access GigHub's features, you must create a complete and accurate
            profile. Job seekers must provide current employment information,
            skills, experience, and career preferences. Employers must verify
            their company information and provide legitimate job opportunities.
          </p>

          <h3 className="mb-3 font-semibold text-purple-700">
            Account Verification
          </h3>
          <p className="mb-4">
            We may require professional verification including LinkedIn
            integration, email verification, phone verification, or company
            domain confirmation for employer accounts to ensure platform
            integrity and user safety.
          </p>

          <h3 className="mb-3 font-semibold text-purple-700">
            Profile Visibility
          </h3>
          <p>
            You control your profile visibility settings. Job seekers can choose
            to make their profiles searchable by recruiters or keep them private
            while still accessing job opportunities.
          </p>
        </Section>

        <Section
          title="Job Seeker Responsibilities"
          icon={<Search size={20} />}
          id="job-seeker-responsibilities"
        >
          <h3 className="text-orange-600 mb-3 font-semibold">
            Profile Accuracy
          </h3>
          <p className="mb-4">
            Job seekers must maintain accurate, up-to-date profiles including:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>Current employment status and work history</li>
            <li>Education credentials and certifications</li>
            <li>Skills and professional competencies</li>
            <li>Career preferences and salary expectations</li>
            <li>Contact information and availability</li>
          </ul>

          <h3 className="text-orange-600 mb-3 font-semibold">
            Auto-Apply Settings
          </h3>
          <p className="mb-4">
            When using our auto-apply feature, you are responsible for setting
            appropriate filters and preferences. You acknowledge that
            applications will be submitted on your behalf based on these
            settings.
          </p>

          <HighlightBox type="info">
            <strong>Smart Matching:</strong> Our AI algorithms learn from your
            preferences and application history to improve job recommendations
            and auto-apply accuracy over time.
          </HighlightBox>
        </Section>

        <Section
          title="Employer and Job Posting Guidelines"
          isCollapsible={true}
          id="employer-and-job-posting-guidelines"
        >
          <h3 className="mb-3 font-semibold text-green-600">
            Legitimate Job Postings
          </h3>
          <p className="mb-4">
            Employers must post only legitimate, available positions with
            accurate job descriptions, requirements, compensation information,
            and company details. All job postings are subject to review and
            approval.
          </p>

          <h3 className="mb-3 font-semibold text-green-600">
            Candidate Scouting Ethics
          </h3>
          <p className="mb-4">
            When using our candidate scouting tools, employers must respect
            candidate privacy settings and comply with all applicable employment
            laws and anti-discrimination regulations.
          </p>

          <h3 className="mb-3 font-semibold text-green-600">
            Prohibited Practices
          </h3>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>Posting fake or misleading job opportunities</li>
            <li>
              Requesting personal information beyond professional requirements
            </li>
            <li>Discriminatory hiring practices</li>
            <li>Multi-level marketing or pyramid scheme opportunities</li>
            <li>Jobs requiring upfront payments from candidates</li>
          </ul>
        </Section>

        <Section
          title="Payment and Subscription Terms"
          id="payment-and-subscription-terms"
        >
          <h3 className="mb-3 font-semibold text-purple-700">
            Subscription Plans
          </h3>
          <p className="mb-4">
            GigHub offers various subscription tiers for enhanced features:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>
              <strong>Basic (Free):</strong> Profile creation, job search, and
              basic networking
            </li>
            <li>
              <strong>Professional:</strong> Auto-apply, advanced filters, and
              priority support
            </li>
            <li>
              <strong>Premium:</strong> Unlimited auto-apply, recruiter
              insights, and career coaching
            </li>
            <li>
              <strong>Enterprise:</strong> Advanced scouting tools, bulk
              posting, and analytics
            </li>
          </ul>

          <HighlightBox type="success">
            <strong>Billing:</strong> Subscriptions are billed monthly or
            annually. Cancel anytime with continued access until the end of your
            billing period.
          </HighlightBox>
        </Section>

        <Section
          title="Auto-Apply and Smart Matching Services"
          icon={<Network size={20} />}
          isCollapsible={true}
          id="auto-apply-and-smart-matching-services"
        >
          <h3 className="mb-3 font-semibold text-green-600">
            How Auto-Apply Works
          </h3>
          <p className="mb-4">
            Our auto-apply feature automatically submits job applications based
            on your specified criteria, preferences, and profile information.
            You maintain full control over which types of positions and
            companies receive applications.
          </p>

          <h3 className="mb-3 font-semibold text-green-600">
            Smart Matching Algorithm
          </h3>
          <p className="mb-4">
            Our proprietary matching algorithm considers multiple factors
            including skills, experience, location preferences, company culture
            fit, and career goals to suggest optimal job opportunities and
            candidates.
          </p>

          <HighlightBox type="warning">
            <strong>Important:</strong> While our technology enhances your job
            search, you remain responsible for all applications submitted and
            should review opportunities that result in interviews or offers.
          </HighlightBox>
        </Section>

        <Section
          title="Professional Networking Features"
          isCollapsible={true}
          id="professional-networking-features"
        >
          <p className="mb-4">
            GigHub's networking features allow you to connect with industry
            professionals, join professional groups, participate in career
            discussions, and build your professional brand.
          </p>

          <h3 className="mb-3 font-semibold text-purple-700">
            Networking Guidelines
          </h3>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>Maintain professional communication standards</li>
            <li>Respect others' privacy and connection preferences</li>
            <li>Share relevant, valuable professional content</li>
            <li>Avoid spam, solicitation, or inappropriate content</li>
          </ul>
        </Section>

        <Section
          title="Data Privacy and Protection"
          icon={<Shield size={20} />}
          id="data-privacy-and-protection"
        >
          <p className="mb-4">
            Your privacy is paramount. We collect and use professional
            information to provide our services, including job matching,
            networking facilitation, and career development. All data handling
            complies with applicable privacy laws including GDPR and CCPA.
          </p>

          <HighlightBox type="info">
            <strong>Data Control:</strong> You can download, modify, or delete
            your profile data at any time through your account settings.
          </HighlightBox>
        </Section>

        <Section
          title="Platform Fees and Premium Features"
          isCollapsible={true}
          id="platform-fees-and-premium-features"
        >
          <p className="mb-4">
            GigHub operates on a freemium model with optional premium
            subscriptions:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>Basic job search and networking: Free</li>
            <li>Premium job seeker features: $19.99/month</li>
            <li>Professional recruiter tools: $99/month</li>
            <li>Enterprise solutions: Custom pricing</li>
          </ul>
          <p>
            All fees are clearly disclosed before subscription activation.
            Premium features enhance your experience but core functionality
            remains free.
          </p>
        </Section>

        <Section
          title="Dispute Resolution"
          isCollapsible={true}
          id="dispute-resolution"
        >
          <h3 className="text-orange-600 mb-3 font-semibold">User Disputes</h3>
          <p className="mb-4">
            For disputes between users (job seekers and employers), we provide
            mediation services and reporting tools. We encourage professional
            communication and fair treatment of all platform users.
          </p>

          <h3 className="text-orange-600 mb-3 font-semibold">
            Platform Disputes
          </h3>
          <p>
            Issues with GigHub services should first be reported through our
            support system. For unresolved matters, binding arbitration may be
            required as outlined in our complete terms.
          </p>
        </Section>

        <Section
          title="Limitation of Liability"
          icon={<Shield size={20} />}
          id="limitation-of-liability"
        >
          <HighlightBox type="warning">
            <strong>Important:</strong> GigHub facilitates connections between
            job seekers and employers but cannot guarantee job placement,
            interview success, or hiring outcomes.
          </HighlightBox>
          <p className="mb-4">
            While we strive to provide accurate job information and quality
            matches, we are not responsible for employer decisions, job offer
            accuracy, workplace conditions, or employment outcomes. Users engage
            with employers at their own discretion.
          </p>
        </Section>

        <Section
          title="Account Termination"
          isCollapsible={true}
          id="account-termination"
        >
          <p className="mb-4">
            Either party may terminate an account at any time. We reserve the
            right to suspend or terminate accounts that violate these Terms,
            engage in fraudulent activity, or misuse our platform.
          </p>
          <p>
            Upon termination, your profile data will be removed according to our
            data retention policy, though some information may be retained for
            legal compliance purposes.
          </p>
        </Section>

        <Section title="Modifications to Terms" id="modifications-to-terms">
          <p className="mb-4">
            We may update these Terms to reflect new features, legal
            requirements, or platform improvements. Significant changes will be
            communicated via email and platform notifications at least 30 days
            before taking effect.
          </p>
          <p>
            Continued use of GigHub after changes constitutes acceptance of the
            updated Terms.
          </p>
        </Section>

        <Section
          title="Contact Information"
          icon={<Mail size={20} />}
          id="contact-information"
        >
          <p className="mb-4">
            For questions about these Terms and Conditions or our services:
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail size={18} style={{ color: "#6438C2" }} />
              <span>legal@gighub.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} style={{ color: "#FA4E09" }} />
              <span>+1 (555) GIG-JOBS</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users size={18} style={{ color: "#51FF00" }} />
              <span>Support Center: help.gighub.com</span>
            </div>
          </div>

          <HighlightBox type="success">
            <strong>Response Time:</strong> We typically respond to inquiries
            within 24-48 hours during business days.
          </HighlightBox>
        </Section>

        {/* Footer */}
        <div className="border-gray-200 text-gray-500 mt-12 border-t pt-8 text-center">
          <p className="mb-2">© 2025 GigHub, Inc. All rights reserved.</p>
          <p className="text-sm">
            Empowering careers and connecting talent worldwide
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <span className="font-medium text-purple-600">Job Search</span>
            <span className="text-orange-500 font-medium">
              Professional Networking
            </span>
            <span className="font-medium text-green-500">Career Growth</span>
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
};

export default TermsAndConditions;
