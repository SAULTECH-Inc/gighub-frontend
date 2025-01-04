import {ButtonProps} from "../../services/types";
import {FC} from "react";

const Button: FC<ButtonProps> = ({
                                     label,
                                     variant = 'primary',
                                     className = '',
                                     ...props
                                 }) => {
    const baseClasses =
        'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

    let variantClasses = '';
    switch (variant) {
        case 'primary':
            variantClasses = 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
            break;
        case 'secondary':
            variantClasses = 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500';
            break;
        case 'danger':
            variantClasses = 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500';
            break;
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {label}
        </button>
    );
};

export default Button;