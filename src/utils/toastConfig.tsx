import { toast, ToastOptions } from "react-toastify";
import {
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiInformationLine,
  RiAlertLine,
} from "react-icons/ri";
import React from "react";

// Shared base style
const baseStyle: React.CSSProperties = {
  borderRadius: "10px",
  background: "#FFFFFF",
  color: "#6438C2",
  border: "1px solid #D1C4E9",
  padding: "16px 24px",
  fontSize: "15px",
  fontWeight: 500,
  lineHeight: "1.4",
  boxShadow: "0 4px 12px rgba(126, 87, 194, 0.15)",
};

// Shared duration
const baseOptions: ToastOptions = {
  style: baseStyle,
  hideProgressBar: true,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  autoClose: 4000,
};

export const showSuccessToast = (message: string) =>
  toast.success(message, {
    ...baseOptions,
    icon: <RiCheckboxCircleLine size={22} color="#2E7D32" />,
  });

export const showErrorToast = (message: string) =>
  toast.error(message, {
    ...baseOptions,
    icon: <RiErrorWarningLine size={22} color="#E65100" />,
  });

export const showInfoToast = (message: string) =>
  toast.info(message, {
    ...baseOptions,
    icon: <RiInformationLine size={22} color="#0288D1" />,
  });

export const showWarningToast = (message: string) =>
  toast.warning(message, {
    ...baseOptions,
    icon: <RiAlertLine size={22} color="#F9A825" />,
  });
