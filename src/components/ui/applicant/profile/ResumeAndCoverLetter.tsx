import React, {useState} from "react";
import videoIcon from '../../../../assets/icons/video.svg';
import fileIcon from '../../../../assets/icons/fileUploaded.svg';
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";
import {CvResponseDto, FileUploadRequest} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";
import {Action, UserType} from "../../../../utils/enums.ts";
import {toast} from "react-toastify";
const getField = (docName: string)=>{
    switch (docName){
        case 'Resume':
            return 'cvLink';
        case 'Cover Letter':
            return 'coverLetterLink';
        default:
            return "videoCv";
    }
}
const ResumeAndCoverLetter: React.FC = () => {
    const {applicant} = useAuth();
    const {cvDetails, setCvDetails, uploadProfileFile, deleteProfileFile} = useApplicantJobProfile();
    const [documentName, setDocumentName] = useState<string>("");

    const handleFileUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const singleFile = files[0];
            const response = await uploadProfileFile({
                file: singleFile,
                userId: applicant?.id,
                whatIsTheItem: documentName,
                userType: UserType.APPLICANT,
                action: Action.PROFILE_PICTURE_UPDATE,
            } as FileUploadRequest);
            if (response) {
                setCvDetails(
                    {...cvDetails,
                        [getField(documentName)]: response?.url as string,
                    } as CvResponseDto,
                );

            }else {
                toast.error("Failed to upload file. Please try again later.");
            }
        }
    };

    const removeFile = async(fileName: string) => {
        const response = await deleteProfileFile({
            userId: applicant?.id,
            fileUrl: fileName === 'Video' ? cvDetails?.videoCv : fileName === 'Resume' ? cvDetails?.cvLink : cvDetails?.coverLetterLink,
            whatIsTheItem: documentName,
            userType: UserType.APPLICANT,
            action: Action.DELETE_PROFILE_FILE,
        } as FileUploadRequest);
        if (response) {
            setCvDetails(
                {...cvDetails,
                    [getField(documentName)]: null,
                } as CvResponseDto,
            );
        } else {
            toast.error("Failed to delete file. Please try again later.");
        }
    };

    const handleChangeDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentName(e.target.value);
    };

    const documentOptions = ["Resume", "Cover Letter", "Video"];

    // Function to get the appropriate file icon
    // const getFileIcon = (file: any) => {
    //     return file.type.startsWith('video') ? videoIcon : fileIcon;
    // };

    return (
        <section id="resume-cover-letter" className="w-full pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <h3 className="text-xl">Resume and Cover Letter</h3>

            <div className="w-full space-y-6">
                {/* Document Name Dropdown */}
                <div className="w-full flex flex-col justify-start">
                    <label className="block text-lg font-medium mb-2">Document Name</label>
                    <select
                        className="w-full p-4 border border-[#E6E6E6] rounded-[16px] focus:outline-none focus:ring-0 focus:border-[1px]"
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

                {/* File Upload Section */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div
                        className="w-full md:w-[30%] h-[194px] rounded-[16px] border-dashed border-[2px] border-[#6438C2] bg-white p-4 text-center flex flex-col items-center justify-center"
                    >
                        <p className="text-[16px] text-gray-600 mb-4 text-center">
                            Drag and drop your files here<br />
                            <span>OR</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => document.getElementById('fileInput')?.click()}
                            className="px-6 py-2 bg-[#6438C2] text-white rounded-[16px]"
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

                    {/* Display Selected Files */}
                    <div className="w-full md:w-[70%] h-[194px] flex flex-col gap-2 p-4 border border-[#E6E6E6] rounded-[16px] overflow-auto">
                        <p className="text-[#8E8E8E] font-lato weight-400">Uploaded files</p>

                        <div className="flex gap-4 flex-wrap">
                            {
                                cvDetails?.cvLink && cvDetails?.cvLink !== "" && (
                                    <div
                                        className="flex items-center gap-2 bg-[#F2F5F7] p-3 rounded-[16px] border border-[#E6E6E6] w-[120px] h-[60px] justify-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <img src={fileIcon} alt="file icon" className="w-8 h-8 rounded-full"/>
                                            <span className="text-xs truncate">Resume</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile("Resume")}
                                            className="text-black text-lg font-semibold hover:text-gray-400"
                                            style={{fontSize: "20px"}}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )
                            }

                            {
                                cvDetails?.coverLetterLink && cvDetails?.coverLetterLink !== "" && (
                                    <div
                                        className="flex items-center gap-2 bg-[#F2F5F7] p-3 rounded-[16px] border border-[#E6E6E6] w-[120px] h-[60px] justify-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <img src={fileIcon} alt="file icon" className="w-8 h-8 rounded-full"/>
                                            <span className="text-xs truncate">Cover Letter</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile("Cover Letter")}
                                            className="text-black text-lg font-semibold hover:text-gray-400"
                                            style={{fontSize: "20px"}}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )
                            }

                            {
                                cvDetails?.videoCv && cvDetails?.videoCv !== "" && (
                                    <div
                                        className="flex items-center gap-2 bg-[#F2F5F7] p-3 rounded-[16px] border border-[#E6E6E6] w-[120px] h-[60px] justify-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <img src={videoIcon} alt="file icon" className="w-8 h-8 rounded-full"/>
                                            <span className="text-xs truncate">Video</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile("Video")}
                                            className="text-black text-lg font-semibold hover:text-gray-400"
                                            style={{fontSize: "20px"}}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResumeAndCoverLetter;
