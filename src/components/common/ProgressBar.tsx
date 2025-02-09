import {ProgressBarProps} from "../../utils/types";
import {FC} from "react";

const ProgressBar: FC<ProgressBarProps> = ({
                                               value,
                                               className = '',
                                               color = 'bg-blue-600',
                                           }) => {
    const clampValue = Math.max(0, Math.min(value, 100));

    return (
        <div className={`w-full bg-gray-200 rounded h-4 ${className}`}>
            <div
                className={`${color} h-4 rounded`}
                style={{ width: `${clampValue}%` }}
            />
        </div>
    );
};

export default ProgressBar;