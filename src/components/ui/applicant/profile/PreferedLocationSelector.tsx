import React, { useEffect, useState } from "react";
import { JobPreference } from "../../../../utils/types";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import { useCities } from "../../../../hooks/useCities.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";
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
  const {cities} = useCities();
  const {countries} = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    handleLocationSelect(selectedCountry, selectedCity);
  }, [selectedCountry, selectedCity, handleLocationSelect]);

  return (
    <div className="w-full">
      <label className="font-lato mb-2 block text-lg text-gray-700">
        Preferred Job Location
      </label>
      <div className="w-full rounded-[16px] border border-[#E6E6E6] bg-white p-4">
        <div className="mb-4 flex w-full flex-col gap-x-4 gap-y-3">
          <CustomDropdown
            className="w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] p-2 text-left"
            disabled={!isEditable}
            placeholder="Country"
            options={countries}
            handleSelect={(c) => {
              setSelectedCountry(c.value);
            }}
          />

          <CustomDropdown
            className="w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] p-2 text-left"
            disabled={!isEditable}
            placeholder="City"
            options={cities}
            handleSelect={(c) => {
              setSelectedCity(c.value);
            }}
          />
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
