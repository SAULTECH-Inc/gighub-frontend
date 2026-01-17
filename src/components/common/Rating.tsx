import { FC, useState } from "react";
import ratingIcon from "../../assets/icons/ratingStar.svg";

export interface RatingProp {
  value: number; // Current rating to display
  rate?: (value: number) => void; // Optional callback for interactive rating
  readOnly?: boolean; // If true, disables hover/click interactions
}

const Rating: FC<RatingProp> = ({ value, rate, readOnly = false }) => {
  const MAX_RATING = 5;
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div
      className={`flex items-center gap-1 ${readOnly ? "" : "cursor-pointer"}`}
      onMouseLeave={() => !readOnly && setHoverValue(null)}
    >
      {Array.from({ length: MAX_RATING }, (_, index) => {
        const ratingIndex = index + 1;
        const isHighlighted =
          hoverValue !== null && !readOnly
            ? ratingIndex <= hoverValue
            : ratingIndex <= value;

        return (
          <img
            key={index}
            src={ratingIcon}
            alt={`star-${ratingIndex}`}
            className="h-[17px] w-[17px] transition-opacity duration-150 md:h-[20px] md:w-[20px]"
            style={{
              opacity: isHighlighted ? 1 : 0.3,
            }}
            onMouseEnter={() => !readOnly && setHoverValue(ratingIndex)}
            onClick={() => !readOnly && rate && rate(ratingIndex)}
          />
        );
      })}
    </div>
  );
};

export default Rating;
