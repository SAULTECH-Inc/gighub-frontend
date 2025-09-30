import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import CustomSelect from "./CustomSelect.tsx";
import { Option } from "../../utils/types";
import { currencies } from "../../utils/constants.ts";

interface SalaryRangeProps {
  label?: string;
  baseMin?: number;
  baseMax?: number;
  currency?: string;
  frequency?: string;
  onChange: (value: {
    currency: string;
    min: number;
    max: number;
    frequency: string;
  }) => void;
}

const frequencyLabels: Record<string, string> = {
  hour: "per hour",
  week: "per week",
  month: "per month",
  year: "per year",
};

const Freq: Option[] = [
  { label: "per hour", value: "hour" },
  { label: "per week", value: "week" },
  { label: "per month", value: "month" },
  { label: "per year", value: "year" },
];

export default function SalaryRangeSelector({
  label = "Salary Range",
  baseMin = 0,
  baseMax = 0,
  currency = "NGN",
  frequency = "month",
  onChange,
}: SalaryRangeProps) {
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>(
    () => {
      const found = currencies.find((c) => c.label === currency);
      return found?.value || "$";
    },
  );

  const [selectedFrequency, setSelectedFrequency] = useState<string>(frequency);
  const [minValue, setMinValue] = useState<number>(baseMin);
  const [maxValue, setMaxValue] = useState<number>(baseMax);

  const onChangeDebounced = useMemo(() => debounce(onChange, 300), [onChange]);

  useEffect(() => {
    onChangeDebounced({
      currency: selectedCurrencySymbol, // symbol, not abbreviation
      min: Math.round(minValue),
      max: Math.round(maxValue),
      frequency: selectedFrequency,
    });

    return () => onChangeDebounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrencySymbol, selectedFrequency, minValue, maxValue]);

  return (
    <div className="my-4 max-w-md rounded-xl bg-white">
      {label && <h3 className="mb-4">{label}</h3>}

      <div className="mb-4 flex gap-3">
        <CustomSelect
          className="w-1/2 rounded-lg border border-[#E6E6E6] bg-white p-2 text-sm focus:outline-none"
          options={currencies}
          placeholder="NGN"
          onChange={(v) => setSelectedCurrencySymbol(v.value)}
        />

        <CustomSelect
          className="w-1/2 rounded-lg border border-[#E6E6E6] bg-white p-2 text-sm focus:outline-none"
          options={Freq}
          placeholder="Monthly"
          onChange={(v) => setSelectedFrequency(v.value)}
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-600">
          <span className="mr-2">Range:</span>
          <span className="font-bold text-gray-800">
            {selectedCurrencySymbol} {Math.round(minValue).toLocaleString()} -{" "}
            {selectedCurrencySymbol} {Math.round(maxValue).toLocaleString()}{" "}
            {frequencyLabels[selectedFrequency]}
          </span>
        </label>

        <div className="mt-2 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-600">Minimum</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                {selectedCurrencySymbol}
              </span>
              <input
                type="number"
                min={0}
                value={Math.round(minValue)}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const clamped = Math.max(0, Math.min(value, maxValue));
                  setMinValue(clamped);
                }}
                className="w-full rounded-lg border border-[#E6E6E6] py-2 pr-3 pl-8 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                step="100"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-600">Maximum</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                {selectedCurrencySymbol}
              </span>
              <input
                type="number"
                min={minValue}
                value={Math.round(maxValue)}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const clamped = Math.max(minValue, value);
                  setMaxValue(clamped);
                }}
                className="w-full rounded-lg border border-[#E6E6E6] py-2 pr-3 pl-8 focus:border-transparent focus:ring-2 focus:ring-purple-300"
                step="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
