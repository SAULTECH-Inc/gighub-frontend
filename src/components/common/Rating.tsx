import { FC } from "react";
import ratingIcon from "../../assets/icons/ratingStar.svg"; // Path to your star icon

export interface RatingProp {
    value: number; // Rating value
}

const Rating: FC<RatingProp> = ({ value }) => {
    // Ensure the rating is within bounds (e.g., 0 to 5)
    const MAX_RATING = 5;

    return (
        <div className="cursor-pointer" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {Array.from({ length: MAX_RATING }, (_, index) => (
                <img
                    key={index}
                    src={ratingIcon}
                    alt={`star-${index + 1}`}
                    style={{
                        width: "20px",
                        height: "20px",
                        opacity: index < value ? 1 : 0.3, // Highlight based on value
                    }}
                />
            ))}
        </div>
    );
};

export default Rating;
