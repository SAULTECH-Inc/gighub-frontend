import React from "react";
import { AlertTriangle, X, Trash2, AlertCircle, Info } from "lucide-react";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
  requiresTyping?: boolean;
  confirmationText?: string;
  icon?: React.ReactNode;
}
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
  requiresTyping = false,
  confirmationText = "DELETE",
  icon,
}) => {
  const [typedConfirmation, setTypedConfirmation] = React.useState("");

  // Reset typed confirmation when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setTypedConfirmation("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (requiresTyping && typedConfirmation !== confirmationText) {
      return;
    }
    onConfirm();
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing during loading
    setTypedConfirmation("");
    onClose();
  };

  const isConfirmDisabled =
    loading || (requiresTyping && typedConfirmation !== confirmationText);

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          defaultIcon: <Trash2 className="h-6 w-6" />,
        };
      case "warning":
        return {
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmButton:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          defaultIcon: <AlertTriangle className="h-6 w-6" />,
        };
      case "info":
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          defaultIcon: <Info className="h-6 w-6" />,
        };
      default:
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          defaultIcon: <AlertCircle className="h-6 w-6" />,
        };
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`h-12 w-12 flex-shrink-0 rounded-full ${styles.iconBg} flex items-center justify-center`}
            >
              <div className={styles.iconColor}>
                {icon || styles.defaultIcon}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">{message}</p>
            </div>

            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Typing confirmation input */}
          {requiresTyping && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type{" "}
                <span className="font-mono font-bold text-red-600">
                  {confirmationText}
                </span>{" "}
                to confirm:
              </label>
              <input
                type="text"
                value={typedConfirmation}
                onChange={(e) => setTypedConfirmation(e.target.value)}
                placeholder={`Type "${confirmationText}" here`}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {typedConfirmation && typedConfirmation !== confirmationText && (
                <p className="mt-1 text-xs text-red-600">
                  Please type "{confirmationText}" exactly as shown above
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 rounded-b-xl bg-gray-50 px-6 py-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${styles.confirmButton}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
