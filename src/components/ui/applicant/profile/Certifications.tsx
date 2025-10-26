import React, { memo, useState } from "react";
import { CertificationResponseDto } from "../../../../utils/types";
import { X, Plus, Award, Calendar, Building } from "lucide-react";

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
    dateObtained: "",
  });

  const handleAddCertification = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      certificationResponseDto.certification &&
      certificationResponseDto.institution &&
      certificationResponseDto.dateObtained
    ) {
      addCertification(certificationResponseDto);
      setCertificationResponseDto({
        certification: "",
        institution: "",
        dateObtained: "",
      });
      setIsModalOpen(false);
    }
  };

  const formatCertification = (certification: CertificationResponseDto) => {
    return {
      name: certification.certification,
      institution: certification.institution,
      year: certification.dateObtained,
    };
  };

  return (
    <div className="space-y-4">
      {/* Add Certification Button */}
      {isEditable && (
        <button
          type="button"
          disabled={!isEditable}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </button>
      )}

      {/* Selected Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Your certifications:</p>
          <div className="space-y-2">
            {certifications.map((certification, index) => {
              const formatted = formatCertification(certification);
              return (
                <div
                  key={index}
                  className="group flex items-start justify-between rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex flex-1 items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-200">
                      <Award className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h5 className="mb-1 text-sm font-semibold text-green-900">
                        {formatted.name}
                      </h5>
                      <div className="flex items-center gap-3 text-xs text-green-600">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{formatted.institution}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatted.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCertificationRemove(certification)}
                    disabled={!isEditable}
                    className="rounded-lg p-2 text-green-600 opacity-70 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove certification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!certifications || certifications.length === 0) && !isEditable && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-500">
          <Award className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-sm font-medium">No certifications added</p>
          <p className="mt-1 text-xs text-gray-400">
            Add professional certifications to strengthen your profile
          </p>
        </div>
      )}

      {/* Helper Text */}
      {isEditable && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-xs text-green-600">
            💡 Include industry-recognized certifications with the issuing
            institution and year obtained.
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Certification
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form className="space-y-4 p-6">
              {/* Certification Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Certification Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., AWS Certified Solutions Architect"
                  value={certificationResponseDto.certification}
                  onChange={(e) =>
                    setCertificationResponseDto({
                      ...certificationResponseDto,
                      certification: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              {/* Institution */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Institution *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Amazon Web Services"
                  value={certificationResponseDto.institution}
                  onChange={(e) =>
                    setCertificationResponseDto({
                      ...certificationResponseDto,
                      institution: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              {/* Year Obtained */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Year Obtained *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2024"
                  value={certificationResponseDto.dateObtained}
                  onChange={(e) =>
                    setCertificationResponseDto({
                      ...certificationResponseDto,
                      dateObtained: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Certifications);
