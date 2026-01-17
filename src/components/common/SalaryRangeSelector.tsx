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
                                              label,
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
      currency: selectedCurrencySymbol,
      min: Math.round(minValue),
      max: Math.round(maxValue),
      frequency: selectedFrequency,
    });

    return () => onChangeDebounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrencySymbol, selectedFrequency, minValue, maxValue]);

  return (
    <div className="space-y-4">
      {label && <h3 className="text-sm font-semibold text-gray-900">{label}</h3>}

      {/* Currency and Frequency Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <CustomSelect
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
          options={currencies}
          placeholder="NGN"
          onChange={(v) => setSelectedCurrencySymbol(v.value)}
        />

        <CustomSelect
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
          options={Freq}
          placeholder="Monthly"
          onChange={(v) => setSelectedFrequency(v.value)}
        />
      </div>

      {/* Range Display */}
      <div className="rounded-lg bg-purple-50 p-3">
        <p className="text-xs font-medium text-purple-900">
          {selectedCurrencySymbol} {Math.round(minValue).toLocaleString()} -{" "}
          {selectedCurrencySymbol} {Math.round(maxValue).toLocaleString()}{" "}
          <span className="text-purple-700">{frequencyLabels[selectedFrequency]}</span>
        </p>
      </div>

      {/* Min and Max Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Minimum
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">
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
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              step="100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Maximum
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">
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
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              step="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}