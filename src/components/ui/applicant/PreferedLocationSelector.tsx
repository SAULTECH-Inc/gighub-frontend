import React, {useState} from "react";
import {JobPreferences} from "./JobPreferences.tsx";
interface LocationSelectorProp{
    countryOptions: string[];
    cityOptions: string[];
    preferences: JobPreferences;
    handleLocationSelect: (country: string, city: string) => void;
    removeLocation: (index: number) => void;
}
const PreferredLocationSelector: React.FC<LocationSelectorProp> = ({
                                                                       countryOptions,
                                                                       cityOptions,
                                                                       preferences,
                                                                       handleLocationSelect,
                                                                       removeLocation,
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
            <label className="block text-lg font-lato text-gray-700 mb-2">
                Preferred Job Location
            </label>
            <div className="border border-gray-300 w-[432px] h-[247px] border-[#E6E6E6] rounded-[16px] bg-white p-4">
                <div className="flex space-x-4 mb-4">
                    <select
                        className="w-1/2 p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                        value={selectedCountry}
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
                        className="w-1/2 p-2 border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
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
                    {preferences.locations.map((location, index) => (
                        <div
                            key={index}
                            className="w-[168px] h-[38px] bg-[#56E5A1] text-white text-sm font-medium flex items-center justify-between px-4 rounded-[10px]"
                        >
                            <span>{location.country}/{location.city}</span>
                            <button
                                onClick={() => removeLocation(index)}
                                className="text-white font-bold text-lg"
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