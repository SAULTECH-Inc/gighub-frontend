import React, { useEffect, useState } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import Rating from "../common/Rating.tsx";
import personpics from "../../assets/images/person-pics.png";
import { ApplicantData } from "../../utils/types";
import { useSearchUserConnections } from "../../hooks/useSearchUserConnections.ts";

interface ReferModalProp {
  modalId: string;
  handleRefer: (applicantEmails: string[]) => void;
}

interface SelectableReferee {
  user: ApplicantData;
  selected: boolean;
}

const ReferModal: React.FC<ReferModalProp> = ({ modalId, handleRefer }) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  const [page] = useState(1);
  const limit = 10;

  const [selectedUsers, setSelectedUsers] = useState<ApplicantData[]>([]);
  const [selectableUsers, setSelectableUsers] = useState<SelectableReferee[]>(
    [],
  );

  const [searchParams, setSearchParams] = useState({
    name: "",
    location: "",
    profession: "",
  });

  const { data: searchResults } = useSearchUserConnections(
    page,
    limit,
    searchParams,
  );

  useEffect(() => {
    if (searchResults?.data) {
      const filtered = searchResults.data.filter(
        (result) => !selectedUsers.some((sel) => sel.id === result.id),
      );

      const mapped = filtered.map((n) => ({
        selected: false,
        user: { ...n } as ApplicantData,
      }));

      setSelectableUsers(mapped);
    }
  }, [searchResults, selectedUsers]);

  const handleCloseApplicationModal = () => closeModal(modalId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 p-4">
      <div className="relative flex h-[90vh] w-full max-w-[98%] flex-col overflow-hidden rounded-lg bg-white pt-8 md:h-[650px] md:max-w-[720px]">
        <div className="w-full flex-1 space-y-4 overflow-y-auto px-4">
          {/* Header */}
          <div className="flex w-full items-center justify-between">
            <h1 className="text-lg font-semibold text-[#6438C2] md:text-[24px]">
              Refer Someone
            </h1>
            <svg
              style={{ cursor: "pointer" }}
              onClick={handleCloseApplicationModal}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.001 5L5.00098 19M5.00098 5L19.001 19"
                stroke="#6438C2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Subtext */}
          <div className="w-full text-sm text-[#8E8E8E] md:text-base">
            <p>Connect opportunities with talent by referring someone</p>
            <p>from your network to this job</p>
          </div>

          {/* Search */}
          <div className="flex w-full items-center justify-between gap-x-2 rounded-[10px] border border-[#E6E6E6] px-4 py-2">
            <input
              placeholder="Search from your network"
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  name: e.target.value,
                })
              }
              className="w-full border-none bg-transparent outline-none focus:ring-0"
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.583 14.583L18.333 18.333"
                stroke="#8E8E8E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.667 9.16699C16.667 5.02486 13.3092 1.66699 9.16699 1.66699C5.02486 1.66699 1.66699 5.02486 1.66699 9.16699C1.66699 13.3092 5.02486 16.667 9.16699 16.667C13.3092 16.667 16.667 13.3092 16.667 9.16699Z"
                stroke="#8E8E8E"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mt-2 flex w-full flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-x-2 rounded-full bg-[#6438C2] px-3 py-1 text-xs text-white"
                >
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={() => {
                      // Remove from selected
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.id !== user.id),
                      );
                      // Add back to selectable list
                      setSelectableUsers((prev) => [
                        { user, selected: false },
                        ...(prev || []),
                      ]);
                    }}
                    className="hover:text-gray-300 ml-1 font-bold text-white"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* User List */}
          <div className="flex h-[300px] w-full flex-col gap-y-2 overflow-y-auto rounded-[16px] border border-[#E6E6E6] p-4">
            {selectableUsers?.map((referee) => (
              <div
                key={referee.user.id}
                className="flex w-full flex-col items-center justify-between gap-y-2 rounded-[10px] bg-[#F7F8FA] px-4 py-2 hover:bg-[#e6e6e6] md:flex-row"
              >
                {/* Avatar & Name */}
                <div className="flex w-full items-center gap-x-2">
                  <div className="h-[27px] w-[27px] overflow-hidden rounded-full">
                    <img
                      src={personpics}
                      alt="user"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <p className="text-sm">
                    {referee.user.firstName} {referee.user.lastName}
                  </p>
                </div>

                {/* Title & Rating */}
                <div className="flex w-full items-center gap-x-2">
                  <p className="text-gray-700 text-sm">
                    {referee.user.professionalTitle}
                  </p>
                  <Rating value={2} readOnly={true} />
                </div>

                {/* Selection Indicator */}
                <div className="flex w-full items-center justify-end">
                  <div
                    onClick={() => {
                      setSelectedUsers((prev) => [...prev, referee.user]);
                      setSelectableUsers((prev) =>
                        prev?.filter((r) => r.user.id !== referee.user.id),
                      );
                    }}
                    className={`h-[18px] w-[18px] cursor-pointer rounded-full border-[#6438C2] ${
                      referee.selected ? "border-[5px]" : "border-[1px]"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex w-full items-center justify-between bg-[#6438C2] px-4 py-3">
          <p className="text-sm text-white">
            The person you refer will be notified
          </p>
          <button
            onClick={() => {
              const applicantEmails = selectedUsers
                .map((u) => u.email)
                .filter((s) => s !== null)
                .filter(Boolean);
              handleRefer(applicantEmails);
            }}
            className="w-[139px] rounded-[10px] bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Refer now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferModal;
