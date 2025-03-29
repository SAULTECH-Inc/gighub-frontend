import React, { useState, useRef } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import documentAttachment from "../../../../assets/icons/documentAttachment.svg";
import videoAttachment from "../../../../assets/icons/videoAttachment.svg";
import {useAuth} from "../../../../store/useAuth.ts";
import {ApplicantSignupRequest} from "../../../../utils/types";

interface StepTwoProp {
    handleNext: () => void;
    handlePrev: () => void;
}

const ApplicantSignupStepTwo: React.FC<StepTwoProp> = ({
                                                           handleNext,
                                                           handlePrev,
                                                       }) => {
    const { applicantSignupRequest, setApplicantSignupRequest, sendVerificationOtp } = useAuth();
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [documentType, setDocumentType] = useState<string | undefined>(applicantSignupRequest?.documentType);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBrowseClick = () => {
        if (documentType) {
            fileInputRef.current?.click();
        }
    };

    const handleFileUpload = (files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            const newFiles = fileArray.map((file) => ({
                name: file.name,
                progress: 0,
                file,
                icon: getFileIcon(file.name),
            }));
            setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

            // Update formData based on documentType
            if (documentType === "resume") {
                setApplicantSignupRequest({
                    ...applicantSignupRequest,
                    [documentType]: newFiles[0].file,
                } as ApplicantSignupRequest);
            } else if (documentType === "coverLetterLink") {
                setApplicantSignupRequest({
                    ...applicantSignupRequest,
                    [documentType]: newFiles[0].file,
                } as ApplicantSignupRequest);
            }else if (documentType === "portfolio") {
                setApplicantSignupRequest({
                    ...applicantSignupRequest,
                    [documentType]: newFiles[0].file,
                } as ApplicantSignupRequest);
            }else if (documentType === "videoCv") {
                setApplicantSignupRequest({
                    ...applicantSignupRequest,
                    [documentType]: newFiles[0].file,
                } as ApplicantSignupRequest);
            }

            // Simulate file upload progress (replace with actual upload logic)
            newFiles.forEach((file, index) => {
                console.log(index);
                const interval = setInterval(() => {
                    setUploadedFiles((prev) => {
                        const updatedFiles = [...prev];
                        const currentFile = updatedFiles.find((f) => f.name === file.name);
                        if (currentFile && currentFile.progress < 100) {
                            currentFile.progress += 10; // Increment progress by 10% for simulation
                        }
                        return updatedFiles;
                    });
                    if (file.progress >= 100) clearInterval(interval); // Stop when 100% is reached
                }, 500); // Update progress every 500ms (simulated)
            });
        }
    };


    const getFileIcon = (fileName: string) => {
        if (fileName.toLowerCase().includes("resume")) {
            return documentAttachment;
        } else if (fileName.toLowerCase().includes("coverLetterLink")) {
            return documentAttachment;
        } else if (fileName.toLowerCase().includes("videoCv")) {
            return videoAttachment;
        }
        return documentAttachment;
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files);
    };

    // Remove a file from the list
    const handleRemoveFile = (fileName: string) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>)=>{
        const { name, value } = e.target as HTMLInputElement & HTMLSelectElement;
        if (name === "documentType") {
            setDocumentType(value);
        } else {
            setApplicantSignupRequest({
                ...applicantSignupRequest,
                [name]: value,
            } as ApplicantSignupRequest);
        }
    }

    const handleProceed = async ()=>{
        const success = await sendVerificationOtp(applicantSignupRequest?.email as string,"SIGNUP");
        if(success) {
            handleNext();
        }else{
            return false;
        }
    }

    return (
        <motion.div
            className="w-[310px] md:w-[680px] lg:w-[500px] mt-5 md:mr-28 md:mt-32 px-[10px] lg:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="w-full rounded-[16px] border-[1px] border-[#E6E6E6] p-6"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-full flex flex-col mx-auto justify-center"
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-xl font-bold mb-4">Upload Work Experience</h1>

                    <select
                        className="w-full h-[52px] px-4 py-2 border-[2px] border-[#E6E6E6] rounded-[16px] bg-[#F7F8FA]  outline-none focus:ring-0 focus:border-none mb-4"
                        onChange={(e) => {
                            handleChange(e);
                            setDocumentType(e.target.value);
                        }}
                        name="documentType"
                        value={documentType || ""}
                    >
                        <option value="" disabled>
                            Document name
                        </option>
                        <option value="resume">Resume</option>
                        <option value="coverLetterLink">Cover Letter</option>
                        <option value="portfolio">Work Samples</option>
                        <option value="videoCv">Video CV</option>
                    </select>

                    <motion.div
                        className="bg-[#f2f5f7] w-full h-[194px] rounded-[16px] flex flex-col justify-center items-center mb-4 border-dashed border-[1px] border-[#6438C2]"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()} // Prevent default to allow dropping
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-center text-gray-600 mb-2">
                            Drag and drop your files here
                        </p>
                        <span className="my-4">OR</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            name="workExperience"
                            ref={fileInputRef}
                            multiple
                            disabled={!documentType} // Disable the file input if no document type is selected
                        />
                        <button
                            className="w-[162px] h-[44px] flex justify-center items-center text-white font-[13px] rounded-[16px] border border-[#E6E6E6] bg-[#6438C2] hover:bg-[#5931A9] focus:outline-none focus:ring-0 focus:border-none mx-auto"
                            onClick={handleBrowseClick}
                            disabled={!documentType} // Disable the button if no document type is selected
                        >
                            Browse Files
                        </button>

                    </motion.div>
                    {!documentType && (
                        <motion.p
                            className="text-red-600 text-sm mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            * Please select a document name before uploading.
                        </motion.p>
                    )}

                    <motion.p
                        className="mt-[20px] text-gray-600 text-[16px]"
                        initial={{ y: 50 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Uploaded Files
                    </motion.p>
                    <motion.div
                        className="w-full flex flex-col mt-[20px] gap-y-[10px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {uploadedFiles.map((file, index) => (
                            <motion.div
                                key={index}
                                className="w-full h-[89px] border-[1px] border-[#E6E6E6] rounded-[16px] flex items-center justify-between p-3"
                                initial={{ x: -50 }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-x-2">
                                    <img
                                        src={file.icon}
                                        alt="file icon"
                                    />
                                    <div className="text-sm text-gray-400">{file.name}</div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {file.progress}% Uploaded
                                </div>
                                <button
                                    className="text-sm text-red-600"
                                    onClick={() => handleRemoveFile(file.name)} // Remove file on click
                                >
                                    &#10005; {/* Unicode for 'X' symbol */}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className="w-full flex justify-end mt-6 gap-x-4"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={handlePrev}
                    className="w-[162px] h-[44px] text-gray-600 font-[13px] rounded-[16px] border border-[#E6E6E6] bg-white hover:bg-[#F7F8FA] focus:outline-none focus:ring-0 focus:border-none"
                >
                    Back
                </button>
                <button
                    onClick={handleProceed}
                    className="w-[162px] h-[44px] text-white font-[13px] rounded-[16px] bg-[#6438C2] hover:bg-[#5931A9] focus:outline-none focus:ring-0 focus:border-none"
                >
                    Proceed
                </button>
            </motion.div>
        </motion.div>
    );
};

export default ApplicantSignupStepTwo;
