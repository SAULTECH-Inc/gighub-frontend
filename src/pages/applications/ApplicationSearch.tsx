import React, { useState } from "react";
import { FilterIcon } from "../../assets/icons";
import { BiSortAlt2 } from "react-icons/bi";

const ApplicationSearch: React.FC = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const ModalOverlay = ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 lg:hidden">
      <div className="w-[80%] max-w-sm rounded-xl bg-white p-4 shadow-lg">
        <button
          onClick={onClose}
          className="text-gray-500 mb-2 ml-auto block text-sm"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="my-4 mt-4 flex w-full flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="flex sm:w-[20%]">
          <p className="font-bold lg:text-[20px]">My Applications</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#E6E6E6] px-10 py-2 lg:hidden"
            onClick={() => setShowFilterModal(true)}
          >
            <img src={FilterIcon} alt="filter icon" />
            <p className="font-bold text-[#8E8E8E]">Filter</p>
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#E6E6E6] px-10 py-2 lg:hidden"
            onClick={() => setShowSortModal(true)}
          >
            <BiSortAlt2 className="size-6 fill-[#8E8E8E]" />
            <p className="font-bold text-[#8E8E8E]">Sort</p>
          </div>
          <div className="hidden w-full flex-col lg:flex">
            <div className="flex w-fit items-center gap-4 rounded-[16px] bg-[#F7F7F7] px-2 lg:hidden">
              <span className="font-bold">Sort By:</span>
              <div className="flex gap-2 py-2">
                <button className="flex items-center gap-1 rounded-lg border border-[#E6E6E6] px-4 py-1">
                  Company
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-[#E6E6E6] px-4 py-1">
                  Date
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden w-[80%] items-center justify-between gap-2 rounded-[16px] bg-[#F7F7F7] px-4 py-2 lg:flex">
          <p className="font-bold">Filter By:</p>
          <button className="rounded-[10px] border border-[#E6E6E6] bg-white px-5 py-1">
            Pending
          </button>
          <button className="rounded-[10px] border border-[#E6E6E6] bg-white px-5 py-1">
            Hired
          </button>
          <button className="rounded-[10px] border border-[#E6E6E6] bg-white px-5 py-1">
            Rejected
          </button>
          <button className="rounded-[10px] border border-[#E6E6E6] bg-white px-5 py-1">
            Shortlisted
          </button>
        </div>
      </div>
      <div className="hidden w-full flex-col lg:flex">
        <div className="flex w-fit items-center gap-4 rounded-[16px] bg-[#F7F7F7] px-2">
          <span className="font-bold">Sort By:</span>
          <div className="flex gap-2 py-2">
            <button className="flex items-center gap-1 rounded-lg border border-[#E6E6E6] px-4 py-1">
              Company
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-[#E6E6E6] px-4 py-1">
              Date
            </button>
          </div>
        </div>
      </div>
      {showFilterModal && (
        <ModalOverlay onClose={() => setShowFilterModal(false)}>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 font-bold">Filter By:</p>
            <button className="rounded border border-[#E6E6E6] px-4 py-2">
              Pending
            </button>
            <button className="rounded border border-[#E6E6E6] px-4 py-2">
              Hired
            </button>
            <button className="rounded border border-[#E6E6E6] px-4 py-2">
              Rejected
            </button>
            <button className="rounded border border-[#E6E6E6] px-4 py-2">
              Shortlisted
            </button>
          </div>
        </ModalOverlay>
      )}
      {showSortModal && (
        <ModalOverlay onClose={() => setShowSortModal(false)}>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 font-bold">Sort By:</p>
            <button className="rounded border border-[#E6E6E6] px-4 py-2">
              Company
            </button>
            <button className="rounded border border-[#E6E6E6] px-4 py-2">
              Date
            </button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

export default ApplicationSearch;
