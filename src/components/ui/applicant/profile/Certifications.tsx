import React, { useState } from "react";
import {CertificationResponseDto} from "../../../../utils/types";

interface CertificationProps {
    handleCertificationRemove: (certification: CertificationResponseDto) => void;
    addCertification: (certification: CertificationResponseDto) => void;
    certifications: CertificationResponseDto[];
    isEditable: boolean;
}

const Certifications: React.FC<CertificationProps> = ({
                                                          handleCertificationRemove,
                                                          addCertification,
                                                          certifications,
    isEditable
                                                      }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [certificationResponseDto, setCertificationResponseDto] = useState({
        certification: "",
        institution: "",
        yearObtained: "",
    });

    const handleAddCertification = (event: React.FormEvent) => {
        event.preventDefault();

        if (certificationResponseDto.certification && certificationResponseDto.institution && certificationResponseDto.yearObtained) {
            addCertification(certificationResponseDto);
            setCertificationResponseDto({
                certification: "",
                institution: "",
                yearObtained: "",
            });
        }


    };
    const formatCertification = (certification: CertificationResponseDto) => {
        let details = "";
        if (certification.certification) {
            details += certification.certification + " - ";
        }
        if (certification.institution) {
            details += certification.institution;
        }
        if (certification.yearObtained) {
            details += ` - ${certification.yearObtained}`;
        }
        return details;
    }

    return (
        <div className="flex-1 w-full md:w-1/2">
            <div className="w-full bg-white space-y-2">
                <label className="text-lg font-medium">Certification</label>

                {/* Selected Items Box */}
                <div className="space-y-2 flex flex-wrap gap-2 w-full p-3 md:p-4 border border-[#E6E6E6] rounded-[16px]">
                    <div className="w-full">
                        {/* Button replacing dropdown */}
                        <button
                            type="button"
                            disabled={!isEditable}
                            className="p-2 w-full border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] text-left"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsModalOpen(true);
                            }}
                        >
                            + Add Certification
                        </button>
                    </div>

                    {certifications?.map((certification,i) => (
                        <div
                            key={i}
                            className="px-4 py-2 bg-[#FA4E09] text-white rounded-[10px] flex items-center space-x-2"
                        >
                            <span>{formatCertification(certification)}</span>
                            <button
                                onClick={() => handleCertificationRemove(certification)}
                                disabled={!isEditable}
                                className="text-white font-semibold hover:bg-red-600 rounded-full"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-90 md:w-96 relative">
                        {/* Close Button */}
                        <button
                            type="button"
                            disabled={!isEditable}
                            className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-gray-900"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Add Certification</h2>

                        {/* Form to prevent default submission */}
                        <div>
                            {/* Certification Name */}
                            <input
                                type="text"
                                placeholder="Certification Name"
                                value={certificationResponseDto.certification}
                                onChange={(e) => setCertificationResponseDto({
                                    ...certificationResponseDto,
                                    certification: e.target.value
                                })}
                                className="w-full p-2 rounded mb-2 text-start  bg-[#F7F8FA] text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                            />

                            {/* Institution */}
                            <input
                                type="text"
                                placeholder="Institution"
                                value={certificationResponseDto.institution}
                                onChange={(e) => setCertificationResponseDto({
                                    ...certificationResponseDto,
                                    institution: e.target.value
                                })}
                                className="w-full p-2 rounded mb-2 text-start  bg-[#F7F8FA] text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                            />

                            {/* Year Obtained */}
                            <input
                                type="text"
                                placeholder="Year Obtained"
                                value={certificationResponseDto.yearObtained}
                                onChange={(e) => setCertificationResponseDto({
                                    ...certificationResponseDto,
                                    yearObtained: e.target.value
                                })}
                                className="w-full p-2 rounded mb-2 text-start  bg-[#F7F8FA] text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddCertification}
                                    className="px-4 py-2 bg-purple-900 text-white rounded-[10px]"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certifications;
