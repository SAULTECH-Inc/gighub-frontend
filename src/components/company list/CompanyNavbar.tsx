import microscope from "../../assets/icons/microscope.svg";
import certificate from "../../assets/icons/certificate.svg";
import location from "../../assets/icons/locations.svg";
import { PaginationParams } from "../../pages/company list/CompanyList.tsx";
import React from "react";
import moment from "moment";

interface CompanyNavbarProps {
  onChange: React.Dispatch<React.SetStateAction<PaginationParams>>;
  pagination: PaginationParams;
}
const CompanyNavbar: React.FC<CompanyNavbarProps> = ({
  onChange,
  pagination,
}) => {
  return (
    <header className="rounded-[16px] bg-white">
      <nav className="hidden items-center justify-between rounded-[16px] lg:flex">
        <div className="flex w-[30%] flex-col justify-center">
          <h2 className="text-[24px] font-bold text-black">
            Find Companies Easily
          </h2>
          <span className="font-bold">{moment().format("dddd D, YYYY")}</span>
        </div>
        <div className="mr-5 flex w-[70%] items-end justify-evenly gap-2">
          <div className="flex w-full items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
            <img src={microscope} alt="microscope" className="m-2" />
            <input
              type="text"
              placeholder="Company Name"
              onChange={(e) =>
                onChange({
                  ...pagination,
                  sortBy: { ...pagination.sortBy, companyName: e.target.value },
                })
              }
              className="h-full w-full border-none bg-transparent px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full items-center rounded-[16px] border-2 border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
            <img src={certificate} alt="certificate" className="m-2" />
            <input
              type="text"
              placeholder="Industry"
              onChange={(e) =>
                onChange({
                  ...pagination,
                  sortBy: { ...pagination.sortBy, industry: e.target.value },
                })
              }
              className="h-full w-full border-none bg-transparent px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full items-center rounded-[16px] border-2 border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
            <img src={location} alt="location" className="m-2" />
            <input
              type="text"
              placeholder="Location"
              onChange={(e) =>
                onChange({
                  ...pagination,
                  sortBy: { ...pagination.sortBy, location: e.target.value },
                })
              }
              className="h-full w-full border-none bg-transparent px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default CompanyNavbar;
