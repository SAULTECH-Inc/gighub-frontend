import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Link as LinkIcon,
  Mail,
  Share2,
  Bookmark,
  Check,
  AlertCircle,
  Award,
  TrendingUp,
  Globe,
  Zap,
} from "lucide-react";

interface JobDetailViewProps {
  job: any; // Replace with proper type
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job }) => {
  const [activeTab, setActiveTab] = useState<"description" | "company">("description");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex gap-4">
            <img
              src={job?.employer?.companyLogo}
              alt={job?.company}
              className="h-16 w-16 rounded-xl border-2 border-white object-cover shadow-md"
            />
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-900">
                {job?.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{job?.company}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="rounded-lg border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50">
              <Bookmark className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-medium">Location</span>
            </div>
            <p className="mt-1 font-semibold text-gray-900">{job?.location}</p>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-medium">Job Type</span>
            </div>
            <p className="mt-1 font-semibold text-gray-900">{job?.jobType}</p>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Salary</span>
            </div>
            <p className="mt-1 font-semibold text-gray-900">
              {job?.salaryRange?.currency}
              {job?.salaryRange?.minimumAmount?.toLocaleString()} - {job?.salaryRange?.maximumAmount?.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Deadline</span>
            </div>
            <p className="mt-1 font-semibold text-gray-900">
              {new Date(job?.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700">
            Apply Now
          </button>
          <button className="rounded-lg border-2 border-purple-600 bg-white px-6 py-3 font-semibold text-purple-600 transition-colors hover:bg-purple-50">
            Save Job
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "description"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Job Description
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "company"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Company Info
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "description" ? (
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Zap className="h-5 w-5 text-purple-600" />
                Job Overview
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: job?.description }}
              />
            </div>

            {/* Skills Required */}
            {job?.skillSet?.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Award className="h-5 w-5 text-purple-600" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillSet.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Details */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                Additional Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applicants</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {job?.applicantsCount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Posted</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {new Date(job?.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Experience</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {job?.experienceLevel || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Work Mode</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {job?.employmentType || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Overview */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Building2 className="h-5 w-5 text-purple-600" />
                About {job?.company}
              </h2>
              <p className="text-gray-700">
                {job?.employer?.companyDescription || "Company description not available."}
              </p>
            </div>

            {/* Company Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company Size</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {job?.employer?.companySize || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Headquarters</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {job?.employer?.headquarters || job?.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <LinkIcon className="h-5 w-5 text-purple-600" />
                Connect with Us
              </h2>
              <div className="space-y-2">
                {job?.employer?.website && (
                  <a
                    href={job.employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                  >
                    <Globe className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Visit Website
                    </span>
                  </a>
                )}

                {job?.employer?.email && (
                  <a
                    href={`mailto:${job.employer.email}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                  >
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {job.employer.email}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Benefits */}
            {job?.benefits?.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Award className="h-5 w-5 text-purple-600" />
                  Benefits & Perks
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {job.benefits.map((benefit: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-sm text-gray-900">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailView;