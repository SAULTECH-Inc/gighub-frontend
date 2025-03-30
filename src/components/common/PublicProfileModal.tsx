import React, { useEffect, useRef } from "react";
import {
  ASAbubakar,
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../assets/images";
import { Cancel } from "../../assets/icons";
import { ApplicantData } from "../../utils/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: ApplicantData;
}

const PublicProfileModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  person,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 lg:hidden">
      <div
        className="relative max-h-[80vh] w-[80%] max-w-[600px] overflow-y-auto rounded-[16px] bg-white shadow-lg scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex w-[100%] flex-col items-center rounded-[16px] bg-white"
          ref={modalRef}
        >
          <div className="flex w-[100%] flex-col items-center">
            <div className="relative flex h-[120px] w-full flex-col">
              <div className="flex h-[64px] w-full items-center justify-end rounded-tl-[16px] rounded-tr-[16px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] via-50% to-white pr-2">
                <img src={Cancel} alt="cancel" onClick={onClose} />
              </div>
              <img
                src={ASAbubakar}
                alt="ASAbubakar"
                className="absolute left-5 top-10 h-[60px] w-[60px]"
              />
              <div className="flex justify-between">
                <p className="pl-[90px] text-[20px] font-bold">
                  {person.lastName?.[0] ?? ""}.{person.middleName?.[0] ?? ""}{" "}
                  {person.firstName ?? ""}
                </p>
                <div className="hidden flex-col items-end px-2 sm:flex">
                  <p className="text-[13px] text-[#8E8E8E]">
                    {person.email} | {person.phoneNumber}
                  </p>
                  <div className="flex items-center gap-2 text-[13px] text-[#8E8E8E]">
                    <p className="">{person.address}</p>
                  </div>
                  <p className="text-[13px] text-[#8E8E8E]">
                    {person.city && person.city}
                    {person.city && person.country && ", "}
                    {person.country && person.country}
                    {(person.city || person.country) && " . "}
                    {400}k Connections
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col sm:hidden">
              <div className="flex flex-col px-2">
                <p className="text-[13px] text-[#8E8E8E]">
                  {person.email} | {person.phoneNumber}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[#8E8E8E]">
                  <p className="">{person.address}</p>
                </div>
                <p className="text-[13px] text-[#8E8E8E]">
                  {person.city && person.city}
                  {person.city && person.country && ", "}
                  {person.country && person.country}
                  {(person.city || person.country) && " . "}
                  {400}k Connections
                </p>
              </div>
            </div>
            <div className="w-[90%]">
              <div className="flex w-[90%] flex-col gap-2">
                <p className="pt-2 font-bold">{person.professionalTitle}</p>
                <p className="font-medium">About me</p>
                <p className="text-[13px] text-[#8E8E8E]">
                  {person.cv?.headline}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold">
                    Portfolio website:
                  </p>
                  <p className="text-[13px] text-[#6438C2]">
                    {"My Portfolio link"}
                  </p>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <p className="font-medium">Software Skills</p>
                  <div className="flex flex-wrap text-[13px] text-[#8E8E8E]"> 
                    {person.cv?.skills.join(", ")}
                  </div> 
                </div> */}
              </div>
            </div>
            <div className="flex w-[90%] flex-col items-center">
              <p className="w-full pt-2 font-bold">Job experience</p>
              <div className="mt-2 flex w-full items-center gap-3">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F7F8FA]">
                  <img src={Bagged} alt="Bagged" />
                </div>
                <div>
                  <p className="text-[13px] font-bold">
                    Bachelor of communiacaion
                  </p>
                  <p className="text-[13px] font-bold text-[#8E8E8E]">
                    Paystack Inc . 2021-2023
                  </p>
                </div>
              </div>
              <p className="my-4 w-full text-[13px] font-bold leading-[100%] text-[#8E8E8E]">
                As a Graphic Designer at Haris Computer, I create compelling
                visual designs for marketing, branding, and digital materials to
                effectively communicate the company's message.
              </p>
              <hr className="w-[40%] border-[#E6E6E6]" />
              <div className="mt-5 flex w-full items-center gap-3">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F7F8FA]">
                  <img src={Bagged} alt="Bagged" />
                </div>
                <div>
                  <p className="text-[13px] font-bold">
                    Bachelor of communiacaion
                  </p>
                  <p className="text-[13px] font-bold text-[#8E8E8E]">
                    Paystack Inc . 2021-2023
                  </p>
                </div>
              </div>
              <p className="my-4 w-full text-[13px] font-bold leading-[100%] text-[#8E8E8E]">
                As a Graphic Designer at Haris Computer, I create compelling
                visual designs for marketing, branding, and digital materials to
                effectively communicate the company's message.
              </p>

              <button className="w-[40%] rounded-[10px] bg-[#6438C2] py-2 text-[13px] text-white">
                See more
              </button>
              <hr className="my-5 w-full border-[#E6E6E6]" />
              <p className="w-full font-bold">Testimonies</p>
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <img src={Ellipse115} alt="Person1" />
                    </div>
                    <p className="text-[13px] font-bold">Bashir Umar</p>
                  </div>
                  <p className="text-[13px] text-[#8E8E8E]">2:20 Am</p>
                </div>
                <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                  <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
                    I really love his job, his that smart guy you may be
                    searching for
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <img src={Ellipse116} alt="Person1" />
                    </div>
                    <p className="text-[13px] font-bold">Bashir Umar</p>
                  </div>
                  <p className="text-[13px] text-[#8E8E8E]">2:20 Am</p>
                </div>
                <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                  <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
                    I really love his job, his that smart guy you may be
                    searching for
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <img src={Ellipse117} alt="Person1" />
                    </div>
                    <p className="text-[13px] font-bold">Bashir Umar</p>
                  </div>
                  <p className="text-[13px] text-[#8E8E8E]">2:20 Am</p>
                </div>
                <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                  <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
                    I really love his job, his that smart guy you may be
                    searching for
                  </p>
                </div>
              </div>
            </div>
            <button
              className="m-4 rounded-md bg-[#FA4E09] px-[15%] py-2 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileModal;
