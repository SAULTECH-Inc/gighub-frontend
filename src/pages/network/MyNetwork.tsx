import React, {useMemo, useState} from "react";
import NetworkCard from "./NetworkCard.tsx";
import {NetworkHeader} from "./NetworkHeader.tsx";
import {useUsers} from "../../hooks/useUsers.ts";

const ITEMS_PER_PAGE = 10;

const MyNetwork: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError, error } = useUsers(currentPage, ITEMS_PER_PAGE);

    const userDetails = data?.data || [];
    const totalUsers = userDetails.length || 0;
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    const currentData = useMemo(() => {
        return userDetails;
    }, [userDetails]);

    if (isLoading) {
        return <p className="text-center py-10">Loading users...</p>;
    }

    if (isError) {
        return <p className="text-center py-10 text-red-500">Error: {(error as Error).message}</p>;
    }

    return (
        <div className="w-full flex flex-col mx-auto gap-4 p-4">
            {/* Header */}
            <NetworkHeader />

            {/* Main Content Area */}
            <div className="w-full flex flex-wrap justify-evenly gap-4">
                {currentData.map((user, index) => (
                    <NetworkCard userDetails={user} key={index} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
                    <button
                        className="px-3 py-1 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-md border text-sm ${
                                currentPage === page
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "text-gray-700 hover:bg-gray-100 border-gray-300"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyNetwork;
