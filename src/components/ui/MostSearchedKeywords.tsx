import React from "react";
import { capitalizeEachCase } from "../../utils/helpers.ts";

const colorClasses = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-teal-500",
];

const getRandomColor = () =>
  colorClasses[Math.floor(Math.random() * colorClasses.length)];

interface MostSearchedKeywordsProps {
  mostSearchedKeywords: string[];
}

const MostSearchedKeywords: React.FC<MostSearchedKeywordsProps> = ({
  mostSearchedKeywords,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-2 text-xs">
      {mostSearchedKeywords?.map((keyword, index) => (
        <p key={index} className={getRandomColor()}>
          {capitalizeEachCase(keyword)}
        </p>
      ))}
    </div>
  );
};

export default MostSearchedKeywords;
