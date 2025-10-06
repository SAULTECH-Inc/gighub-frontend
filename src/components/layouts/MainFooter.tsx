import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  ChevronUp,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePlatform } from "../../store/usePlatform.ts";

const MainFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const { subscribe, isSubscribed } = usePlatform();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewsletterSubmit = () => {
    if (email.trim()) {
      subscribe(email).then(() => {
        setEmail("");
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Newsletter Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-3 text-xl font-bold">Stay Updated</h3>
          <p className="mb-4 text-gray-300">
            Get the latest job opportunities delivered to your inbox
          </p>

          {!isSubscribed && (
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={handleNewsletterSubmit}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
              >
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          )}

          {isSubscribed && (
            <div className="text-green-400">✓ Successfully subscribed!</div>
          )}
        </div>

        {/* Links Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* For Job Seekers */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-purple-400">
              For Job Seekers
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/jobs" className="text-gray-300 hover:text-white">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="/auto-apply"
                  className="text-gray-300 hover:text-white"
                >
                  Auto Apply
                </a>
              </li>
              <li>
                <a
                  href="/resume-builder"
                  className="text-gray-300 hover:text-white"
                >
                  Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="/career-advice"
                  className="text-gray-300 hover:text-white"
                >
                  Career Advice
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-orange-400">
              For Employers
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/post-job" className="text-gray-300 hover:text-white">
                  Post a Job
                </a>
              </li>
              <li>
                <a
                  href="/candidate-search"
                  className="text-gray-300 hover:text-white"
                >
                  Search Candidates
                </a>
              </li>
              <li>
                <a
                  href="/smart-match"
                  className="text-gray-300 hover:text-white"
                >
                  Smart Match
                </a>
              </li>
              <li>
                <a
                  href="/employer-solutions"
                  className="text-gray-300 hover:text-white"
                >
                  Enterprise Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-green-400">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8 grid grid-cols-1 gap-4 text-center md:grid-cols-3">
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} className="text-purple-400" />
            <span className="text-sm">hello@gighub.com</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} className="text-orange-400" />
            <span className="text-sm">+1 (555) GIG-JOBS</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-green-400" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col items-center justify-between border-t border-gray-700 pt-8 md:flex-row">
          <div className="mb-4 flex gap-4 md:mb-0">
            <a
              href="#"
              className="rounded-full bg-blue-600 p-2 hover:bg-blue-700"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="rounded-full bg-sky-500 p-2 hover:bg-sky-600"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              className="rounded-full bg-blue-700 p-2 hover:bg-blue-800"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="#"
              className="rounded-full bg-pink-600 p-2 hover:bg-pink-700"
            >
              <Instagram size={16} />
            </a>
          </div>

          <div className="text-center text-sm text-gray-400">
            © {currentYear} GigHub, Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 rounded-full bg-purple-600 p-3 text-white hover:bg-purple-700"
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default MainFooter;
