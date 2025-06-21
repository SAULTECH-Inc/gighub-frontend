import Companies from "../../components/company list/Companies";
import CompanyNavbar from "../../components/company list/CompanyNavbar";
import TopNavBar from "../../components/layouts/TopNavBar";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";
import { useEffect, useState } from "react";
import { EmployerData } from "../../utils/types";
import { fetchCompanies } from "../../services/api";
import { toast } from "react-toastify";

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: {
    companyName?: string;
    industry?: string;
    location?: string;
  };
  sortDirection: string;
}
const CompanyList = () => {
  const [companies, setCompanies] = useState<EmployerData[]>();
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 20,
    sortBy: {
      companyName: "",
      industry: "",
      location: "",
    },
    sortDirection: "DESC",
  });

  useEffect(() => {
    const doFetchCompanies = async () => {
      return await fetchCompanies(pagination);
    };

    doFetchCompanies()
      .then((res) => {
        setCompanies(res.data);
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  }, [pagination]);

  return (
    <div className="relative overflow-hidden">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="bg-[#F7F8FA] p-4">
        <CompanyNavbar pagination={pagination} onChange={setPagination} />
        <div className="mt-5 flex items-start gap-x-6 max-lg:flex-col-reverse">
          <div className="flex w-full flex-col justify-center rounded-[16px] bg-white p-4 shadow-md">
            <div className="flex w-[96%] flex-wrap gap-4 sm:w-full lg:justify-start">
              <div className="my-2 flex w-full flex-col justify-center lg:hidden">
                <h2 className="text-[24px] font-bold text-black">
                  Find Companies Easily
                </h2>
                <span className="font-bold">Sunday 6, 2024</span>
              </div>
              {companies?.map((company, index) => (
                <Companies key={index} company={company} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
