import React, { useState } from "react";
import { Search, Filter, MapPin, Briefcase } from "lucide-react";
import { useNetworkTab } from "../../store/useNetworkTab.ts";

interface NetworkHeaderProps {
  handleSearchByName: (name: string) => void;
  handleSearchByProfession: (profession: string) => void;
  handleSearchByLocation: (location: string) => void;
}

export const NetworkHeader: React.FC<NetworkHeaderProps> = ({
  handleSearchByName,
  handleSearchByProfession,
  handleSearchByLocation,
}) => {
  const { activeTab } = useNetworkTab();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      {/* Title Section */}
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {activeTab === "find-new-connections"
            ? "Discover New Connections"
            : "Your Professional Network"}
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          {activeTab === "find-new-connections"
            ? "Connect with professionals in your field and expand your network"
            : "Stay in touch with your connections and grow together"}
        </p>
      </div>

      {/* Search Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Main Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name..."
                onKeyUp={(e) => handleSearchByName(e.currentTarget.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all duration-200 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 rounded-xl border border-purple-200 bg-purple-50 px-6 py-3 text-purple-600 transition-colors duration-200 hover:bg-purple-100"
          >
            <Filter size={20} />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <Briefcase
                  className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Filter by profession..."
                  onChange={(e) =>
                    handleSearchByProfession(e.currentTarget.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all duration-200 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <MapPin
                  className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  onChange={(e) =>
                    handleSearchByLocation(e.currentTarget.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all duration-200 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
