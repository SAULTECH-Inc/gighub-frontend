import React, { useState } from "react";

// Import the SVG files from the assets folder
import videoIcon from '../../../assets/icons/video.svg';
import fileIcon from '../../../assets/icons/File.svg';

const ResumeAndCoverLetter: React.FC = () => {
    const [documentName, setDocumentName] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileNames = Array.from(files).map((file) => ({
                name: file.name,
                type: file.type,
                file: URL.createObjectURL(file), // Create a file URL for preview
            }));
            setUploadedFiles((prev) => [...prev, ...fileNames]);
        }
    };

    const removeFile = (fileName: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    };

    const handleChangeDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentName(e.target.value);
    };

    const documentOptions = ["Resume", "Cover Letter", "Portfolio", "Video"]; // Added Video option

    // Function to get file type icon or preview
    const getFilePreview = (file: any) => {
        if (file.type.startsWith('image')) {
            return <img src={file.file} alt="file preview" className="w-8 h-8 rounded-full" />; // Image preview
        }
        if (file.type.startsWith('video')) {
            return <img src={videoIcon} alt="video icon" className="w-8 h-8 rounded-full" />; // Video icon
        }
        return <img src={fileIcon} alt="file icon" className="w-8 h-8 rounded-full" />; // Default file icon
    };

    return (
        <div className="p-8 space-y-6 font-sans mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
            <div className="text-2xl font-semibold">Resume and Cover Letter</div>

            <div className="space-y-6">
                {/* Document Name Dropdown */}
                <div>
                    <label className="block text-lg font-medium mb-2">Document Name</label>
                    <div className="w-[400px] bg-white p-4">
                        <select
                            className="w-[925px] p-2 border border-[#E6E6E6] rounded-[16px] bg-white"
                            onChange={handleChangeDropdown}
                            value={documentName}
                        >
                            <option value="" disabled></option>
                            {documentOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* File Upload Section - Flexbox Layout */}
                <div className="flex gap-6">
                    <div
                        className="border-[1px] w-[287px] h-[194px] border-[#B6B6B6] rounded-[16px] bg-white p-4 text-center flex flex-col items-center justify-center"
                    >
                        <p className="text-gray-600 mb-4">Drag and drop your files here</p>
                        <button
                            onClick={() => document.getElementById('fileInput')?.click()}
                            className="px-6 py-2 bg-[#6438C2] text-white rounded-md"
                        >
                            Browse Files
                        </button>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple
                        />
                    </div>

                    {/* Display Selected Files in a Flex Box */}
                    <div className="w-[616px] h-[194px] flex flex-col gap-2 p-4 border border-[#E6E6E6] rounded-[16px] overflow-auto">
                        {/* Uploaded Files Title */}
                        <p className="text-[#8E8E8E] font-lato weight-400">Uploaded files</p>

                        {/* Loop through and display files */}
                        <div className="flex gap-4 flex-wrap">
                            {uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-[#F2F5F7] p-3 rounded-[16px] border border-[#E6E6E6] w-[120px] h-[60px] justify-center"
                                >

                                    <div className="flex flex-col items-center">
                                        {getFilePreview(file)}
                                        <span className="text-xs truncate">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className="text-black text-lg font-semibold hover:text-gray-400"
                                        style={{ fontSize: "20px" }} // Larger cancel button
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAndCoverLetter;
