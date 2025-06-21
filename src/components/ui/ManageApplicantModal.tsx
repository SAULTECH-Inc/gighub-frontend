import React from "react";
import { Teams, Calendar, Work, Eye, Download } from "../../assets/icons.ts";
import cancelMedium from "../../assets/icons/cancelMedium.svg";
import {
  Person7,
  Referrer1,
  Referrer2,
  Referrer3,
} from "../../assets/images.ts";
import { FaCheck } from "react-icons/fa";
import useModalStore from "../../store/modalStateStores.ts";

interface ModalProps {
  modalId: string;
}
const ManageApplicantModal: React.FC<ModalProps> = ({ modalId }) => {
  const { modals, closeModal } = useModalStore(); // Access the modals state
  const isOpen = modals[modalId];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="z-100 mb-5 mt-[20%] flex w-[90%] flex-col overflow-hidden rounded-[16px] bg-white pb-5 lg:ml-[18px] lg:w-full">
        <div className="relative h-[108px] w-full bg-gradient-to-r from-[#6438C2] to-[#D9D9D9]">
          <img
            className="absolute right-5 top-5 h-3 w-3 cursor-pointer"
            onClick={() => closeModal(modalId)}
            src={cancelMedium}
            alt="cancel"
          />
          <div className="absolute bottom-[-40%] left-5 h-[100px] w-[100px] bg-opacity-50">
            <img src={Person7} alt="Person7" className="h-full w-full" />
          </div>
        </div>
        <div className="mx-auto mt-[50px] flex w-[95%] flex-col lg:mt-4">
          <div className="flex flex-row flex-wrap gap-4 md:mb-[35px] md:justify-between lg:flex-col-reverse">
            <div className="flex flex-wrap justify-between gap-3">
              <div className="flex min-w-[247px] flex-col">
                <div className="relative text-2xl font-extrabold text-[#000000]">
                  A.S Abubakar
                  <div className="absolute left-[150px] top-0 h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                </div>
                <p className="text-[13px] text-[#8E8E8E]">
                  I am a Product designer based in yobe state
                </p>
              </div>
              <div className="flex gap-2 md:justify-between md:gap-[200px]">
                <button className="max-w-[194px] rounded-[10px] border border-[#6438C2] px-5 text-sm font-medium text-[#6438C2] md:text-[16px]">
                  Watch my video Pitch
                </button>
                <button className="max-w-[194px] rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-sm font-bold text-white md:text-[16px]">
                  Schedule Interview
                </button>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-4 rounded-[10px] bg-[#F4F7FA] px-4 py-1 md:min-w-[364px] lg:self-end">
              <p className="font-extrabold text-[#000000]">Referrer</p>
              <div className="flex gap-2">
                <img src={Referrer1} alt="Referrer1" />
                <img src={Referrer2} alt="Referrer2" />
                <img src={Referrer2} alt="Referrer3" />
                <img src={Referrer3} alt="Referrer4" />
                <img src={Referrer1} alt="Referrer5" />
                <p className="font-extrabold text-[#6438C2]">+5 </p>
                <span className="hidden font-extrabold text-[#6438C2] md:block">
                  more
                </span>
              </div>
            </div>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="mt-4 flex flex-wrap gap-4 lg:flex-nowrap lg:justify-between">
            <div className="lg:w-[60%]">
              <div>
                <h2 className="text-[20px] font-medium text-[#000000]">
                  About Me
                </h2>
                <p className="text-[13px] font-medium text-[#8E8E8E]">
                  I am a UI/UX designer skilled in creating user-friendly,
                  visually appealing digital experiences. My expertise includes
                  wireframing, prototyping, and conducting user research to
                  ensure intuitive and responsive designs. Proficient in tools
                  like Figma, Adobe XD, and Sketch, I focus on delivering
                  accessible and seamless interfaces for both web and mobile. I
                  strive to align design solutions with business goals while
                  solving complex user challenges.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[20px] font-medium text-[#000000]">
                  Skills and experience
                </h2>
                <div className="flex items-start gap-2 pl-4">
                  <div className="pt-[10px]">
                    <div className="flex h-[13px] w-[13px] flex-col items-center justify-center rounded-full bg-[#6438C2]">
                      <FaCheck className="h-[5px] w-[5px] fill-white" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="">
                      <h3 className="flex items-center text-[20px] font-medium text-[#000000]">
                        Senior UIUX Designer - KleenOs
                      </h3>
                      <p className="text-[13px] font-medium text-[#8E8E8E]">
                        (January 2023 - April 2023)
                      </p>
                    </div>
                    <p className="text-[13px] font-medium text-[#8E8E8E]">
                      As a Senior Designer at KleenOs, I lead the design of
                      intuitive and visually engaging user interfaces for the
                      cleaning management platform. I collaborate with
                      cross-functional teams to create seamless web and mobile
                      experiences that meet both user needs and business goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pl-4">
                  <div className="pt-[10px]">
                    <div className="flex h-[13px] w-[13px] flex-col items-center justify-center rounded-full bg-[#6438C2]">
                      <FaCheck className="h-[5px] w-[5px] fill-white" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="">
                      <h3 className="flex items-center text-[20px] font-medium text-[#000000]">
                        Senior UIUX Designer - KleenOs
                      </h3>
                      <p className="text-[13px] font-medium text-[#8E8E8E]">
                        (January 2023 - April 2023)
                      </p>
                    </div>
                    <p className="text-[13px] font-medium text-[#8E8E8E]">
                      As a Senior Designer at KleenOs, I lead the design of
                      intuitive and visually engaging user interfaces for the
                      cleaning management platform. I collaborate with
                      cross-functional teams to create seamless web and mobile
                      experiences that meet both user needs and business goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex h-fit w-[100%] flex-col gap-4 rounded-[16px] bg-[#F7F8FA] p-4 lg:max-w-[319px]">
              <h2 className="text-[20px] font-medium text-[#000000]">
                Application Overview
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                  <img src={Teams} alt="Teams" />
                </div>
                <div>
                  <h3 className="text-[13px] text-[#000000]">Applied For</h3>
                  <p className="text-[#8E8E8E]">Product Designer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                  <img src={Calendar} alt="Calendar" />
                </div>
                <div>
                  <h3 className="text-[13px] text-[#000000]">
                    Application date
                  </h3>
                  <p className="text-[#8E8E8E]">19/12/2024 - 4:30 am</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                  <img src={Work} alt="Work" />
                </div>
                <div>
                  <h3 className="text-[13px] text-[#000000]">Experience</h3>
                  <p className="text-[#8E8E8E]">Second Total Experience</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-[18px] font-medium text-[#000000]">
                  File Attachment
                </h2>
                <div className="flex justify-between rounded-[10px] bg-white px-4 py-2">
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E8E]">
                      AS-cv-updated
                    </p>
                    <p className="text-[13px] font-medium text-[#8E8E8E]">
                      File Pdf - 9.3 MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={Eye} alt="Eye Icon" className="h-6 w-6" />
                    <img
                      src={Download}
                      alt="Download Icon"
                      className="h-6 w-6"
                    />
                  </div>
                </div>
                <div className="flex justify-between rounded-[10px] bg-white px-4 py-2">
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E8E]">
                      AS-cv-updated
                    </p>
                    <p className="text-[13px] font-medium text-[#8E8E8E]">
                      File Pdf - 9.3 MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={Eye} alt="Eye Icon" className="h-6 w-6" />
                    <img
                      src={Download}
                      alt="Download Icon"
                      className="h-6 w-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageApplicantModal;
