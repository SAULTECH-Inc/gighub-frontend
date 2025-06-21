import React from "react";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";
import CustomSelect from "../../../components/common/CustomSelect.tsx";
import { InterviewScheduleDetails, Option } from "../../../utils/types";
const interviewTypes: Option[] = [
  { label: "In-person", value: "in-person" },
  { label: "Virtual", value: "virtual-meeting" },
  { label: "Phone Call", value: "phone-call" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Assessment", value: "assessment" },
  { label: "Group Interview", value: "group-interview" },
];
const InterviewStepTwo: React.FC = () => {
  const { nextStep, prevStep, interviewDetails, setInterviewDetails } =
    useScheduleInterview();
  const [selectedInterviewType, setSelectedInterviewType] =
    React.useState<Option>(interviewTypes[1]);
  const handleNextStep = () => {
    nextStep();
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white px-2 py-2">
        <div className="flex w-full flex-col gap-2 sm:w-[95%]">
          <div className="flex w-full flex-col gap-x-2 gap-y-4">
            <div className="flex w-full flex-col gap-2">
              <label className="text-sm text-[#000000]">
                Select Interview Type
              </label>
              <CustomSelect
                options={interviewTypes}
                placeholder="Select Interview Type"
                className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-left text-sm"
                onChange={(option) => {
                  setSelectedInterviewType(option);
                  setInterviewDetails({
                    ...interviewDetails,
                    interviewType: option.value,
                  } as InterviewScheduleDetails);
                }}
              />
            </div>
            {selectedInterviewType.value === "virtual-meeting" && (
              <div className="flex w-full flex-col gap-2">
                <label>Virtual Meeting</label>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <CustomSelect
                    options={[
                      { label: "Zoom", value: "zoom" },
                      { label: "Google Meet", value: "google-meet" },
                      { label: "Skype", value: "skype" },
                      { label: "Microsoft Teams", value: "microsoft-teams" },
                    ]}
                    placeholder="Select Interview Platform"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-left text-sm"
                    onChange={(option) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewPlatform: option.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Enter Interview Link"
                    value={interviewDetails?.interviewLink}
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewLink: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
              </div>
            )}
            {selectedInterviewType.value === "phone-call" && (
              <div className="flex w-full flex-col gap-2">
                <label>Phone Call</label>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={interviewDetails?.interviewerPhoneNumber1}
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewerPhoneNumber1: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Alternative Phone Number"
                    value={interviewDetails?.interviewerPhoneNumber2}
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewerPhoneNumber2: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
              </div>
            )}
            {selectedInterviewType.value === "hybrid" && (
              <div className="flex w-full flex-col gap-x-2 gap-y-4">
                <label>Hybrid Meeting</label>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <CustomSelect
                    options={[
                      { label: "Zoom", value: "zoom" },
                      { label: "Google Meet", value: "google-meet" },
                      { label: "Skype", value: "skype" },
                      { label: "Microsoft Teams", value: "microsoft-teams" },
                    ]}
                    placeholder="Select Interview Platform"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-left text-sm"
                    onChange={(option) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewPlatform: option.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Enter Interview Link"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewLink}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewLink: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewerPhoneNumber1}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewerPhoneNumber1: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Alternative Phone Number"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewerPhoneNumber2}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewerPhoneNumber2: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="State"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewState}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewState: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewCity}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewCity: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="Address"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewAddress}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewAddress: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
              </div>
            )}
            {selectedInterviewType.value === "in-person" && (
              <div className="flex w-full flex-col gap-x-2 gap-y-4">
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewerPhoneNumber1}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewerPhoneNumber1: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Alternative Phone Number"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewerPhoneNumber2}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewerPhoneNumber2: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="State"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewState}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewState: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewCity}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewCity: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="Address"
                    className="h-[50px] w-full rounded-[10px] border border-[#E6E6E6] px-4 py-2 text-sm focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                    value={interviewDetails?.interviewAddress}
                    onChange={(e) => {
                      setInterviewDetails({
                        ...interviewDetails,
                        interviewAddress: e.target.value,
                      } as InterviewScheduleDetails);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-2 my-2 flex w-[96%] max-w-[900px] justify-end gap-6 text-sm">
        <button
          className="w-[35%] self-end rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] py-[8px] sm:w-[29%]"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="w-[35%] rounded-[15px] bg-[#6438C2] py-[8px] text-white sm:w-[29%]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default InterviewStepTwo;
