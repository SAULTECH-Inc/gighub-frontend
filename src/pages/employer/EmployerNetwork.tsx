import React, { memo, useEffect, useState } from "react";
import { useAuth } from "../../store/useAuth.ts";
import ChatWindow from "../../chat-module/component/ChatWindow.tsx";
import { NetworkDetails } from "../../utils/types";
import { searchMyConnection } from "../../services/api";
import { NetworkHeader } from "../network/NetworkHeader.tsx";
import UserCard from "../network/UserCard.tsx";
import useGetMyConnections from "../../hooks/useGetMyConnections.ts";

const ITEMS_PER_PAGE = 10;

export const EmployerNetwork: React.FC = () => {
  const { employer } = useAuth();
  const [isChatWindowOpened, setIsChatWindowOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    name: "",
    location: "",
    profession: "",
  });

  const { data, isError } = useGetMyConnections(
    employer?.id as number,
    currentPage,
    ITEMS_PER_PAGE,
  );
  const [connections, setConnections] = useState<NetworkDetails[]>([]);

  // Initialize connections when data is loaded
  useEffect(() => {
    if (data?.data) {
      setConnections(data.data);
    }
  }, [data]);

  // Unified search handler
  const handleSearchChange = async (
    field: keyof typeof searchParams,
    value: string,
  ) => {
    const updatedParams = {
      ...searchParams,
      [field]: value,
    };
    setSearchParams(updatedParams);

    const response = await searchMyConnection(updatedParams);
    if (response?.statusCode === 200) {
      setConnections(response.data);
    } else {
      console.error("Failed to search connections", response?.data);
      setConnections([]); // Clear on failure
    }
  };

  // if (isLoading) {
  //   return <ClockSpinner isLoading={isLoading} />;
  // }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-row items-center justify-center">
        <p className="py-10 text-center text-red-500">No connections</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4 p-4">
      {/* Header */}
      <NetworkHeader
        handleSearchByName={(name) => handleSearchChange("name", name)}
        handleSearchByLocation={(location) =>
          handleSearchChange("location", location)
        }
        handleSearchByProfession={(profession) =>
          handleSearchChange("profession", profession)
        }
      />

      {/* Main Content Area */}
      <div className="flex w-auto flex-wrap gap-4 rounded-[16px] bg-white p-4">
        {connections.length > 0 ? (
          connections.map((user) => (
            <UserCard
              setChatWindowOpened={setIsChatWindowOpened}
              userDetails={user}
              key={user.id}
            />
          ))
        ) : (
          <p className="w-full text-center">No matching connections found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-md bg-gray-300 px-4 py-2"
        >
          Previous
        </button>
        <span className="mx-2">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={connections.length < ITEMS_PER_PAGE}
          className="rounded-md bg-gray-300 px-4 py-2"
        >
          Next
        </button>
      </div>

      {/* Chat Window */}
      {isChatWindowOpened && <ChatWindow />}
    </div>
  );
};

export default memo(EmployerNetwork);
