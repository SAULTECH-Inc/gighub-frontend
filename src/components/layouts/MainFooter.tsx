import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
  ChevronUp,
  Star,
  Users,
  Briefcase,
  TrendingUp,
  Shield,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const MainFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewsletterSubmit = () => {
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  // Handle link clicks (in real app, these would be proper navigation)
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    console.log(`Navigate to: ${path}`);
  };

  return (
    <footer className="from-gray-900 via-gray-800 relative mt-0 overflow-hidden bg-gradient-to-br to-black text-white md:mt-10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="bg-orange-500 absolute right-20 top-40 h-24 w-24 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 h-40 w-40 rounded-full bg-green-500 blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* Top Section - Newsletter & Quick Stats */}
        <div className="border-gray-700 mb-12 grid grid-cols-1 gap-8 border-b pb-12 lg:grid-cols-2">
          {/* Newsletter Signup */}
          <div className="space-y-6">
            <div>
              <h3 className="to-orange-400 mb-3 bg-gradient-to-r from-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                Stay Ahead in Your Career
              </h3>
              <p className="text-gray-300 mb-6">
                Get the latest job opportunities, career tips, and industry
                insights delivered to your inbox.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="border-gray-600 bg-gray-800 placeholder-gray-400 flex-1 rounded-lg border px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="to-orange-500 hover:to-orange-600 flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:shadow-xl"
                  style={{ boxShadow: "0 0 20px rgba(100, 56, 194, 0.3)" }}
                >
                  Subscribe <ArrowRight size={16} />
                </button>
              </div>
              {isSubscribed && (
                <div className="animate-fade-in flex items-center gap-2 text-green-400">
                  <CheckCircle size={16} />
                  <span className="text-sm">Successfully subscribed!</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border p-4 text-center transition-all duration-300">
              <div className="mb-2 flex items-center justify-center">
                <Users className="text-green-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-green-400">2.5M+</div>
              <div className="text-gray-400 text-sm">Active Job Seekers</div>
            </div>
            <div className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border p-4 text-center transition-all duration-300">
              <div className="mb-2 flex items-center justify-center">
                <Briefcase className="text-orange-400" size={24} />
              </div>
              <div className="text-orange-400 text-2xl font-bold">150K+</div>
              <div className="text-gray-400 text-sm">Job Opportunities</div>
            </div>
            <div className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border p-4 text-center transition-all duration-300">
              <div className="mb-2 flex items-center justify-center">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-purple-400">95%</div>
              <div className="text-gray-400 text-sm">Match Success Rate</div>
            </div>
            <div className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border p-4 text-center transition-all duration-300">
              <div className="mb-2 flex items-center justify-center">
                <Award className="text-yellow-400" size={24} />
              </div>
              <div className="text-yellow-400 text-2xl font-bold">500K+</div>
              <div className="text-gray-400 text-sm">Successful Hires</div>
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* For Job Seekers */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-400">
              <Users size={20} />
              For Job Seekers
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/jobs"
                  onClick={(e) => handleLinkClick(e, "/jobs")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="/auto-apply"
                  onClick={(e) => handleLinkClick(e, "/auto-apply")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Auto Apply
                </a>
              </li>
              <li>
                <a
                  href="/resume-builder"
                  onClick={(e) => handleLinkClick(e, "/resume-builder")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="/career-advice"
                  onClick={(e) => handleLinkClick(e, "/career-advice")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Career Advice
                </a>
              </li>
              <li>
                <a
                  href="/salary-insights"
                  onClick={(e) => handleLinkClick(e, "/salary-insights")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Salary Insights
                </a>
              </li>
              <li>
                <a
                  href="/skill-assessment"
                  onClick={(e) => handleLinkClick(e, "/skill-assessment")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Skill Assessment
                </a>
              </li>
              <li>
                <a
                  href="/interview-prep"
                  onClick={(e) => handleLinkClick(e, "/interview-prep")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Interview Prep
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h4 className="text-orange-400 flex items-center gap-2 text-lg font-semibold">
              <Briefcase size={20} />
              For Employers
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/post-job"
                  onClick={(e) => handleLinkClick(e, "/post-job")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Post a Job
                </a>
              </li>
              <li>
                <a
                  href="/candidate-search"
                  onClick={(e) => handleLinkClick(e, "/candidate-search")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Search Candidates
                </a>
              </li>
              <li>
                <a
                  href="/applicant-tracking"
                  onClick={(e) => handleLinkClick(e, "/applicant-tracking")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Applicant Tracking
                </a>
              </li>
              <li>
                <a
                  href="/employer-branding"
                  onClick={(e) => handleLinkClick(e, "/employer-branding")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Employer Branding
                </a>
              </li>
              <li>
                <a
                  href="/recruitment-analytics"
                  onClick={(e) => handleLinkClick(e, "/recruitment-analytics")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Recruitment Analytics
                </a>
              </li>
              <li>
                <a
                  href="/bulk-hiring"
                  onClick={(e) => handleLinkClick(e, "/bulk-hiring")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Bulk Hiring
                </a>
              </li>
              <li>
                <a
                  href="/enterprise-solutions"
                  onClick={(e) => handleLinkClick(e, "/enterprise-solutions")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Enterprise Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-green-400">
              <Globe size={20} />
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, "/about")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  About GigHub
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  onClick={(e) => handleLinkClick(e, "/careers")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/press"
                  onClick={(e) => handleLinkClick(e, "/press")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Press & Media
                </a>
              </li>
              <li>
                <a
                  href="/investor-relations"
                  onClick={(e) => handleLinkClick(e, "/investor-relations")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Investor Relations
                </a>
              </li>
              <li>
                <a
                  href="/partnerships"
                  onClick={(e) => handleLinkClick(e, "/partnerships")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Partnerships
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLinkClick(e, "/blog")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/success-stories"
                  onClick={(e) => handleLinkClick(e, "/success-stories")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-400">
              <Shield size={20} />
              Support & Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/help"
                  onClick={(e) => handleLinkClick(e, "/help")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, "/contact")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, "/privacy")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, "/terms")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  onClick={(e) => handleLinkClick(e, "/security")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="/api"
                  onClick={(e) => handleLinkClick(e, "/api")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  onClick={(e) => handleLinkClick(e, "/community")}
                  className="text-gray-300 transition-colors hover:text-white hover:underline"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-gray-700 mb-12 grid grid-cols-1 gap-6 border-b pb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800/30 hover:bg-gray-800/50 flex items-center gap-3 rounded-lg p-4 transition-all duration-300">
            <MapPin className="flex-shrink-0 text-purple-400" size={20} />
            <div>
              <div className="text-sm font-semibold">Headquarters</div>
              <div className="text-gray-400 text-sm">San Francisco, CA</div>
            </div>
          </div>
          <div className="bg-gray-800/30 hover:bg-gray-800/50 flex items-center gap-3 rounded-lg p-4 transition-all duration-300">
            <Phone className="text-orange-400 flex-shrink-0" size={20} />
            <div>
              <div className="text-sm font-semibold">Phone</div>
              <div className="text-gray-400 text-sm">+1 (555) GIG-JOBS</div>
            </div>
          </div>
          <div className="bg-gray-800/30 hover:bg-gray-800/50 flex items-center gap-3 rounded-lg p-4 transition-all duration-300">
            <Mail className="flex-shrink-0 text-green-400" size={20} />
            <div>
              <div className="text-sm font-semibold">Email</div>
              <div className="text-gray-400 text-sm">hello@gighub.com</div>
            </div>
          </div>
          <div className="bg-gray-800/30 hover:bg-gray-800/50 flex items-center gap-3 rounded-lg p-4 transition-all duration-300">
            <Clock className="flex-shrink-0 text-blue-400" size={20} />
            <div>
              <div className="text-sm font-semibold">Support Hours</div>
              <div className="text-gray-400 text-sm">24/7 Available</div>
            </div>
          </div>
        </div>

        {/* Social Media & App Downloads */}
        <div className="mb-8 flex flex-col items-center justify-between gap-8 lg:flex-row">
          {/* Social Media */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="mb-4 text-lg font-semibold">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "facebook")}
                className="rounded-full bg-blue-600 p-3 transition-all duration-300 hover:scale-110 hover:bg-blue-700"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "twitter")}
                className="rounded-full bg-sky-500 p-3 transition-all duration-300 hover:scale-110 hover:bg-sky-600"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "linkedin")}
                className="rounded-full bg-blue-700 p-3 transition-all duration-300 hover:scale-110 hover:bg-blue-800"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "instagram")}
                className="rounded-full bg-pink-600 p-3 transition-all duration-300 hover:scale-110 hover:bg-pink-700"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "youtube")}
                className="rounded-full bg-red-600 p-3 transition-all duration-300 hover:scale-110 hover:bg-red-700"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* App Downloads */}
          <div className="flex flex-col items-center lg:items-end">
            <h4 className="mb-4 text-lg font-semibold">Download Our App</h4>
            <div className="flex gap-4">
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "app-store")}
                className="block transition-transform duration-300 hover:scale-105"
              >
                <div className="border-gray-600 flex h-12 w-36 items-center justify-center rounded-lg border bg-black text-xs text-white">
                  <div className="text-center">
                    <div className="mb-1 text-[8px]">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, "google-play")}
                className="block transition-transform duration-300 hover:scale-105"
              >
                <div className="border-gray-600 flex h-12 w-36 items-center justify-center rounded-lg border bg-black text-xs text-white">
                  <div className="text-center">
                    <div className="mb-1 text-[8px]">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges & Certifications */}
        <div className="border-gray-700 mb-8 flex flex-wrap items-center justify-center gap-6 border-b border-t py-6">
          <div className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm transition-colors">
            <Shield size={16} className="text-green-400" />
            <span>SSL Secured</span>
          </div>
          <div className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm transition-colors">
            <Award size={16} className="text-yellow-400" />
            <span>ISO 27001 Certified</span>
          </div>
          <div className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm transition-colors">
            <Star size={16} className="text-purple-400" />
            <span>4.9/5 User Rating</span>
          </div>
          <div className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm transition-colors">
            <CheckCircle size={16} className="text-blue-400" />
            <span>GDPR Compliant</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-gray-400 flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {currentYear} GigHub, Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <a
                href="/sitemap"
                onClick={(e) => handleLinkClick(e, "/sitemap")}
                className="transition-colors hover:text-white"
              >
                Sitemap
              </a>
              <a
                href="/accessibility"
                onClick={(e) => handleLinkClick(e, "/accessibility")}
                className="transition-colors hover:text-white"
              >
                Accessibility
              </a>
              <a
                href="/cookies"
                onClick={(e) => handleLinkClick(e, "/cookies")}
                className="transition-colors hover:text-white"
              >
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="mb-1">Empowering careers worldwide</p>
            <p className="text-xs">Version 3.0.1 • Last updated: June 2025</p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="to-orange-500 fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-r from-purple-600 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ boxShadow: "0 0 20px rgba(100, 56, 194, 0.4)" }}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </button>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default MainFooter;
