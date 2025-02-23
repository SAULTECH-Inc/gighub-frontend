// import { useState, useEffect, useMemo } from 'react';
//
// type FrequencyType = 'hour' | 'week' | 'month' | 'year';
//
// interface SalaryRangeProps {
//     label?: string;
//     baseMin?: number;
//     baseMax?: number;
//     currency?: string;
//     frequency?: FrequencyType;
//     onChange: (value: {
//         currency: string;
//         min: number;
//         max: number;
//         frequency: FrequencyType;
//     }) => void;
// }
//
// const frequencyMultipliers = {
//     hour: 1 / (40 * 52),
//     week: 1 / 52,
//     month: 1 / 12,
//     year: 1,
// };
//
// const exchangeRates = {
//     USD: 1,
//     EUR: 0.93,
//     GBP: 0.80,
//     JPY: 148.50,
//     CAD: 1.36,
//     AUD: 1.52,
// };
//
// const frequencyLabels = {
//     hour: 'per hour',
//     week: 'per week',
//     month: 'per month',
//     year: 'per year',
// } as const;
//
// const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;
//
// export default function SalaryRangeSelector({
//                                                 label = 'Salary Range',
//                                                 baseMin = 0,
//                                                 baseMax = 100000,
//                                                 currency = 'USD',
//                                                 frequency = 'year',
//                                                 onChange,
//                                             }: SalaryRangeProps) {
//     const [prevCurrency, setPrevCurrency] = useState(currency);
//     const [prevFrequency, setPrevFrequency] = useState(frequency);
//     const [minValue, setMinValue] = useState(baseMin);
//     const [maxValue, setMaxValue] = useState(baseMax);
//
//     const convertValue = useMemo(() =>
//             (value: number, newCurrency: string, newFrequency: FrequencyType) => {
//                 const rate = exchangeRates[newCurrency] / exchangeRates.USD;
//                 const freq = frequencyMultipliers[newFrequency];
//                 return value * rate * freq;
//             },
//         []
//     );
//
//     // Initialize converted values
//     useEffect(() => {
//         const convertedMin = convertValue(baseMin, currency, frequency);
//         const convertedMax = convertValue(baseMax, currency, frequency);
//         setMinValue(convertedMin);
//         setMaxValue(convertedMax);
//     }, [baseMin, baseMax, convertValue, currency, frequency]);
//
//     // Handle currency/frequency changes
//     useEffect(() => {
//         const convert = (value: number) =>
//             value *
//             (exchangeRates[currency] / exchangeRates[prevCurrency]) *
//             (frequencyMultipliers[frequency] / frequencyMultipliers[prevFrequency]);
//
//         const newMin = convert(minValue);
//         const newMax = convert(maxValue);
//
//         setMinValue(newMin);
//         setMaxValue(newMax);
//         setPrevCurrency(currency);
//         setPrevFrequency(frequency);
//     }, [currency, frequency, minValue, maxValue, prevCurrency, prevFrequency]);
//
//     // Current boundaries in selected currency/frequency
//     const currentMinBoundary = useMemo(
//         () => convertValue(baseMin, currency, frequency),
//         [baseMin, convertValue, currency, frequency]
//     );
//
//     const currentMaxBoundary = useMemo(
//         () => convertValue(baseMax, currency, frequency),
//         [baseMax, convertValue, currency, frequency]
//     );
//
//     const formattedMin = useMemo(
//         () => `${currency} ${Math.round(minValue).toLocaleString()}`,
//         [minValue, currency]
//     );
//
//     const formattedMax = useMemo(
//         () => `${currency} ${Math.round(maxValue).toLocaleString()}`,
//         [maxValue, currency]
//     );
//
//     const handleMinChange = (value: number) => {
//         const newValue = Math.min(value, maxValue);
//         setMinValue(Math.max(newValue, currentMinBoundary));
//     };
//
//     const handleMaxChange = (value: number) => {
//         const newValue = Math.max(value, minValue);
//         setMaxValue(Math.min(newValue, currentMaxBoundary));
//     };
//
//     useEffect(() => {
//         onChange({
//             currency,
//             min: Math.round(minValue),
//             max: Math.round(maxValue),
//             frequency,
//         });
//     }, [minValue, maxValue, currency, frequency, onChange]);
//
//     return (
//         <div className="p-5 border border-gray-300 rounded-lg max-w-md m-2.5">
//             {label && <label className="block font-medium mb-2">{label}</label>}
//
//             <div className="flex gap-2 mb-4">
//                 <select
//                     value={currency}
//                     onChange={(e) => setSelectedCurrency(e.target.value)}
//                     className="flex-1 p-2 border border-gray-300 rounded-md"
//                 >
//                     {currencies.map((curr) => (
//                         <option key={curr} value={curr}>{curr}</option>
//                     ))}
//                 </select>
//
//                 <select
//                     value={frequency}
//                     onChange={(e) => setSelectedFrequency(e.target.value as FrequencyType)}
//                     className="flex-1 p-2 border border-gray-300 rounded-md"
//                 >
//                     {Object.entries(frequencyLabels).map(([value, text]) => (
//                         <option key={value} value={value}>{text}</option>
//                     ))}
//                 </select>
//             </div>
//
//             <div className="space-y-4">
//                 <div className="space-y-2">
//                     <label className="block text-sm">
//                         Min: {formattedMin}
//                     </label>
//                     <input
//                         type="range"
//                         min={currentMinBoundary}
//                         max={currentMaxBoundary}
//                         value={minValue}
//                         onChange={(e) => handleMinChange(Number(e.target.value))}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                     />
//                 </div>
//
//                 <div className="space-y-2">
//                     <label className="block text-sm">
//                         Max: {formattedMax}
//                     </label>
//                     <input
//                         type="range"
//                         min={minValue}
//                         max={currentMaxBoundary}
//                         value={maxValue}
//                         onChange={(e) => handleMaxChange(Number(e.target.value))}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }