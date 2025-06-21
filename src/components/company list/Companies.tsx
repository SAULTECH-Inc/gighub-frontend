import { Link } from "react-router-dom";
import { LuMessageCircleMore } from "react-icons/lu";
import React from "react";
import { EmployerData } from "../../utils/types";
import { useChatStore } from "../../store/useChatStore.ts";

type companyInterface = {
  company: EmployerData;
};

const Companies: React.FC<companyInterface> = ({ company }) => {
  const { setIsClosed, setRecipient } = useChatStore();
  return (
    <div className="max-w-[500px] rounded-[16px] border-[1px] border-[#E6E6E6] bg-white sm:max-w-[280px] lg:max-w-[263px]">
      <div className="flex w-full flex-col items-start">
        <div className="relative mt-[33px] flex h-20 w-full items-center">
          <hr className="absolute w-full border border-[#AFAFAF]" />
          <div className="absolute left-5 h-full w-20 rounded-full bg-[#AFAFAF]"></div>
        </div>
        <div className="flex flex-col items-start p-4">
          <h4 className="text-[20px] font-bold text-black">
            {company?.companyName}
          </h4>
          <div
            className="text-sm text-[#8E8E8E]"
            dangerouslySetInnerHTML={{
              __html:
                company?.companyDescription ||
                company?.aboutCompany ||
                "<p></p>",
            }}
          ></div>
          <div className="my-3 flex items-start justify-between space-x-4">
            <Link
              to={`/employers/${company?.id}/${company?.companyName}/profile`}
              className="flex h-[38px] w-[129px] items-center justify-center rounded-[10px] border-[1px] border-[#E6E6E6] text-black"
            >
              View Profile
            </Link>
            <div
              onClick={() => {
                setRecipient(company.email);
                setIsClosed(false);
              }}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#6438C2]"
            >
              <LuMessageCircleMore className="text-[20px] text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
