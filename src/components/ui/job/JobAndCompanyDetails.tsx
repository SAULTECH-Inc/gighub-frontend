import JobDescription from "../applicant/job/JobDescription.tsx";
import CompanyInfo from "../applicant/job/CompanyInfo.tsx";
import React from "react";
import { motion } from "framer-motion";

export const JobAndCompanyDetails: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100"
    >
      <div className="flex w-full flex-col lg:grid lg:grid-cols-[2fr_1fr]">
        <JobDescription />
        <CompanyInfo />
      </div>
    </motion.div>
  );
};