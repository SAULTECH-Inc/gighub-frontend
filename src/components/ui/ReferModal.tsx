import React, { useEffect, useState } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import personpics from "../../assets/images/person-pics.png";
import { ApplicantData } from "../../utils/types";
import { useSearchUserConnections } from "../../hooks/useSearchUserConnections.ts";
import {
  X,
  Search,
  Users,
  UserPlus,
  Star,
  CheckCircle,
  Mail,
  Loader2,
} from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCloseModal = () => {
    closeModal(modalId);
    setSelectedUsers([]);
    setSearchParams({ name: "", location: "", profession: "" });
  };

  const handleSubmitRefer = async () => {
    setIsSubmitting(true);
    try {
      const applicantEmails = selectedUsers
        .map((u) => u.email)
        .filter((s) => s !== null)
        .filter(Boolean);
      await handleRefer(applicantEmails);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectUser = (user: ApplicantData) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSelectableUsers((prev) => prev?.filter((r) => r.user.id !== user.id));
  };

  const deselectUser = (user: ApplicantData) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelectableUsers((prev) => [{ user, selected: false }, ...(prev || [])]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Refer Someone
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Connect talent with opportunity
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="rounded-full p-2 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Description */}
          <div className="border-b border-slate-100 p-4 pb-4 sm:p-6">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Help someone in your network discover this opportunity. They'll be
              notified about the position and your referral.
            </p>
          </div>

          {/* Search Bar */}
          <div className="p-4 pb-4 sm:p-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
              </div>
              <input
                placeholder="Search from your network..."
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-indigo-500 sm:py-3 sm:text-base"
              />
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="px-4 pb-4 sm:px-6">
              <div className="mb-3 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  Selected ({selectedUsers.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-800"
                  >
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <button
                      onClick={() => deselectUser(user)}
                      className="rounded-full p-0.5 transition-colors hover:bg-indigo-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="flex-1 overflow-hidden px-4 pb-4 sm:px-6">
            <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {selectableUsers?.length > 0 ? (
                <div className="h-full space-y-2 overflow-y-auto p-3 sm:space-y-3 sm:p-4">
                  {selectableUsers.map((referee) => (
                    <div
                      key={referee.user.id}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white transition-all duration-200 hover:border-indigo-300 hover:shadow-sm"
                      onClick={() => selectUser(referee.user)}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          {/* User Info */}
                          <div className="flex min-w-0 flex-1 items-center space-x-3">
                            <div className="relative">
                              <img
                                src={referee.user.profilePicture || personpics}
                                alt={`${referee.user.firstName} ${referee.user.lastName}`}
                                className="h-10 w-10 rounded-full border-2 border-slate-200 object-cover sm:h-12 sm:w-12"
                              />
                              <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                                {referee.user.firstName} {referee.user.lastName}
                              </h3>
                              <p className="truncate text-xs text-slate-600 sm:text-sm">
                                {referee.user.professionalTitle ||
                                  "Professional"}
                              </p>

                              {/* Rating - Mobile: Below name, Desktop: Inline */}
                              <div className="mt-1 flex items-center space-x-2 sm:mt-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 fill-current text-amber-400 sm:h-4 sm:w-4" />
                                  <span className="text-xs text-slate-600 sm:text-sm">
                                    4.5
                                  </span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3 text-slate-400 sm:h-4 sm:w-4" />
                                  <span className="text-xs text-slate-600 sm:text-sm">
                                    Available
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Select Button */}
                          <div className="ml-3 flex-shrink-0">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-indigo-300 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 sm:h-6 sm:w-6">
                              <div className="h-2 w-2 rounded-full bg-indigo-500 opacity-0 transition-opacity group-hover:opacity-100 sm:h-3 sm:w-3"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-slate-300 sm:h-16 sm:w-16" />
                    <h3 className="mb-2 text-base font-medium text-slate-600 sm:text-lg">
                      No connections found
                    </h3>
                    <p className="text-sm text-slate-500">
                      Try adjusting your search or check back later
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Mail className="h-4 w-4" />
              <span>Selected users will be notified via email</span>
            </div>

            <div className="flex w-full space-x-3 sm:w-auto">
              <button
                onClick={handleCloseModal}
                className="flex-1 rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-white sm:flex-none"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitRefer}
                disabled={selectedUsers.length === 0 || isSubmitting}
                className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>
                      Refer{" "}
                      {selectedUsers.length > 0
                        ? `(${selectedUsers.length})`
                        : "Now"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferModal;
