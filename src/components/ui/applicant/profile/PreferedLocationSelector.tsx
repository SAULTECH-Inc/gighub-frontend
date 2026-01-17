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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <CustomDropdown
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
            disabled={!isEditable}
            placeholder="Select Country"
            options={countries}
            handleSelect={(c) => {
              setSelectedCountry(c.label);
            }}
          />

          <CustomDropdown
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
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
                className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {location.city}, {location.country}
                  </span>
                </div>
                <button
                  onClick={() => removeLocation(index)}
                  disabled={!isEditable}
                  className="p-1 text-green-600 transition-colors duration-200 hover:text-red-600 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!preferences?.locations || preferences.locations.length === 0) &&
        !isEditable && (
          <div className="py-6 text-center text-gray-500">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm">No preferred locations selected</p>
          </div>
        )}

      {/* Helper Text */}
      {isEditable && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-600">
            💡 Select multiple locations where you're willing to work to
            increase your job opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreferredLocationSelector;
