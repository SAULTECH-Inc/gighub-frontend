import React, { useState } from "react";

interface CertificationProps {
    handleCertificationRemove: (certification: string) => void;
    addCertification: (certification: string) => void;
    certifications: string[];
}

const Certifications: React.FC<CertificationProps> = ({
                                                          handleCertificationRemove,
                                                          addCertification,
                                                          certifications,
                                                      }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [certName, setCertName] = useState("");
    const [institution, setInstitution] = useState("");
    const [year, setYear] = useState("");

    const handleAddCertification = (event: React.FormEvent) => {
        event.preventDefault(); // Prevents page reload

        if (certName && institution && year) {
            const newCertification = `${certName} - ${institution} (${year})`;
            addCertification(newCertification);
            setIsModalOpen(false);
            setCertName("");
            setInstitution("");
            setYear("");
        }
    };

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
                            className="p-2 w-full border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] text-left"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsModalOpen(true);
                            }}
                        >
                            + Add Certification
                        </button>
                    </div>

                    {certifications.map((certification) => (
                        <div
                            key={certification}
                            className="px-4 py-2 bg-[#FA4E09] text-white rounded-[10px] flex items-center space-x-2"
                        >
                            <span>{certification}</span>
                            <button
                                onClick={() => handleCertificationRemove(certification)}
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
                            className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-gray-900"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Add Certification</h2>

                        {/* Form to prevent default submission */}
                        <form>
                            {/* Certification Name */}
                            <input
                                type="text"
                                placeholder="Certification Name"
                                value={certName}
                                onChange={(e) => setCertName(e.target.value)}
                                className="w-full p-2 rounded mb-2 text-start  bg-[#F7F8FA] text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                            />

                            {/* Institution */}
                            <input
                                type="text"
                                placeholder="Institution"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                className="w-full p-2 rounded mb-2 text-start  bg-[#F7F8FA] text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                            />

                            {/* Year Obtained */}
                            <input
                                type="text"
                                placeholder="Year Obtained"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
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
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certifications;
