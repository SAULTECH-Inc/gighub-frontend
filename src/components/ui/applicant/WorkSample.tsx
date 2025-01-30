import React, { useState } from 'react';
import FileIcon from '../../../assets/icons/File.svg'; // Adjust the path based on your folder structure
import LinkIcon from '../../../assets/icons/LinkIcon.svg'; // Adjust the path based on your folder structure

const FileUploadForm: React.FC = () => {
    const [uploadMethod, setUploadMethod] = useState<string>(''); // Upload method state
    const [file, setFile] = useState<File | null>(null); // File state
    const [links, setLinks] = useState<string[]>(['']); // Links state (start with an empty link)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinks(updatedLinks);
    };

    const removeFile = () => {
        setFile(null);
    };

    const removeLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
    };

    const handleBrowseClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevents page refresh
        document.getElementById("file-upload")?.click(); // Trigger file input
    };

    return (
            <div className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
                <h2 className="text-xl font-semibold mb-4">Work sample</h2>

                {/* Upload method selector */}
                <div className="mb-4">
                    <label htmlFor="upload-method" className="block text-sm font-medium text-gray-700 mb-2"></label>
                    <select
                        id="upload-method"
                        value={uploadMethod}
                        onChange={(e) => setUploadMethod(e.target.value)} // This ensures the method updates correctly
                        className="block w-[915px] h-[45px] px-4 py-2 border-[#E6E6E6] rounded-[16px]"
                    >
                        <option value="" disabled>Select upload method</option>
                        <option value="file">Upload Files</option>
                        <option value="link">Provide Links</option>
                    </select>
                </div>

                {/* Upload Files section */}
                <div className="w-[915px] h-[310px] mx-auto p-6 bg-white border border-[#E6E6E6] rounded-[16px]">
                    <div className="mb-6">
                        <div
                            className="flex items-center justify-between bg-gray-50 p-4 border border-[#E6E6E6] w-[867px] h-[52px] rounded-[16px]">
                            <span className="text-sm text-gray-700 font-lato">Upload Files</span>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    onClick={handleBrowseClick}
                                    className="ml-4 py-1 px-4 text-white text-sm bg-[#6438C2] rounded-[10px] w-[150px] h-[28px]"
                                >
                                    Browse files
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Flex container for uploaded files and links */}
                    {file || links.length > 0 ? (
                        <div className="flex space-x-6 mt-6">
                            {/* Files box */}
                            {file && (
                                <div
                                    className="flex-1 w-[200px] border-[1px] h-[180px] border-[#E6E6E6] rounded-[16px] p-4">
                                    <div
                                        className="flex items-center justify-between bg-[#F7F8FA] border-none p-3 rounded-[10px] w-[369px] h-[49px]">
                                        <img src={FileIcon} alt="File Icon" className="w-4 h-4 mr-2"/>
                                        <span>{file.name}</span>
                                        <button
                                            onClick={removeFile}
                                            className="text-sm text-black hover:text-gray-700"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Links box */}
                            {uploadMethod === 'link' && (
                                <div className="flex-1 w-[200px] h-[180px] border border-[#E6E6E6] rounded-[16px] p-4">
                                    <h3 className="text-sm font-semibold mb-4"></h3>
                                    {links.map((link, index) => (
                                        <div key={index}
                                             className="flex items-center justify-between bg-[#F7F8FA] border-none p-3 rounded-[10px] w-[369px] h-[49px]">
                                            <img src={LinkIcon} alt="Link Icon" className="w-4 h-4 text-gray-500"/>
                                            <input
                                                type="url"
                                                value={link}
                                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                                placeholder="Enter a link"
                                                className="flex-1 ml-2 p-2 border-none outline-none bg-[#F9FAFB] text-sm"
                                            />
                                            {/* Always show the "X" button next to the input */}
                                            <button
                                                onClick={() => removeLink(index)}
                                                className="ml-2 text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
            );
        };

            export default FileUploadForm;
