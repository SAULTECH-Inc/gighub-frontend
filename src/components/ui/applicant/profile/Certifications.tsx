import React, { memo, useState } from "react";
import { CertificationResponseDto } from "../../../../utils/types";

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
  isEditable,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificationResponseDto, setCertificationResponseDto] = useState({
    certification: "",
    institution: "",
    yearObtained: "",
  });

  const handleAddCertification = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      certificationResponseDto.certification &&
      certificationResponseDto.institution &&
      certificationResponseDto.yearObtained
    ) {
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
  };

  return (
    <div className="w-full flex-1 md:w-1/2">
      <div className="w-full space-y-2 bg-white">
        <label className="text-lg font-medium">Certification</label>

        {/* Selected Items Box */}
        <div className="flex w-full flex-wrap gap-2 space-y-2 rounded-[16px] border border-[#E6E6E6] p-3 md:p-4">
          <div className="w-full">
            {/* Button replacing dropdown */}
            <button
              type="button"
              disabled={!isEditable}
              className="w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] p-2 text-left"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              + Add Certification
            </button>
          </div>

          {certifications?.map((certification, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 rounded-[10px] bg-[#FA4E09] px-4 py-2 text-white"
            >
              <span>{formatCertification(certification)}</span>
              <button
                onClick={() => handleCertificationRemove(certification)}
                disabled={!isEditable}
                className="rounded-full font-semibold text-white hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="w-90 relative rounded-lg bg-white p-6 md:w-96">
            {/* Close Button */}
            <button
              type="button"
              disabled={!isEditable}
              className="text-gray-600 hover:text-gray-900 absolute right-3 top-2 text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="mb-4 text-lg font-semibold">Add Certification</h2>

            {/* Form to prevent default submission */}
            <div>
              {/* Certification Name */}
              <input
                type="text"
                placeholder="Certification Name"
                value={certificationResponseDto.certification}
                onChange={(e) =>
                  setCertificationResponseDto({
                    ...certificationResponseDto,
                    certification: e.target.value,
                  })
                }
                className="mb-2 w-full rounded border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0 md:p-3"
              />

              {/* Institution */}
              <input
                type="text"
                placeholder="Institution"
                value={certificationResponseDto.institution}
                onChange={(e) =>
                  setCertificationResponseDto({
                    ...certificationResponseDto,
                    institution: e.target.value,
                  })
                }
                className="mb-2 w-full rounded border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0 md:p-3"
              />

              {/* Year Obtained */}
              <input
                type="text"
                placeholder="Year Obtained"
                value={certificationResponseDto.yearObtained}
                onChange={(e) =>
                  setCertificationResponseDto({
                    ...certificationResponseDto,
                    yearObtained: e.target.value,
                  })
                }
                className="mb-2 w-full rounded border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0 md:p-3"
              />

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-400 rounded px-4 py-2 text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="rounded-[10px] bg-purple-900 px-4 py-2 text-white"
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

export default memo(Certifications);
