import React from "react";
import useModalStore from "../../redux/modalStateStores";
import { Teams, Calendar, Work, Eye, Download } from "../../assets/icons.ts";
import cancelMedium from "../../assets/icons/cancelMedium.svg";
import {
  Person7,
  Referrer1,
  Referrer2,
  Referrer3,
} from "../../assets/images.ts";
import { FaCheck } from "react-icons/fa";

interface ModalProps {
  modalId: string;
}
const ManageApplicantModal: React.FC<ModalProps> = ({ modalId }) => {
  const { modals, closeModal } = useModalStore(); // Access the modals state
  const isOpen = modals[modalId];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="mt-[20%] w-[90%] lg:w-full lg:ml-[18px] flex flex-col bg-white rounded-[16px] overflow-hidden pb-5 mb-5 z-100">
            <div className="relative w-full bg-gradient-to-r from-[#6438C2] to-[#D9D9D9] h-[108px]">
                  <img className="absolute top-5 right-5 h-3 w-3 cursor-pointer" onClick={() => closeModal(modalId)} src={cancelMedium} alt="cancel"/>
              <div className="absolute bottom-[-40%] left-5 w-[100px] h-[100px] bg-opacity-50">
                <img src={Person7} alt="Person7" className="w-full h-full" />
              </div>
            </div>
            <div className="w-[95%] flex flex-col mx-auto mt-[50px] lg:mt-4">
              <div className="flex flex-row flex-wrap lg:flex-col-reverse md:justify-between gap-4 md:mb-[35px]">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="min-w-[247px] flex flex-col">
                    <div className="relative text-[#000000] font-extrabold text-2xl">
                      A.S Abubakar
                      <div className="absolute left-[150px] top-0 w-[10px] h-[10px] rounded-full bg-[#FA4E09]"></div>
                    </div>
                    <p className="text-[#8E8E8E]  text-[13px]">
                      I am a Product designer based in yobe state
                    </p>
                  </div>
                  <div className="flex gap-2 md:gap-[200px] md:justify-between">
                  <button className="max-w-[194px] border border-[#6438C2] px-5 rounded-[10px] text-sm md:text-[16px] text-[#6438C2] font-medium">
                      Watch my video Pitch
                    </button>
                    <button className="max-w-[194px] bg-[#6438C2] px-5 py-[9px] rounded-[10px] text-sm md:text-[16px] text-white font-bold">
                      Schedule Interview
                    </button>
                  </div>
                </div>
                <div className="md:min-w-[364px] mb-4 bg-[#F4F7FA] rounded-[10px] px-4 py-1 flex flex-wrap lg:self-end items-center gap-4">
                  <p className="text-[#000000] font-extrabold">Referrer</p>
                  <div className="flex gap-2">
                    <img src={Referrer1} alt="Referrer1" />
                    <img src={Referrer2} alt="Referrer2" />
                    <img src={Referrer2} alt="Referrer3" />
                    <img src={Referrer3} alt="Referrer4" />
                    <img src={Referrer1} alt="Referrer5" />
                    <p className="text-[#6438C2] font-extrabold">+5 </p>
                    <span className="hidden md:block text-[#6438C2] font-extrabold">
                      more
                    </span>
                  </div>
                </div>
              </div>
              <hr className="border-[#E6E6E6]" />
              <div className="flex flex-wrap lg:flex-nowrap lg:justify-between gap-4 mt-4">
                <div className="lg:w-[60%]">
                  <div>
                    <h2 className="font-medium text-[20px] text-[#000000]">
                      About Me
                    </h2>
                    <p className="font-medium text-[13px] text-[#8E8E8E]">
                      I am a UI/UX designer skilled in creating user-friendly,
                      visually appealing digital experiences. My expertise
                      includes wireframing, prototyping, and conducting user
                      research to ensure intuitive and responsive designs.
                      Proficient in tools like Figma, Adobe XD, and Sketch, I
                      focus on delivering accessible and seamless interfaces for
                      both web and mobile. I strive to align design solutions
                      with business goals while solving complex user challenges.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium text-[20px] text-[#000000]">
                      Skills and experience
                    </h2>
                    <div className="pl-4 flex items-start gap-2">
                      <div className="pt-[10px]">
                        <div className="w-[13px] h-[13px] flex flex-col items-center justify-center bg-[#6438C2] rounded-full">
                          <FaCheck className="fill-white w-[5px] h-[5px]" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <h3 className="font-medium text-[20px] text-[#000000] flex items-center">
                            Senior UIUX Designer - KleenOs
                          </h3>
                          <p className="font-medium text-[13px] text-[#8E8E8E]">
                            (January 2023 - April 2023)
                          </p>
                        </div>
                        <p className="font-medium text-[13px] text-[#8E8E8E]">
                          As a Senior Designer at KleenOs, I lead the design of
                          intuitive and visually engaging user interfaces for
                          the cleaning management platform. I collaborate with
                          cross-functional teams to create seamless web and
                          mobile experiences that meet both user needs and
                          business goals.
                        </p>
                      </div>
                    </div>
                    <div className="pl-4 flex items-start gap-2">
                      <div className="pt-[10px]">
                        <div className="w-[13px] h-[13px] flex flex-col items-center justify-center bg-[#6438C2] rounded-full">
                          <FaCheck className="fill-white w-[5px] h-[5px]" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <h3 className="font-medium text-[20px] text-[#000000] flex items-center">
                            Senior UIUX Designer - KleenOs
                          </h3>
                          <p className="font-medium text-[13px] text-[#8E8E8E]">
                            (January 2023 - April 2023)
                          </p>
                        </div>
                        <p className="font-medium text-[13px] text-[#8E8E8E]">
                          As a Senior Designer at KleenOs, I lead the design of
                          intuitive and visually engaging user interfaces for
                          the cleaning management platform. I collaborate with
                          cross-functional teams to create seamless web and
                          mobile experiences that meet both user needs and
                          business goals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[100%] lg:max-w-[319px] h-fit bg-[#F7F8FA] rounded-[16px] p-4 mt-5 flex flex-col gap-4">
                  <h2 className="text-[#000000] text-[20px] font-medium">
                    Application Overview
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="border border-[#E6E6E6] rounded-full w-10 h-10 flex justify-center items-center">
                      <img src={Teams} alt="Teams" />
                    </div>
                    <div>
                      <h3 className="text-[#000000] text-[13px]">
                        Applied For
                      </h3>
                      <p className="text-[#8E8E8E]">Product Designer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="border border-[#E6E6E6] rounded-full w-10 h-10 flex justify-center items-center">
                      <img src={Calendar} alt="Calendar" />
                    </div>
                    <div>
                      <h3 className="text-[#000000] text-[13px]">
                        Application date
                      </h3>
                      <p className="text-[#8E8E8E]">19/12/2024 - 4:30 am</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="border border-[#E6E6E6] rounded-full w-10 h-10 flex justify-center items-center">
                      <img src={Work} alt="Work" />
                    </div>
                    <div>
                      <h3 className="text-[#000000] text-[13px]">Experience</h3>
                      <p className="text-[#8E8E8E]">Second Total Experience</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-[#000000] font-medium text-[18px]">
                      File Attachment
                    </h2>
                    <div className="bg-white rounded-[10px] py-2 px-4 flex justify-between">
                      <div>
                        <p className="text-[#8E8E8E] text-[13px] font-medium">
                          AS-cv-updated
                        </p>
                        <p className="text-[#8E8E8E] text-[13px] font-medium">
                          File Pdf - 9.3 MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={Eye} alt="Eye Icon" className="w-6 h-6" />
                        <img
                          src={Download}
                          alt="Download Icon"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                    <div className="bg-white rounded-[10px] py-2 px-4 flex justify-between">
                      <div>
                        <p className="text-[#8E8E8E] text-[13px] font-medium">
                          AS-cv-updated
                        </p>
                        <p className="text-[#8E8E8E] text-[13px] font-medium">
                          File Pdf - 9.3 MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={Eye} alt="Eye Icon" className="w-6 h-6" />
                        <img
                          src={Download}
                          alt="Download Icon"
                          className="w-6 h-6"
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
