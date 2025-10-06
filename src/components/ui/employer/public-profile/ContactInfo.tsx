import { EmployerData } from "../../../../utils/types";
import React, { useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  ExternalLink,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface ContactInformationProp {
  user: EmployerData;
}

const ContactInformation: React.FC<ContactInformationProp> = memo(
  ({ user }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = useCallback(async (text: string, fieldName: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }, []);

    const contactItems = [
      {
        id: "email",
        icon: Mail,
        label: "Email Address",
        value: user?.email,
        href: `mailto:${user?.email}`,
        color: "text-blue-600 bg-blue-50",
        copyable: true,
      },
      {
        id: "phone",
        icon: Phone,
        label: "Phone Number",
        value: user?.companyPhone || user?.managerPhoneNumber,
        href: `tel:${user?.companyPhone || user?.managerPhoneNumber}`,
        color: "text-green-600 bg-green-50",
        copyable: true,
      },
      {
        id: "address",
        icon: MapPin,
        label: "Office Address",
        value: user?.companyAddress,
        href: user?.companyAddress
          ? `https://maps.google.com?q=${encodeURIComponent(user.companyAddress)}`
          : undefined,
        color: "text-orange-600 bg-orange-50",
        copyable: true,
        external: true,
      },
    ].filter((item) => item.value);

    if (contactItems.length === 0) {
      return (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="py-8 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-600">
              No Contact Information Available
            </h3>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6 flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <div className="w-fit rounded-lg bg-indigo-100 p-2">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Contact Information
            </h2>
          </div>

          {/* Contact Items */}
          <div className="space-y-4 sm:space-y-6">
            {contactItems.map((item, index) => {
              const IconComponent = item.icon;
              const isCopied = copiedField === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md sm:p-6"
                >
                  {/* Mobile Layout: Stack everything vertically */}
                  <div className="flex flex-col space-y-4 sm:hidden">
                    {/* Icon and Label */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`rounded-lg p-2.5 ${item.color} transition-colors`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-500">
                          {item.label}
                        </p>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="px-1">
                      <p className="text-base leading-relaxed font-semibold break-all text-slate-900">
                        {item.value}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      {/* Copy Button */}
                      {item.copyable && (
                        <button
                          onClick={() => handleCopy(item.value!, item.id)}
                          className={`flex items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            isCopied
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                          }`}
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Copy {item.label}</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* External Link Button */}
                      {item.href && (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={
                            item.external ? "noopener noreferrer" : undefined
                          }
                          className="flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:bg-indigo-800"
                        >
                          {item.external ? (
                            <>
                              <ExternalLink className="h-4 w-4" />
                              <span>View on Map</span>
                            </>
                          ) : (
                            <>
                              <IconComponent className="h-4 w-4" />
                              <span>Contact</span>
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout: Side by side */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="mr-4 flex min-w-0 flex-1 items-center space-x-4">
                      {/* Icon */}
                      <div
                        className={`rounded-lg p-3 ${item.color} shrink-0 transition-colors`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-500">
                          {item.label}
                        </p>
                        <p className="text-base font-semibold break-words text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center space-x-2">
                      {/* Copy Button */}
                      {item.copyable && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(item.value!, item.id)}
                          className={`flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            isCopied
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </motion.button>
                      )}

                      {/* External Link Button */}
                      {item.href && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={
                            item.external ? "noopener noreferrer" : undefined
                          }
                          className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700"
                        >
                          {item.external ? (
                            <>
                              <ExternalLink className="h-4 w-4" />
                              <span>View</span>
                            </>
                          ) : (
                            <>
                              <IconComponent className="h-4 w-4" />
                              <span>Contact</span>
                            </>
                          )}
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 rounded-xl bg-slate-50 p-4 sm:mt-8 sm:p-6"
          >
            <h3 className="mb-3 text-lg font-semibold text-slate-900 sm:mb-4">
              Get in Touch
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              We're always excited to connect with talented individuals. Whether
              you're interested in job opportunities, partnerships, or just want
              to learn more about our company, feel free to reach out.
            </p>

            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                <Mail className="h-4 w-4" />
                <span>Send Message</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
              >
                <Building2 className="h-4 w-4" />
                <span>Schedule Visit</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:mt-6 sm:p-6"
          >
            <h3 className="mb-3 text-lg font-semibold text-slate-900 sm:mb-4">
              Business Hours
            </h3>
            <div className="space-y-2 sm:space-y-1">
              {[
                { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((schedule, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-1 py-1 sm:flex-row sm:justify-between sm:space-y-0 sm:py-0.5"
                >
                  <span className="text-sm font-medium text-slate-700 sm:text-base">
                    {schedule.day}
                  </span>
                  <span className="text-sm text-slate-600 sm:text-base">
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  },
);

ContactInformation.displayName = "ContactInformation";

export default ContactInformation;
