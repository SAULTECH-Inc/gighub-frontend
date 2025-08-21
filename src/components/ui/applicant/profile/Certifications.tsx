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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
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
                  className="group flex items-start justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-200 rounded-full mt-0.5">
                      <Award className="w-4 h-4 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-green-900 mb-1">
                        {formatted.name}
                      </h5>
                      <div className="flex items-center gap-3 text-xs text-green-600">
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>{formatted.institution}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatted.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCertificationRemove(certification)}
                    disabled={!isEditable}
                    className="p-2 text-green-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-70"
                    title="Remove certification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!certifications || certifications.length === 0) && !isEditable && (
        <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium">No certifications added</p>
          <p className="text-xs text-gray-400 mt-1">Add professional certifications to strengthen your profile</p>
        </div>
      )}

      {/* Helper Text */}
      {isEditable && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-600">
            💡 Include industry-recognized certifications with the issuing institution and year obtained.
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Add Certification</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form className="p-6 space-y-4">
              {/* Certification Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Year Obtained */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
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