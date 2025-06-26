import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React, { useEffect, useState } from "react";
import useModalStore from "../../../../store/modalStateStores.ts";
import {
  classOfDegrees,
  CvResponseDto,
  EducationResponseDto,
  fieldsOfStudies,
  institutions,
  Option,
} from "../../../../utils/types";
import { toast } from "react-toastify";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import { useCities } from "../../../../hooks/useCities.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";

interface AddEducationModalProp {
  modalId: string;
}

const AddEducationModal: React.FC<AddEducationModalProp> = ({ modalId }) => {
  const {cities} = useCities();
  const {countries} = useCountries();
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];
  const {
    cvDetails,
    educations,
    setEducations,
    setCvDetails,
    applicantEducation,
    setApplicantEducation,
    resetApplicantEducation,
    addApplicantEducation,
  } = useApplicantJobProfile();

  const [description, setDescription] = useState<string>("");
  const [currentlyEnrolled, setCurrentEnrolled] = useState<boolean>(false);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal(modalId);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    setApplicantEducation({
      ...applicantEducation,
      description: description,
    });
    if (currentlyEnrolled) {
      setApplicantEducation({
        ...applicantEducation,
        endDate: new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, currentlyEnrolled]);

  const handleAddEducation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const newEducation = await addApplicantEducation(applicantEducation);
      if (newEducation) {
        toast.success("Education updated successfully!");
        resetApplicantEducation();
        const edus: EducationResponseDto[] = [...(educations || [])];
        edus.push(newEducation);
        setEducations(edus);
        setCvDetails({
          ...cvDetails,
          educations: edus,
        } as CvResponseDto);
      }
    } catch (error) {
      toast.error("Failed to update education.");
      console.error("Error updating education:", error);
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantEducation({
      ...applicantEducation,
      [name]: new Date(value),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 -top-4 z-50 flex items-center justify-center bg-black"
      onClick={() => closeModal(modalId)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-10 flex max-h-[95vh] w-[100%] flex-col gap-y-5 overflow-y-auto rounded-[16px] bg-white p-4 shadow-sm md:mt-0 md:w-[690px] md:p-8 lg:w-[820px] lg:p-10"
      >
        <h3>Not Specified</h3>

        <div className="flex w-full flex-row gap-x-6">
          <div className="flex w-full flex-col gap-y-2">
            <label>Degree</label>
            <CustomDropdown
              placeholder="Class of degree"
              options={classOfDegrees}
              handleSelect={(selected: Option) => {
                setApplicantEducation({
                  ...applicantEducation,
                  degree: selected.value,
                });
              }}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-1 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
            />
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <label>Field of Study</label>
            <CustomDropdown
              placeholder="Field of study"
              options={fieldsOfStudies}
              handleSelect={(selected: Option) => {
                setApplicantEducation({
                  ...applicantEducation,
                  fieldOfStudy: selected.value,
                });
              }}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-1 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
            />
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-6">
          <div className="flex w-full flex-col gap-y-2">
            <label>Institution</label>
            <CustomDropdown
              placeholder="Enter institution"
              options={institutions}
              handleSelect={(selected: Option) => {
                setApplicantEducation({
                  ...applicantEducation,
                  institution: selected.value,
                });
              }}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
            />
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <label>Country</label>
            <CustomDropdown
              placeholder="Enter country"
              options={countries}
              handleSelect={(selected: Option) => {
                setApplicantEducation({
                  ...applicantEducation,
                  country: selected.value,
                });
              }}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-x-2 md:flex-row lg:gap-x-6">
          <div className="flex w-full flex-col gap-y-2 md:w-1/2">
            <label>City</label>
            <CustomDropdown
              placeholder="Enter city"
              options={cities}
              handleSelect={(selected: Option) => {
                setApplicantEducation({
                  ...applicantEducation,
                  city: selected.value,
                });
              }}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
            />
          </div>
          <div className="flex w-full flex-col gap-x-2 md:flex-row lg:w-1/2 lg:gap-x-6">
            <div className="flex w-full flex-col gap-y-2 md:w-1/2">
              <label>Start</label>
              <input
                type="date"
                name="startDate"
                onChange={handleChangeDate}
                value={
                  applicantEducation?.startDate
                    ? new Date(applicantEducation.startDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
              />
            </div>
            {!currentlyEnrolled && (
              <div className="flex w-full flex-col gap-y-2 md:w-1/2">
                <label>End</label>
                <input
                  type="date"
                  name="endDate"
                  disabled={currentlyEnrolled}
                  onChange={handleChangeDate}
                  value={
                    applicantEducation?.endDate
                      ? new Date(applicantEducation.endDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 focus:border-[#E6E6E6] focus:ring-0 focus:outline-none lg:p-3"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          <span>
            <CustomCheckbox
              label="Currently there"
              checked={currentlyEnrolled}
              onChange={(e) => setCurrentEnrolled(e.target.checked)}
            />
          </span>
        </div>

        <div className="mb-0 flex w-full flex-col gap-y-2 py-0">
          <label>Description</label>
          <RichTextEditor onChange={setDescription} value={description} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAddEducation}
            type="button"
            className="w-[197px] rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 py-2 font-medium text-purple-600"
          >
            Add
          </button>
          <button
            onClick={() => closeModal(modalId)}
            className="ml-4 w-[197px] rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 py-2 font-medium text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEducationModal;
