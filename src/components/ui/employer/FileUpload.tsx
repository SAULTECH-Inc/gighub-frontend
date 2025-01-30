import React, { useState } from "react";
import fileUploaded from '../../../assets/icons/fileUploaded.svg';
import cancelsmall from '../../../assets/icons/cancelsmall.svg';
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
        <div className="border border-[#E6E6E6]  p-4 w-full h-[376px] bg-[#FFFFFF] mx-auto">
            {/* Header */}
            <div className="cursor-pointer flex justify-between items-center p-6 mb-4 border-[1px] border-[#E6E6E6] h-[42px] w-full rounded-[16px]">
                <span className="text-sm font-lato text-gray-700">Upload Files</span>
                <div className="relative inline-block">
                    {/* Hidden native file input */}
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                    />

                    {/* Custom button for file upload */}
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-[#6438C2] text-sm font-lato px-4 py-2 rounded-lg transition duration-300"
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
                        className="cursor-pointer flex justify-between items-center bg-[#F7F8FA] px-3 py-2 rounded-[10px] w-full h-[43px] mx-auto"
                    >
                        <div className="flex items-center space-x-3">
                            {/* File Icon */}
                            <img src={fileUploaded} alt="uploaded file"/>
                            <span className="text-[16px] text-black-400">{file.name}</span>
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
