import React, { memo, useEffect, useState } from "react";
import { Users, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { NetworkHeader } from "./NetworkHeader.tsx";
import { useAuth } from "../../store/useAuth.ts";
import ChatWindow from "../../chat-module/component/ChatWindow.tsx";
import { NetworkDetails } from "../../utils/types";
import { searchMyConnection } from "../../services/api";
import UserCard from "./UserCard.tsx";
import useGetMyConnections from "../../hooks/useGetMyConnections.ts";

const ITEMS_PER_PAGE = 12;

const MyNetwork: React.FC = () => {
  const { applicant, employer } = useAuth();
  const [isChatWindowOpened, setIsChatWindowOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    name: "",
    location: "",
    profession: "",
  });

  const { data, isError } = useGetMyConnections(
    applicant.id || (employer?.id as number),
    currentPage,
    ITEMS_PER_PAGE,
  );
  const [connections, setConnections] = useState<NetworkDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setConnections(data.data);
    }
  }, [data]);

  const handleSearchChange = async (
    field: keyof typeof searchParams,
    value: string,
  ) => {
    const updatedParams = {
      ...searchParams,
      [field]: value,
    };
    setSearchParams(updatedParams);

    setIsSearching(true);
    try {
      const response = await searchMyConnection(updatedParams);
      if (response?.statusCode === 200) {
        setConnections(response.data);
      } else {
        console.error("Failed to search connections", response?.data);
        setConnections([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setConnections([]);
    } finally {
      setIsSearching(false);
    }
  };

  const totalPages = Math.ceil((data?.meta?.total || 0) / ITEMS_PER_PAGE);
  const hasNextPage =
    connections.length === ITEMS_PER_PAGE && currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (isError) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No connections yet
          </h3>
          <p className="text-gray-600">
            Start building your network by finding new connections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NetworkHeader
        handleSearchByName={(name) => handleSearchChange("name", name)}
        handleSearchByLocation={(location) =>
          handleSearchChange("location", location)
        }
        handleSearchByProfession={(profession) =>
          handleSearchChange("profession", profession)
        }
      />

      {/* Stats Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="text-purple-600" size={20} />
              <span className="text-lg font-semibold text-gray-900">
                {data?.meta?.total || connections.length} Connections
              </span>
            </div>
            {isSearching && (
              <div className="flex items-center space-x-2 text-purple-600">
                <Search className="animate-pulse" size={16} />
                <span className="text-sm">Searching...</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {Math.max(1, totalPages)}
          </div>
        </div>
      </div>

      {/* Connections Grid */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {connections.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {connections.map((user) => (
              <UserCard
                setChatWindowOpened={setIsChatWindowOpened}
                userDetails={user}
                key={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {isSearching ? "Searching..." : "No connections found"}
            </h3>
            <p className="text-gray-600">
              {isSearching
                ? "Please wait..."
                : "Try adjusting your search filters."}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!hasPrevPage}
            className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-purple-600 text-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasNextPage}
            className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isChatWindowOpened && <ChatWindow />}
    </div>
  );
};

export default memo(MyNetwork);
