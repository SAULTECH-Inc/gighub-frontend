import React, { useEffect, useRef } from "react";
import { ASAbubakar, Bagged, Ellipse115, Ellipse116, Ellipse117 } from "../../assets/images";
import { Cancel } from "../../assets/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
    person: {
      firstname: string;
      lastname: string;
      middlename: string;
      // image: string;
      email: string;
      phone: string;
      professionalTitle: string;
      state: string;
      country: string;
      numberOfConnections: number;
      address: string;
      portfolio: string;
      bio: string;
      skills: string[];
    };  
}

const PublicProfileModal: React.FC<ModalProps> = ({ isOpen, onClose, person: {
    firstname,
    lastname,
    middlename,
    email,
    phone,
    professionalTitle,
    state,
    country,
    numberOfConnections,
    address,
    portfolio,
    bio,
    skills,
  },
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
    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white rounded-[16px] max-w-[600px] shadow-lg w-[80%] relative max-h-[80vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
         <div className="sticky top-0 z-10 flex flex-col items-center w-[100%] bg-white rounded-[16px]" ref={modalRef} >
        <div className="w-[100%] flex flex-col items-center">
          <div className="w-full relative flex flex-col h-[120px]">
            <div className="w-full h-[64px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] to-white via-50% rounded-tr-[16px] rounded-tl-[16px] flex items-center justify-end pr-2"><img src={Cancel} alt="cancel" onClick={onClose} /></div>
            <img
              src={ASAbubakar}
              alt="ASAbubakar"
              className="absolute w-[60px] h-[60px] top-10 left-5"
            />
           <div className="flex justify-between">
           <p className="font-bold text-[20px] pl-[90px]">
              {lastname[0]}.{middlename[0]} {firstname}
            </p>
            <div className="hidden sm:flex flex-col px-2 items-end">
            <p className="text-[#8E8E8E] text-[13px]">{email} | {phone}</p>
            <div className="flex gap-2 items-center text-[#8E8E8E] text-[13px]"><p className="">{address}</p></div> 
            <p className="text-[#8E8E8E] text-[13px]">
              {state}, {country} . {numberOfConnections}k Connections
            </p>
            </div>
           </div>
          </div>
          <div className="w-full flex flex-col sm:hidden">
            <div className="flex flex-col px-2 ">
            <p className="text-[#8E8E8E] text-[13px]">{email} | {phone}</p>
            <div className="flex gap-2 items-center text-[#8E8E8E] text-[13px]"><p className="">{address}</p></div> 
            <p className="text-[#8E8E8E] text-[13px]">
              {state}, {country} . {numberOfConnections}k Connections
            </p>
            </div>
           </div>
        <div className="w-[90%]">
        <div className="w-[90%] flex flex-col gap-2">
          <p className="font-bold pt-2">{professionalTitle}</p>   
            <p className="font-medium">About me</p>
            <p className="text-[#8E8E8E] text-[13px]">{bio}</p>
            <div className="flex gap-2 items-center">
            <p className="text-[13px] font-semibold">Portfolio website:</p>
            <p className="text-[#6438C2] text-[13px]">{portfolio}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Software Skills</p>
            <div className="text-[#8E8E8E] text-[13px] flex flex-wrap">
              {skills.join(", ")}
            </div>
          </div>
          </div>
        </div>
        <div className="w-[90%] flex flex-col items-center  ">
                 <p className="w-full font-bold pt-2">Job experience</p>
                 <div className="w-full flex gap-3 items-center mt-2">
                   <div className="w-[50px] h-[50px] rounded-full bg-[#F7F8FA] flex justify-center items-center">
                     <img src={Bagged} alt="Bagged" />
                   </div>
                   <div>
                     <p className="text-[13px] font-bold">Bachelor of communiacaion</p>
                     <p className="text-[#8E8E8E] text-[13px] font-bold">
                       Paystack Inc . 2021-2023
                     </p>
                   </div>
                 </div>
                 <p className="w-full text-[13px]  text-[#8E8E8E] leading-[100%] font-bold my-4">
                   As a Graphic Designer at Haris Computer, I create compelling visual
                   designs for marketing, branding, and digital materials to
                   effectively communicate the company's message.
                 </p>
                 <hr className="w-[40%] border-[#E6E6E6]" />
                 <div className="w-full flex gap-3 items-center mt-5">
                   <div className="w-[50px] h-[50px] rounded-full bg-[#F7F8FA] flex justify-center items-center">
                     <img src={Bagged} alt="Bagged" />
                   </div>
                   <div>
                     <p className="text-[13px] font-bold">Bachelor of communiacaion</p>
                     <p className="text-[#8E8E8E] text-[13px] font-bold">
                       Paystack Inc . 2021-2023
                     </p>
                   </div>
                 </div>
                 <p className="w-full text-[13px] text-[#8E8E8E] leading-[100%] font-bold my-4">
                   As a Graphic Designer at Haris Computer, I create compelling visual
                   designs for marketing, branding, and digital materials to
                   effectively communicate the company's message.
                 </p>
       
                 <button className="bg-[#6438C2] w-[40%] py-2 text-white text-[13px] rounded-[10px]">
                   See more
                 </button>
                 <hr className="my-5 w-full border-[#E6E6E6]" />
                 <p className="w-full font-bold">Testimonies</p>
                 <div className="flex flex-col">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="flex justify-center items-center">
                         <img src={Ellipse115} alt="Person1" />
                       </div>
                       <p className="text-[13px] font-bold">Bashir Umar</p>
                     </div>
                     <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                   </div>
                   <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                     <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                       I really love his job, his that smart guy you may be searching
                       for
                     </p>
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="flex justify-center items-center">
                         <img src={Ellipse116} alt="Person1" />
                       </div>
                       <p className="text-[13px] font-bold">Bashir Umar</p>
                     </div>
                     <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                   </div>
                   <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                     <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                       I really love his job, his that smart guy you may be searching
                       for
                     </p>
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="flex justify-center items-center">
                         <img src={Ellipse117} alt="Person1" />
                       </div>
                       <p className="text-[13px] font-bold">Bashir Umar</p>
                     </div>
                     <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                   </div>
                   <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                     <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                       I really love his job, his that smart guy you may be searching
                       for
                     </p>
                   </div>
                 </div>
               </div>
        <button
          className="m-4 px-[15%] py-2 bg-[#FA4E09] text-white rounded-md"
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
