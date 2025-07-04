import { EmployerData } from "../../../../utils/types";
import React from "react";

interface ContactInformationProp {
  user: EmployerData;
}
const ContactInformation: React.FC<ContactInformationProp> = ({ user }) => {
  return (
    <section className="w-full rounded-lg bg-gray-100 p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B5AED] text-white">
          <span className="text-xs">📧</span>
        </div>
        <p className="text-sm text-gray-700">{user?.email}</p>
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B5AED] text-white">
          <span className="text-xs">📞</span>
        </div>
        <p className="text-sm text-gray-700">
          {user?.companyPhone || user?.managerPhoneNumber}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B5AED] text-white">
          <span className="text-xs">🏠</span>
        </div>
        <p className="text-sm text-gray-700">{user?.companyAddress}</p>
      </div>
    </section>
  );
};

export default ContactInformation;
