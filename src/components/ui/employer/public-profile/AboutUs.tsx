import { EmployerData } from "../../../../utils/types";
import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink
} from "lucide-react";

interface AboutUsProp {
  user: EmployerData;
}

const AboutUs: React.FC<AboutUsProp> = ({ user }) => {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: user?.linkedInProfile,
      icon: Linkedin,
      color: "text-blue-600 hover:bg-blue-50"
    },
    {
      name: "Facebook",
      url: user?.facebookProfile,
      icon: Facebook,
      color: "text-blue-700 hover:bg-blue-50"
    },
    {
      name: "Twitter",
      url: user?.twitterProfile,
      icon: Twitter,
      color: "text-sky-500 hover:bg-sky-50"
    },
    {
      name: "Instagram",
      url: user?.instagramProfile,
      icon: Instagram,
      color: "text-pink-600 hover:bg-pink-50"
    },
  ].filter(link => link.url && link.url !== "#");

  const companyStats = [
    {
      icon: Building2,
      label: "Industry",
      value: user?.industry,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: Users,
      label: "Company Size",
      value: user?.companySize,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: MapPin,
      label: "Location",
      value: user?.companyAddress,
      color: "text-amber-600 bg-amber-50",
    },
  ].filter(stat => stat.value);

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-6 text-2xl font-bold text-slate-900">About Us</h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Company Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-xl bg-slate-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">Our Story</h3>
              <div
                dangerouslySetInnerHTML={{ __html: user?.companyDescription || "No description available." }}
                className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600"
              />
            </div>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="rounded-xl bg-slate-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Connect With Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-all ${social.color}`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{social.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Company Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-xl bg-slate-50 p-6">
              <h3 className="mb-6 text-lg font-semibold text-slate-800">Company Details</h3>
              <div className="space-y-4">
                {companyStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`rounded-lg p-2.5 ${stat.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="text-base font-semibold text-slate-900 break-words">
                          {stat.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;