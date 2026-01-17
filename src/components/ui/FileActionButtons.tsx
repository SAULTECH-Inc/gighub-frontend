import { FC, useState } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: "pdf" | "doc" | "image" | "other";
}

export const FileViewerModal: FC<FileViewerModalProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            fileUrl,
                                                            fileName,
                                                            fileType = "other",
                                                          }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  // No need for URL conversion anymore - backend is fixed
  const handleDownload = async () => {
    try {
      // Use CORS-enabled fetch with proper headers
      const response = await fetch(fileUrl, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/pdf',
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(fileUrl, "_blank");
    }
  };

  const getFileExtension = () => {
    const ext = fileName.toLowerCase().split(".").pop();
    return ext || "";
  };

  const isPDF = () => {
    return fileType === "pdf" || getFileExtension() === "pdf";
  };

  const isImage = () => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    return (
        fileType === "image" || imageExtensions.includes(getFileExtension())
    );
  };

  return (
      <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
      >
        <div
            className="relative flex h-[90vh] w-full max-w-6xl flex-col rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{fileName}</h2>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {getFileExtension().toUpperCase()}
            </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom controls for images */}
              {isImage() && (
                  <>
                    <button
                        onClick={() => setZoom((prev) => Math.max(25, prev - 25))}
                        className="rounded p-2 transition-colors hover:bg-gray-100"
                        title="Zoom Out"
                    >
                      <ZoomOut className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="text-sm text-gray-600">{zoom}%</span>
                    <button
                        onClick={() => setZoom((prev) => Math.min(200, prev + 25))}
                        className="rounded p-2 transition-colors hover:bg-gray-100"
                        title="Zoom In"
                    >
                      <ZoomIn className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setRotation((prev) => (prev + 90) % 360)}
                        className="rounded p-2 transition-colors hover:bg-gray-100"
                        title="Rotate"
                    >
                      <RotateCw className="h-5 w-5 text-gray-600" />
                    </button>
                  </>
              )}

              {/* Download button */}
              <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>

              {/* Open in new tab */}
              <button
                  onClick={() => window.open(fileUrl, "_blank")}
                  className="rounded p-2 transition-colors hover:bg-gray-100"
                  title="Open in new tab"
              >
                <Maximize2 className="h-5 w-5 text-gray-600" />
              </button>

              {/* Close button */}
              <button
                  onClick={onClose}
                  className="rounded p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            {isPDF() ? (
                <iframe
                    src={`${fileUrl}#toolbar=0`}
                    className="h-full w-full rounded border-0"
                    title={fileName}
                />
            ) : isImage() ? (
                <div className="flex h-full items-center justify-center">
                  <img
                      src={fileUrl}
                      alt={fileName}
                      className="max-h-full max-w-full object-contain transition-transform"
                      style={{
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      }}
                  />
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="rounded-full bg-gray-200 p-6">
                    <svg
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Preview not available for this file type
                  </p>
                  <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
                    >
                      <Download className="h-5 w-5" />
                      Download File
                    </button>
                    <button
                        onClick={() => window.open(fileUrl, "_blank")}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Maximize2 className="h-5 w-5" />
                      Open in New Tab
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

// Utility function for downloading files with custom names
export const downloadFileWithCustomName = async (
    fileUrl: string,
    fileName: string,
) => {
  try {
    const response = await fetch(fileUrl, {
      mode: 'cors',
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: open in new tab
    window.open(fileUrl, "_blank");
  }
};

// Example usage component
export const FileActionButtons: FC<{
  fileUrl: string;
  fileName: string;
  fileType?: "pdf" | "doc" | "image" | "other";
}> = ({ fileUrl, fileName, fileType }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
      <>
        <div className="flex items-center gap-2">
          <button
              onClick={() => setIsViewerOpen(true)}
              className="cursor-pointer transition-transform hover:scale-110"
              title="View file"
          >
            <svg
                className="h-6 w-6 text-gray-600 hover:text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
              onClick={() => downloadFileWithCustomName(fileUrl, fileName)}
              className="cursor-pointer transition-transform hover:scale-110"
              title="Download file"
          >
            <svg
                className="h-6 w-6 text-gray-600 hover:text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>

        <FileViewerModal
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            fileUrl={fileUrl}
            fileName={fileName}
            fileType={fileType}
        />
      </>
  );
};