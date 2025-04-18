import React, {useEffect, useState} from "react";
import NetworkConnectionsCard from "./NetworkConnectionsCard.tsx";
import {NetworkHeader} from "./NetworkHeader.tsx";
import UserCard from "./UserCard.tsx";
import {useUsers} from "../../hooks/useUsers.ts";
import {useConnectionRequest} from "../../hooks/useConnectionRequest.ts";
import {ApplicantData} from "../../utils/types";
import {useSearchUsers} from "../../hooks/useSearchUsers.ts";

export const FindConnections: React.FC = () => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        location: '',
        profession: '',
    });

    const [page] = useState(1);
    const limit = 10;

    const { data: baseUsers, isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useUsers(page, limit);
    const { data: connectionRequests, isLoading: isLoadingConnections, isError: isErrorConnections, error: errorConnections } =
        useConnectionRequest(page, limit);
    const {
        data: searchResults,
        isLoading: isLoadingSearch,
        isError: isErrorSearch,
        error: errorSearch,
    } = useSearchUsers(page, limit, searchParams);

    const [users, setUsers] = useState<ApplicantData[]>([]);

    // Update users from search or default users
    useEffect(() => {
        if (
            searchParams.name ||
            searchParams.location ||
            searchParams.profession
        ) {
            if (searchResults?.data) setUsers(searchResults.data);
        } else if (baseUsers?.data) {
            setUsers(baseUsers.data);
        }
    }, [searchParams, searchResults, baseUsers]);

    // Search handlers
    const handleSearchChange = (field: keyof typeof searchParams, value: string) => {
        setSearchParams((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Combined loading & error states
    if (isLoadingUsers || isLoadingSearch || isLoadingConnections) {
        return <p>Loading...</p>;
    }
    if (isErrorUsers || isErrorSearch || isErrorConnections) {
        return (
            <p>
                Error:{' '}
                {(errorUsers || errorSearch || errorConnections)?.message ||
                    'An unknown error occurred.'}
            </p>
        );
    }

    if (users.length === 0) {
        return <p>No users found.</p>;
    }

    return (
        <>
            <NetworkHeader
                handleSearchByName={(name) => handleSearchChange('name', name)}
                handleSearchByLocation={(location) => handleSearchChange('location', location)}
                handleSearchByProfession={(profession) => handleSearchChange('profession', profession)}
            />
            <div className="w-full mx-auto flex flex-col justify-center md:flex-row md:flex-row-reverse gap-4 p-4">
                {/* Sidebar */}
                {connectionRequests?.data && connectionRequests.data?.length > 0 && (
                    <div className="flex flex-col">
                        <h2 className="font-semibold text-lg">Connection Requests</h2>
                        <div className="w-full flex overflow-auto md:flex-col gap-4 p-6">
                            {connectionRequests.data.map((user) => (
                                <NetworkConnectionsCard userDetails={user} key={user.id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="w-full flex flex-wrap justify-evenly gap-4 overflow-auto">
                    {users.map((user) => (
                        <UserCard userDetails={user} key={user.id} />
                    ))}
                </div>
            </div>
        </>
    );
};
