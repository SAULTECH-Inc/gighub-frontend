import React, { useState } from "react";
import fileUploaded from "../../../../assets/icons/fileUploaded.svg";
import cancelsmall from "../../../../assets/icons/cancelsmall.svg";
interface FileItem {
  id: number;
  name: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Company group picture" },
    { id: 2, name: "Company group picture" },
    { id: 3, name: "Company group picture" },
  ]);

  const handleRemove = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div className="mx-auto h-[376px] w-full border border-[#E6E6E6] bg-[#FFFFFF] p-4">
      {/* Header */}
      <div className="mb-4 flex h-[42px] w-full cursor-pointer items-center justify-between rounded-[16px] border-[1px] border-[#E6E6E6] p-6">
        <span className="font-lato text-sm text-gray-700">Upload Files</span>
        <div className="relative inline-block">
          {/* Hidden native file input */}
          <input type="file" id="fileInput" className="hidden" />

          {/* Custom button for file upload */}
          <label
            htmlFor="fileInput"
            className="cursor-pointer rounded-lg px-4 py-2 font-lato text-sm text-[#6438C2] transition duration-300"
          >
            Browse File
          </label>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="mx-auto flex h-[50px] w-full cursor-pointer items-center justify-between rounded-[10px] bg-[#F7F8FA] px-3 py-2"
          >
            <div className="flex items-center space-x-3">
              {/* File Icon */}
              <img src={fileUploaded} alt="uploaded file" />
              <span className="text-black-400 text-[16px]">{file.name}</span>
            </div>
            {/* Remove Button */}
            <button
              onClick={() => handleRemove(file.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <img src={cancelsmall} alt="Cancel" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
