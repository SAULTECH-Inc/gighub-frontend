import {useState, useEffect, useMemo, useRef} from "react";

export type FrequencyType = "hour" | "week" | "month" | "year";
export type CurrencyType = keyof typeof exchangeRates;

interface SalaryRangeProps {
    label?: string;
    baseMin?: number;
    baseMax?: number;
    currency?: CurrencyType;
    frequency?: FrequencyType;
    onChange: (value: {
        currency: CurrencyType;
        min: number;
        max: number;
        frequency: FrequencyType;
    }) => void;
}

const frequencyMultipliers = {
    hour: 1 / (40 * 52),
    week: 1 / 52,
    month: 1 / 12,
    year: 1,
};

const exchangeRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.8,
    JPY: 148.5,
    CAD: 1.36,
    AUD: 1.52,
};

const frequencyLabels = {
    hour: "per hour",
    week: "per week",
    month: "per month",
    year: "per year",
} as const;

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"] as const;

export default function SalaryRangeSelector({
                                                label = "Salary Range",
                                                baseMin = 0,
                                                baseMax = 100000,
                                                currency = "USD",
                                                frequency = "year",
                                                onChange,
                                            }: SalaryRangeProps) {
    const [selectedCurrency, setSelectedCurrency] =
        useState<CurrencyType>(currency);
    const [selectedFrequency, setSelectedFrequency] =
        useState<FrequencyType>(frequency);
    const [prevCurrency, setPrevCurrency] = useState(currency);
    const [prevFrequency, setPrevFrequency] = useState(frequency);
    const [minValue, setMinValue] = useState(baseMin);
    const [maxValue, setMaxValue] = useState(baseMax);

    const convertValue = useMemo(
        () =>
            (value: number, newCurrency: CurrencyType, newFrequency: FrequencyType) => {
                const rate = exchangeRates[newCurrency] / exchangeRates.USD;
                const freq = frequencyMultipliers[newFrequency];
                return value * rate * freq;
            },
        []
    );

    useEffect(() => {
        setMinValue(convertValue(baseMin, selectedCurrency, selectedFrequency));
        setMaxValue(convertValue(baseMax, selectedCurrency, selectedFrequency));
    }, [baseMin, baseMax, convertValue, selectedCurrency, selectedFrequency]);

    useEffect(() => {
        const convert = (value: number) =>
            value *
            (exchangeRates[selectedCurrency] / exchangeRates[prevCurrency]) *
            (frequencyMultipliers[selectedFrequency] /
                frequencyMultipliers[prevFrequency]);

        setMinValue(convert(minValue));
        setMaxValue(convert(maxValue));
        setPrevCurrency(selectedCurrency);
        setPrevFrequency(selectedFrequency);
    }, [selectedCurrency, selectedFrequency]);

    const lastSubmitted = useRef<{
        currency: CurrencyType;
        frequency: FrequencyType;
        min: number;
        max: number;
    }>();

    useEffect(() => {
        const newValue = {
            currency: selectedCurrency,
            frequency: selectedFrequency,
            min: Math.round(minValue),
            max: Math.round(maxValue),
        };

        const prev = lastSubmitted.current;
        const hasChanged =
            !prev ||
            prev.currency !== newValue.currency ||
            prev.frequency !== newValue.frequency ||
            prev.min !== newValue.min ||
            prev.max !== newValue.max;

        if (hasChanged) {
            lastSubmitted.current = newValue;
            onChange(newValue);
        }
    }, [minValue, maxValue, selectedCurrency, selectedFrequency, onChange]);

    return (
        <div className="rounded-xl bg-white max-w-md my-4">
            {label && (
                <h3 className="mb-4">{label}</h3>
            )}
            <div className="flex gap-3 mb-4">

                <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value as CurrencyType)}
                    className="w-1/2 p-2 border border-[#E6E6E6] focus:right-0 focus:border-[1px] focus:border-[#E6E6E6] rounded-lg text-sm bg-white focus:outline-none"
                >
                    {currencies.map((curr) => (
                        <option key={curr} value={curr}>
                            {curr}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedFrequency}
                    onChange={(e) => setSelectedFrequency(e.target.value as FrequencyType)}
                    className="w-1/2 p-2 border border-[#E6E6E6] focus:right-0 focus:border-[1px] focus:border-[#E6E6E6] rounded-lg text-sm bg-white focus:outline-none"
                >
                    {Object.entries(frequencyLabels).map(([value, text]) => (
                        <option key={value} value={value}>
                            {text}
                        </option>
                    ))}
                </select>
            </div>

            {/* Salary Range */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                    <span className="mr-2">Range:</span>
                    <span className="font-bold text-gray-800">
                        {selectedCurrency} {Math.round(minValue).toLocaleString()} -{" "}
                        {Math.round(maxValue).toLocaleString()} {frequencyLabels[selectedFrequency]}
                    </span>
                </label>
                <div className="relative mt-2">
                    {/* Min Salary Slider */}
                    <input
                        type="range"
                        min={convertValue(baseMin, selectedCurrency, selectedFrequency)}
                        max={convertValue(baseMax, selectedCurrency, selectedFrequency)}
                        value={minValue}
                        onChange={(e) => setMinValue(Number(e.target.value))}
                        className="w-full h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer transition-all duration-300"
                    />

                    {/* Max Salary Slider */}
                    <input
                        type="range"
                        min={minValue}
                        max={convertValue(baseMax, selectedCurrency, selectedFrequency)}
                        value={maxValue}
                        onChange={(e) => setMaxValue(Number(e.target.value))}
                        className="w-full h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer transition-all duration-300"
                    />
                </div>
            </div>
        </div>
    );
}
