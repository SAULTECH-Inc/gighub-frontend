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
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {activeTab === "find-new-connections"
            ? "Discover New Connections"
            : "Your Professional Network"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {activeTab === "find-new-connections"
            ? "Connect with professionals in your field and expand your network"
            : "Stay in touch with your connections and grow together"}
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name..."
                onKeyUp={(e) => handleSearchByName(e.currentTarget.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors duration-200 border border-purple-200"
          >
            <Filter size={20} />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Filter by profession..."
                  onChange={(e) => handleSearchByProfession(e.currentTarget.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  onChange={(e) => handleSearchByLocation(e.currentTarget.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};