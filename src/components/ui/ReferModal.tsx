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
  Loader2
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
  const [selectableUsers, setSelectableUsers] = useState<SelectableReferee[]>([]);
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
    setSelectableUsers((prev) =>
      prev?.filter((r) => r.user.id !== user.id),
    );
  };

  const deselectUser = (user: ApplicantData) => {
    setSelectedUsers((prev) =>
      prev.filter((u) => u.id !== user.id),
    );
    setSelectableUsers((prev) => [
      { user, selected: false },
      ...(prev || []),
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                Refer Someone
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Connect talent with opportunity
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Description */}
          <div className="p-4 sm:p-6 pb-4 border-b border-slate-100">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Help someone in your network discover this opportunity. They'll be notified about the position and your referral.
            </p>
          </div>

          {/* Search Bar */}
          <div className="p-4 sm:p-6 pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base placeholder-slate-500"
              />
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  Selected ({selectedUsers.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200"
                  >
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <button
                      onClick={() => deselectUser(user)}
                      className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="flex-1 px-4 sm:px-6 pb-4 overflow-hidden">
            <div className="h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              {selectableUsers?.length > 0 ? (
                <div className="h-full overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {selectableUsers.map((referee) => (
                    <div
                      key={referee.user.id}
                      className="bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      onClick={() => selectUser(referee.user)}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          {/* User Info */}
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="relative">
                              <img
                                src={referee.user.profilePicture || personpics}
                                alt={`${referee.user.firstName} ${referee.user.lastName}`}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-slate-200"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                                {referee.user.firstName} {referee.user.lastName}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600 truncate">
                                {referee.user.professionalTitle || 'Professional'}
                              </p>

                              {/* Rating - Mobile: Below name, Desktop: Inline */}
                              <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-current" />
                                  <span className="text-xs sm:text-sm text-slate-600">4.5</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center space-x-1">
                                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                                  <span className="text-xs sm:text-sm text-slate-600">Available</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Select Button */}
                          <div className="flex-shrink-0 ml-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-slate-600 mb-2">
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
        <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span>Selected users will be notified via email</span>
            </div>

            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                onClick={handleCloseModal}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitRefer}
                disabled={selectedUsers.length === 0 || isSubmitting}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Refer {selectedUsers.length > 0 ? `(${selectedUsers.length})` : 'Now'}</span>
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
