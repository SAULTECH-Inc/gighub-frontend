import React, { memo, useEffect, useState } from "react";
import NetworkConnectionsCard from "./NetworkConnectionsCard.tsx";
import { NetworkHeader } from "./NetworkHeader.tsx";
import UserCard from "./UserCard.tsx";
import { useUsers } from "../../hooks/useUsers.ts";
import { NetworkDetails } from "../../utils/types";
import { useSearchUserConnections } from "../../hooks/useSearchUserConnections.ts";
import { useConnectionRequest } from "../../hooks/useConnectionRequest.ts";
import { useAuth } from "../../store/useAuth.ts";
import ChatWindow from "../../chat-module/component/ChatWindow.tsx";

const FindConnections: React.FC = () => {
  const [isChatWindowOpened, setIsChatWindowOpened] = useState(false);
  const { applicant, employer } = useAuth();
  const [searchParams, setSearchParams] = useState({
    name: "",
    location: "",
    profession: "",
  });

  const [page] = useState(1);
  const limit = 10;

  const {
    data: baseUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useUsers(applicant.id || employer?.id as number, page, limit);
  const {
    data: connectionRequests,
    isError: isErrorConnections,
    error: errorConnections,
  } = useConnectionRequest(page, limit);
  const {
    data: searchResults,
    isError: isErrorSearch,
    error: errorSearch,
  } = useSearchUserConnections(page, limit, searchParams);

  const [users, setUsers] = useState<NetworkDetails[]>([]);

  // Update users from search or default users
  useEffect(() => {
    if (searchParams.name || searchParams.location || searchParams.profession) {
      if (searchResults?.data) setUsers(searchResults.data);
    } else if (baseUsers?.data) {
      setUsers(baseUsers.data);
    }
  }, [searchParams, searchResults, baseUsers]);

  // Search handlers
  const handleSearchChange = (
    field: keyof typeof searchParams,
    value: string,
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Combined loading & error states
  // if (isLoadingUsers || isLoadingSearch || isLoadingConnections) {
  //   return (
  //     <ClockSpinner
  //       isLoading={isLoadingUsers || isLoadingSearch || isLoadingConnections}
  //     />
  //   );
  // }
  if (isErrorUsers || isErrorSearch || isErrorConnections) {
    return (
      <p>
        Error:{" "}
        {(errorUsers || errorSearch || errorConnections)?.message ||
          "An unknown error occurred."}
      </p>
    );
  }

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <>
      <NetworkHeader
        handleSearchByName={(name) => handleSearchChange("name", name)}
        handleSearchByLocation={(location) =>
          handleSearchChange("location", location)
        }
        handleSearchByProfession={(profession) =>
          handleSearchChange("profession", profession)
        }
      />
      <div className="mx-auto flex w-full flex-col justify-center gap-4 p-4 md:flex-row-reverse">
        {/* Sidebar */}
        {connectionRequests?.data && connectionRequests.data?.length > 0 && (
          <div className="flex flex-col rounded-[16px] p-4">
            <h2 className="text-lg font-semibold">Connection Requests</h2>
            <div className="flex w-full gap-4 overflow-auto p-6 md:flex-col">
              {connectionRequests.data.map((user, index) => (
                <NetworkConnectionsCard userDetails={user} key={index} />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex w-auto max-w-full flex-wrap gap-4 overflow-auto rounded-[16px] bg-white p-4">
          {users.map((user, key) => (
            <UserCard
              setChatWindowOpened={setIsChatWindowOpened}
              userDetails={user}
              key={key}
            />
          ))}
        </div>
        {/* Chat Window */}
        {isChatWindowOpened && <ChatWindow />}
      </div>
    </>
  );
};

export default memo(FindConnections);
