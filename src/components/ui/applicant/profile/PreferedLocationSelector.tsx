import React, { useState } from "react";
import { JobPreference } from "../../../../utils/types";
interface LocationSelectorProp {
  countryOptions: string[];
  cityOptions: string[];
  preferences: JobPreference;
  handleLocationSelect: (country: string, city: string) => void;
  removeLocation: (index: number) => void;
  isEditable: boolean;
}
const PreferredLocationSelector: React.FC<LocationSelectorProp> = ({
  countryOptions,
  cityOptions,
  preferences,
  handleLocationSelect,
  removeLocation,
  isEditable,
}: LocationSelectorProp) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedCity(""); // Clear city if country is changed
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityValue = e.target.value;
    setSelectedCity(selectedCityValue);

    // Add location only when both country and city are selected
    if (selectedCountry && selectedCityValue) {
      handleLocationSelect(selectedCountry, selectedCityValue);
      setSelectedCountry(""); // Clear the country after adding
      setSelectedCity(""); // Clear the city after adding
    }
  };

  return (
    <div>
      <label className="mb-2 block font-lato text-lg text-gray-700">
        Preferred Job Location
      </label>
      <div className="w-full rounded-[16px] border border-[#E6E6E6] border-gray-300 bg-white p-4">
        <div className="mb-4 flex space-x-4">
          <select
            className="w-1/2 rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] p-2"
            value={selectedCountry}
            disabled={!isEditable}
            onChange={handleCountryChange}
          >
            <option value="" disabled>
              Country
            </option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            className="w-1/2 rounded-[10px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedCountry} // Disable city until a country is selected
          >
            <option value="" disabled>
              City
            </option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {preferences?.locations?.map((location, index) => (
            <div
              key={index}
              className="flex h-[38px] w-[168px] items-center justify-between rounded-[10px] bg-[#56E5A1] px-4 text-sm font-medium text-white"
            >
              <span>
                {location.country}/{location.city}
              </span>
              <button
                onClick={() => removeLocation(index)}
                disabled={!isEditable}
                className="text-lg font-bold text-white"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PreferredLocationSelector;
