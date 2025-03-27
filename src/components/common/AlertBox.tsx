import React, { useEffect, useState } from "react";
import {
    XCircle,
    Info,
    CheckCircle,
    TriangleAlert,
    X,
} from "lucide-react";

type AlertType = "error" | "warning" | "success" | "info";
type Position =
    | "auto"
    | "center"
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

interface AlertBoxProps {
    type?: AlertType;
    message: string;
    description?: string;
    autoClose?: boolean;
    position?: Position;
    className?: string;
    duration?: number; // in ms
    onClose?: () => void;
}

const alertStyles: Record<
    AlertType,
    {
        icon: JSX.Element;
        bg: string;
        text: string;
        border: string;
    }
> = {
    error: {
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        bg: "bg-red-100",
        text: "text-red-900",
        border: "border-red-300",
    },
    warning: {
        icon: <TriangleAlert className="w-6 h-6 text-yellow-600" />,
        bg: "bg-yellow-100",
        text: "text-yellow-900",
        border: "border-yellow-300",
    },
    success: {
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        bg: "bg-green-100",
        text: "text-green-900",
        border: "border-green-400",
    },
    info: {
        icon: <Info className="w-6 h-6 text-blue-600" />,
        bg: "bg-blue-100",
        text: "text-blue-900",
        border: "border-blue-300",
    },
};

const positionStyles: Record<Exclude<Position, "auto">, string> = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const getAutoPosition = (): string => {
    if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
            return positionStyles["bottom-center"];
        } else {
            return positionStyles["top-right"];
        }
    }
    return positionStyles["top-right"];
};

const AlertBox: React.FC<AlertBoxProps> = ({
                                               type = "info",
                                               message,
                                               description,
                                               autoClose = false,
                                               duration = 4000,
                                               position = "top-right",
                                               className = "",
                                               onClose,
                                           }) => {
    const [visible, setVisible] = useState(true);
    const [responsivePosition, setResponsivePosition] = useState<string>("");

    // Show again if message changes
    useEffect(() => {
        setVisible(true);
    }, [message]);

    // Determine position
    useEffect(() => {
        if (position === "auto") {
            setResponsivePosition(getAutoPosition());
        }
    }, [position]);

    // Auto dismiss
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (autoClose) {
            timer = setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, duration);
        }
        return () => clearTimeout(timer);
    }, [autoClose, duration, onClose]);

    if (!visible) return null;

    const { icon, bg, text, border } = alertStyles[type];
    const pos = position === "auto" ? responsivePosition : positionStyles[position];

    return (
        <div
            className={`fixed z-[9999] ${pos} ${bg} ${text} ${border} border rounded-2xl shadow-2xl 
        p-4 w-full max-w-xs flex items-start space-x-3 
        transition-all duration-300 ease-in-out ${className}`}
        >
            <div className="pt-1">{icon}</div>
            <div className="flex-1 break-words whitespace-pre-wrap">
                <div className="font-semibold text-lg">{message}</div>
                {description && <div className="text-sm mt-1">{description}</div>}
            </div>
            <button
                className="absolute top-2 right-2 hover:bg-gray-300 p-1 rounded-full"
                onClick={() => {
                    setVisible(false);
                    onClose?.();
                }}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default AlertBox;
