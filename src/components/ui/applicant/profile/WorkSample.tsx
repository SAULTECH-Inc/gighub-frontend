import React, { useState } from 'react';
import FileIcon from '../../../../assets/icons/fileUploaded.svg';
import LinkIcon from '../../../../assets/icons/linkedin.svg';

const FileUploadForm: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [links, setLinks] = useState<string[]>(['']);

    // Handle multiple file uploads (up to 3)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (files.length + selectedFiles.length <= 3) {
                setFiles([...files, ...selectedFiles]);
            } else {
                alert('You can upload up to 3 files only.');
            }
        }
    };

    // Remove individual file
    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Handle link input changes
    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinks(updatedLinks);
    };

    // Remove individual link
    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    // Add new link (max 3)
    const addLink = () => {
        if (links.length < 3) {
            setLinks([...links, '']);
        } else {
            alert('You can add up to 3 links only.');
        }
    };

    const handleBrowseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById("file-upload")?.click();
    };

    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-8">
            <h3 className="text-xl mb-4">Work sample</h3>

            {/* Upload method selector */}

            {/* File & Link Upload Sections Side by Side */}
            <div className="flex flex-col md:items-start md:flex-row space-x-0 md:space-x-6 space-y-6 md:space-y-0">
                {/* FILE UPLOAD BOX */}
                <div className="w-full md:w-1/2 h-[250px] p-6 bg-white border border-[#E6E6E6] rounded-[16px]">
                    <span className="text-sm text-gray-700 font-lato">Upload Files</span>
                    <div className="flex items-center justify-between bg-gray-50 p-4 border border-[#E6E6E6] w-full h-[52px] rounded-[16px]">
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={handleBrowseClick}
                            className="ml-4 py-1 px-4 text-white text-sm bg-[#6438C2] rounded-[10px]"
                        >
                            Browse files
                        </button>
                    </div>

                    {/* Display Uploaded Files */}
                    <div className="mt-4">
                        {files.map((file, index) => (
                            <div key={index} className="flex justify-between items-center bg-[#F7F8FA] p-3 rounded-[10px] mt-2">
                                <div className="flex items-center">
                                    <img src={FileIcon} alt="File Icon" className="w-4 h-4 mr-2"/>
                                    <span>{file.name}</span>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="ml-2 text-sm text-black hover:text-gray-700"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LINKS INPUT BOX */}
                <div className="w-full md:w-1/2 min-h-[250px] md:h-[250px] p-6 bg-white border border-[#E6E6E6] rounded-[16px]">
                    <span className="text-sm text-gray-700 font-lato">Provide Links</span>

                    {links.map((link, index) => (
                        <div key={index} className="flex items-center bg-[#F7F8FA] p-2 rounded-[10px] mt-2">
                            <img src={LinkIcon} alt="Link Icon" className="w-4 h-4"/>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                placeholder="Enter a link"
                                className="flex-1 ml-2 p-2 bg-[#F9FAFB] text-sm border border-[#E6E6E6] focus:outline-none focus:ring-0 focus:border-[1px] focus:border-gray"
                            />
                            <button
                                onClick={() => removeLink(index)}
                                className="ml-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                X
                            </button>
                        </div>
                    ))}

                    {links.length < 3 && (
                        <button onClick={addLink} className="mt-4 text-sm text-purple-600 hover:underline">
                            Add Another Link
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FileUploadForm;
