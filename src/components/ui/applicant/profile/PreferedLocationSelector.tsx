import React, { useEffect, useState } from "react";
import { JobPreference } from "../../../../utils/types";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import { useCities } from "../../../../hooks/useCities.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";
import { X, MapPin } from "lucide-react";

interface LocationSelectorProp {
  preferences: JobPreference;
  handleLocationSelect: (country: string, city: string) => void;
  removeLocation: (index: number) => void;
  isEditable: boolean;
}

const PreferredLocationSelector: React.FC<LocationSelectorProp> = ({
                                                                     preferences,
                                                                     handleLocationSelect,
                                                                     removeLocation,
                                                                     isEditable,
                                                                   }: LocationSelectorProp) => {
  const { cities } = useCities();
  const { countries } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    if (selectedCountry && selectedCity) {
      handleLocationSelect(selectedCountry, selectedCity);
      // Reset selections after adding
      setSelectedCountry("");
      setSelectedCity("");
    }
  }, [selectedCountry, selectedCity, handleLocationSelect]);

  return (
    <div className="space-y-4">
      {/* Location Selection */}
      {isEditable && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CustomDropdown
            className="text-left w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
            disabled={!isEditable}
            placeholder="Select Country"
            options={countries}
            handleSelect={(c) => {
              setSelectedCountry(c.label);
            }}
          />

          <CustomDropdown
            className="text-left w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
            disabled={!isEditable}
            placeholder="Select City"
            options={cities}
            handleSelect={(c) => {
              setSelectedCity(c.value);
            }}
          />
        </div>
      )}

      {/* Selected Locations */}
      {preferences?.locations && preferences.locations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Preferred locations:</p>
          <div className="space-y-2">
            {preferences.locations.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {location.city}, {location.country}
                  </span>
                </div>
                <button
                  onClick={() => removeLocation(index)}
                  disabled={!isEditable}
                  className="p-1 text-green-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!preferences?.locations || preferences.locations.length === 0) && !isEditable && (
        <div className="text-center py-6 text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No preferred locations selected</p>
        </div>
      )}

      {/* Helper Text */}
      {isEditable && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600">
            💡 Select multiple locations where you're willing to work to increase your job opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreferredLocationSelector;