import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import SearchIcon from "../../components/common/SearchIcon.tsx";
import {
  FilterIcon,
  EmailIcon,
  Teams,
  Calendar,
  Work,
  Eye,
  Download,
} from "../../assets/icons.ts";
import {
  Person7,
  Referrer1,
  Referrer2,
  Referrer3,
} from "../../assets/images.ts";
import { FaCheck } from "react-icons/fa";
import { FC } from "react";
import ManageApplicantModal from "../../components/ui/ManageApplicantModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../../utils/constants.ts";


const ManageApplicant: FC = () => {
  const { openModal } = useModalStore(); // Access the modals state

  const handleOpenApplicantDetails = ()=>{
    openModal("manage-applicaint-modal");
};

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen">
      <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>

      <div className="w-full flex flex-col items-center">
        <div className="flex  flex-col md:flex-row md:justify-between w-[95%] bg-white rounded-[16px] mt-5">
          <div className="flex flex-col py-3 px-5">
            <div className="w-full flex flex-col">
              <h1 className="text-[#000000] text-[32px] font-bold leading-[28.8px]">
                Product Designer
              </h1>
              <p className="text-[#8E8E8E]">
                Open Hiring / Product Designer / Applied
              </p>
            </div>
            <div className="flex gap-4 py-5">
              <button className="bg-[#6438C2] text-white py-[9px] px-5 rounded-[10px]">
                All Applied
              </button>
              <button className="text-[#8E8E8E] py-[9px] px-5 rounded-[10px] border border-[#E6E6E6]">
                Schedule Interview
              </button>
            </div>
          </div>
          <div className="hidden sm:flex md:flex-col md:items-end md:py-4 items-center justify-between">
            <div className="flex justify-between items-center p-5 gap-4">
              <button className="text-white bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
                Close job
              </button>
              <button className="text-white bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
                Listed job
              </button>
            </div>
            <button className="min-w-[78px] flex gap-2 items-center py-3 px-9 rounded-[10px] border border-[#E6E6E6] mr-3">
              <img src={FilterIcon} alt="FilterIcon" />
              <p className="hidden md:block text-[#8E8E8E] font-extrabold ">
                Filter
              </p>
            </button>
          </div>
        </div>
        <div className="w-full sm:hidden flex items-center justify-between">
            <div className="flex justify-between items-center p-5 gap-4">
              <button className="text-white text-[14px] sm:text-base bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
                Close job
              </button>
              <button className="text-white text-[14px] sm:text-base bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
                Listed job
              </button>
            </div>
            <button className="min-w-[78px] flex gap-2 items-center py-3 px-9 rounded-[10px] border border-[#E6E6E6] mr-3">
              <img src={FilterIcon} alt="FilterIcon" />
              <p className="hidden md:block text-[#8E8E8E] font-extrabold ">
                Filter
              </p>
            </button>
          </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="flex w-[95%] flex-col md:flex-row my-5 justify-between">
          <div className="md:w-[60%] rounded-[16px] bg-white p-4">
            <div className="w-full flex flex-col gap-4">
              <p className="font-extrabold text-[20px] text-[#000000]">
                Application
              </p>
              <div className="w-full border border-[#E6E6E6] flex items-center px-2 py-[6px] rounded-[10px] gap-1">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search applicant here"
                  className="placeholder-text-[11px] placeholder-text-[#8E8E8E]  border-none bg-transparent focus:outline-none focus:ring-transparent"
                />
              </div>
              <div className="w-full flex gap-4 md:gap-12 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#FA4E09]"></div>
                  <p className="text-[#8E8E8E] text-[13px]">Viewed</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#6438C2]"></div>
                  <p className="text-[#8E8E8E] text-[13px]">Incoming message</p>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4">
                <button onClick={handleOpenApplicantDetails} className="bg-[#6438C2] rounded-[10px] text-white flex items-center justify-between p-3">
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <div className="absolute right-0 w-[10px] h-[10px] rounded-full bg-[#FA4E09]"></div>
                      <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center">
                        <img src={Person7} alt="Person7" className="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[13px]">A.S Abubakar</p>
                      <p className="text-[11px]">Applied, 5.12.2024</p>
                    </div>
                  </div>
                  <div className="w-[35px] h-[35px] bg-white rounded-full flex justify-center items-center">
                    <img src={EmailIcon} alt="EmailIcon" />
                  </div>
                </button>
                <button className="relative bg-[#F7F8FA] rounded-[10px] flex items-center justify-between p-3">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="absolute right-3 w-[10px] h-[10px] rounded-full bg-[#6438C2]"></div>
                      <div className="w-[40px] h-[40px] rounded-full">
                        <img src={Person7} alt="Person7" className="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[#000000] text-[13px]">James Opara</p>
                      <p className="text-[#8E8E8E] text-[11px]">
                        Applied, 5.12.2024
                      </p>
                    </div>
                  </div>
                  <div className="w-[35px] h-[35px] border border-[#E6E6E6] rounded-full flex justify-center items-center">
                    <img src={EmailIcon} alt="EmailIcon" />
                  </div>
                </button>
                <button className="relative bg-[#F7F8FA] rounded-[10px] flex items-center justify-between p-3">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="w-[40px] h-[40px] rounded-full">
                        <img src={Person7} alt="Person7" className="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[#000000] text-[13px]">James Opara</p>
                      <p className="text-[#8E8E8E] text-[11px]">
                        Applied, 5.12.2024
                      </p>
                    </div>
                  </div>
                  <div className="w-[35px] h-[35px] border border-[#E6E6E6] rounded-full flex justify-center items-center">
                    <img src={EmailIcon} alt="EmailIcon" />
                  </div>
                </button>
                <button className="relative bg-[#F7F8FA] rounded-[10px] flex items-center justify-between p-3">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="absolute right-3 w-[10px] h-[10px] rounded-full bg-[#6438C2]"></div>
                      <div className="w-[40px] h-[40px] rounded-full">
                        <img src={Person7} alt="Person7" className="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[#000000] text-[13px]">James Opara</p>
                      <p className="text-[#8E8E8E] text-[11px]">
                        Applied, 5.12.2024
                      </p>
                    </div>
                  </div>
                  <div className="w-[35px] h-[35px] border border-[#E6E6E6] rounded-full flex justify-center items-center">
                    <img src={EmailIcon} alt="EmailIcon" />
                  </div>
                </button>
                <button className="relative bg-[#F7F8FA] rounded-[10px] flex items-center justify-between p-3">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="absolute right-3 w-[10px] h-[10px] rounded-full bg-[#6438C2]"></div>
                      <div className="w-[40px] h-[40px] rounded-full">
                        <img src={Person7} alt="Person7" className="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[#000000] text-[13px]">James Opara</p>
                      <p className="text-[#8E8E8E] text-[11px]">
                        Applied, 5.12.2024
                      </p>
                    </div>
                  </div>
                  <div className="w-[35px] h-[35px] border border-[#E6E6E6] rounded-full flex justify-center items-center">
                    <img src={EmailIcon} alt="EmailIcon" />
                  </div>
                </button>
                <button className="relative bg-[#F7F8FA] rounded-[10px] flex items-center justify-between p-3">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <div className="w-[40px] h-[40px] rounded-full">
                        <img src={Person7} alt="Person7" className="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[#000000] text-[13px]">James Opara</p>
                      <p className="text-[#8E8E8E] text-[11px]">
                        Applied, 5.12.2024
                      </p>
                    </div>
                  </div>
                  <div className="w-[35px] h-[35px] border border-[#E6E6E6] rounded-full flex justify-center items-center">
                    <img src={EmailIcon} alt="EmailIcon" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="ml-[18px] flex flex-col bg-white rounded-[16px] overflow-hidden pb-5 mb-5">
            <div className="relative w-full bg-gradient-to-r from-[#6438C2] to-[#D9D9D9] h-[108px]">
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
      </div>
      <ManageApplicantModal modalId="manage-applicaint-modal"/>
    </div>
  );
};

export default ManageApplicant;


// Updated ManageApplicant Component
// import { FC, useState } from "react";
// import TopNavBar from "../../components/layouts/TopNavBar.tsx";
// import SearchIcon from "../../components/common/SearchIcon.tsx";
// import {
//   FilterIcon,
//   Teams,
//   Calendar,
//   Work,
//   Eye,
//   Download,
// } from "../../assets/icons.ts";
// import {
//   Person7,
//   Referrer1,
//   Referrer2,
//   Referrer3,
// } from "../../assets/images.ts";
// import ManageApplicantModal from "../../components/ui/ManageApplicantModal.tsx";
// import useModalStore from "../../store/modalStateStores.ts";
// import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../../utils/constants.ts";
// import ApplicantCard from "./applicantest/NetworkCard.tsx";
// import ReferrerSection from "./applicantest/referrersection.tsx";
// import ExperienceItem from "./applicantest/experienceitem.tsx";
// import InfoItem from "./applicantest/infoitem.tsx";
// import FileAttachment from "./applicantest/fileattachment.tsx";


// // Define types for our data
// interface Applicant {
//   id: string;
//   name: string;
//   date: string;
//   imageUrl: string;
//   isViewed?: boolean;
//   hasNewMessage?: boolean;
//   about?: string;
//   title?: string;
//   experiences?: {
//     title: string;
//     company?: string;
//     period: string;
//     description: string;
//   }[];
//   files?: {
//     name: string;
//     type: string;
//     size: string;
//   }[];
//   applicationInfo?: {
//     position: string;
//     date: string;
//     experience: string;
//   };
// }

// const ManageApplicant: FC = () => {
//   const { openModal } = useModalStore();
//   const [selectedApplicantId, setSelectedApplicantId] = useState<string>("applicant1");

//   // Mock data for demonstration
//   const applicants: Applicant[] = [
//     {
//       id: "applicant1",
//       name: "A.S Abubakar",
//       date: "5.12.2024",
//       imageUrl: Person7,
//       isViewed: true,
//       about: "I am a UI/UX designer skilled in creating user-friendly, visually appealing digital experiences. My expertise includes wireframing, prototyping, and conducting user research to ensure intuitive and responsive designs. Proficient in tools like Figma, Adobe XD, and Sketch, I focus on delivering accessible and seamless interfaces for both web and mobile. I strive to align design solutions with business goals while solving complex user challenges.",
//       title: "I am a Product designer based in yobe state",
//       experiences: [
//         {
//           title: "Senior UIUX Designer",
//           company: "KleenOs",
//           period: "(January 2023 - April 2023)",
//           description: "As a Senior Designer at KleenOs, I lead the design of intuitive and visually engaging user interfaces for the cleaning management platform. I collaborate with cross-functional teams to create seamless web and mobile experiences that meet both user needs and business goals."
//         },
//         {
//           title: "Senior UIUX Designer",
//           company: "KleenOs",
//           period: "(January 2023 - April 2023)",
//           description: "As a Senior Designer at KleenOs, I lead the design of intuitive and visually engaging user interfaces for the cleaning management platform. I collaborate with cross-functional teams to create seamless web and mobile experiences that meet both user needs and business goals."
//         }
//       ],
//       files: [
//         {
//           name: "AS-cv-updated",
//           type: "File Pdf",
//           size: "9.3 MB"
//         },
//         {
//           name: "AS-cv-updated",
//           type: "File Pdf",
//           size: "9.3 MB"
//         }
//       ],
//       applicationInfo: {
//         position: "Product Designer",
//         date: "19/12/2024 - 4:30 am",
//         experience: "Second Total Experience"
//       }
//     },
//     {
//       id: "applicant2",
//       name: "James Opara",
//       date: "5.12.2024",
//       imageUrl: Person7,
//       hasNewMessage: true
//     },
//     {
//       id: "applicant3",
//       name: "James Opara",
//       date: "5.12.2024",
//       imageUrl: Person7
//     },
//     {
//       id: "applicant4",
//       name: "James Opara",
//       date: "5.12.2024",
//       imageUrl: Person7,
//       hasNewMessage: true
//     },
//     {
//       id: "applicant5",
//       name: "James Opara",
//       date: "5.12.2024",
//       imageUrl: Person7,
//       hasNewMessage: true
//     },
//     {
//       id: "applicant6",
//       name: "James Opara",
//       date: "5.12.2024",
//       imageUrl: Person7
//     }
//   ];

//   const handleOpenApplicantDetails = (id: string) => {
//     setSelectedApplicantId(id);
//     openModal("manage-applicaint-modal");
//   };

//   const selectedApplicant = applicants.find(app => app.id === selectedApplicantId) || applicants[0];

//   return (
//     <div className="w-full bg-[#F7F8FA] min-h-screen">
//       <TopNavBar 
//         navItems={employerNavItems} 
//         navItemsMobile={employerNavItemsMobile} 
//         navbarItemsMap={employerNavBarItemMap}
//       />

//       {/* Rest of the component remains the same, but using our new components */}
//       <div className="w-full flex flex-col items-center">
//         {/* Job Header Section */}
//         <div className="flex flex-col md:flex-row md:justify-between w-[95%] bg-white rounded-[16px] mt-5">
//           {/* Left Side */}
//           <div className="flex flex-col py-3 px-5">
//             <div className="w-full flex flex-col">
//               <h1 className="text-[#000000] text-[32px] font-bold leading-[28.8px]">
//                 Product Designer
//               </h1>
//               <p className="text-[#8E8E8E]">
//                 Open Hiring / Product Designer / Applied
//               </p>
//             </div>
//             <div className="flex gap-4 py-5">
//               <button className="bg-[#6438C2] text-white py-[9px] px-5 rounded-[10px]">
//                 All Applied
//               </button>
//               <button className="text-[#8E8E8E] py-[9px] px-5 rounded-[10px] border border-[#E6E6E6]">
//                 Schedule Interview
//               </button>
//             </div>
//           </div>
//           {/* Right Side */}
//           <div className="hidden sm:flex md:flex-col md:items-end md:py-4 items-center justify-between">
//             <div className="flex justify-between items-center p-5 gap-4">
//               <button className="text-white bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
//                 Close job
//               </button>
//               <button className="text-white bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
//                 Listed job
//               </button>
//             </div>
//             <button className="min-w-[78px] flex gap-2 items-center py-3 px-9 rounded-[10px] border border-[#E6E6E6] mr-3">
//               <img src={FilterIcon} alt="FilterIcon" />
//               <p className="hidden md:block text-[#8E8E8E] font-extrabold">
//                 Filter
//               </p>
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile Buttons */}
//         <div className="w-full sm:hidden flex items-center justify-between">
//           <div className="flex justify-between items-center p-5 gap-4">
//             <button className="text-white text-[14px] sm:text-base bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
//               Close job
//             </button>
//             <button className="text-white text-[14px] sm:text-base bg-[#6438C2] py-[9px] px-5 rounded-[10px] transition-all duration-300 ease-out active:scale-95">
//               Listed job
//             </button>
//           </div>
//           <button className="min-w-[78px] flex gap-2 items-center py-3 px-9 rounded-[10px] border border-[#E6E6E6] mr-3">
//             <img src={FilterIcon} alt="FilterIcon" />
//             <p className="hidden md:block text-[#8E8E8E] font-extrabold">
//               Filter
//             </p>
//           </button>
//         </div>
//       </div>
      
//       {/* Main Content Area */}
//       <div className="w-full flex flex-col items-center">
//         <div className="flex w-[95%] flex-col md:flex-row my-5 justify-between">
//           {/* Left Section - Applicants List */}
//           <div className="md:w-[60%] rounded-[16px] bg-white p-4">
//             <div className="w-full flex flex-col gap-4">
//               <p className="font-extrabold text-[20px] text-[#000000]">
//                 Application
//               </p>
//               <div className="w-full border border-[#E6E6E6] flex items-center px-2 py-[6px] rounded-[10px] gap-1">
//                 <SearchIcon />
//                 <input
//                   type="text"
//                   placeholder="Search applicant here"
//                   className="placeholder-text-[11px] placeholder-text-[#8E8E8E] border-none bg-transparent focus:outline-none focus:ring-transparent"
//                 />
//               </div>
//               <div className="w-full flex gap-4 md:gap-12 items-center">
//                 <div className="flex items-center gap-2">
//                   <div className="w-[10px] h-[10px] rounded-full bg-[#FA4E09]"></div>
//                   <p className="text-[#8E8E8E] text-[13px]">Viewed</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-[10px] h-[10px] rounded-full bg-[#6438C2]"></div>
//                   <p className="text-[#8E8E8E] text-[13px]">Incoming message</p>
//                 </div>
//               </div>
//               <div className="w-full flex flex-col gap-4">
//                 {applicants.map((applicant) => (
//                   <ApplicantCard 
//                     key={applicant.id}
//                     applicant={{
//                       name: applicant.name,
//                       date: applicant.date,
//                       imageUrl: applicant.imageUrl,
//                       isViewed: applicant.isViewed,
//                       hasNewMessage: applicant.hasNewMessage,
//                       isSelected: applicant.id === selectedApplicantId
//                     }}
//                     onSelectApplicant={() => handleOpenApplicantDetails(applicant.id)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
          
//           {/* Right Section - Selected Applicant Details */}
//           <div className="ml-[18px] flex flex-col bg-white rounded-[16px] overflow-hidden pb-5 mb-5">
//             <div className="relative w-full bg-gradient-to-r from-[#6438C2] to-[#D9D9D9] h-[108px]">
//               <div className="absolute bottom-[-40%] left-5 w-[100px] h-[100px] bg-opacity-50">
//                 <img src={selectedApplicant.imageUrl} alt={selectedApplicant.name} className="w-full h-full" />
//               </div>
//             </div>
//             <div className="w-[95%] flex flex-col mx-auto mt-[50px] lg:mt-4">
//               <div className="flex flex-row flex-wrap lg:flex-col-reverse md:justify-between gap-4 md:mb-[35px]">
//                 <div className="flex flex-wrap justify-between gap-3">
//                   <div className="min-w-[247px] flex flex-col">
//                     <div className="relative text-[#000000] font-extrabold text-2xl">
//                       {selectedApplicant.name}
//                       {selectedApplicant.isViewed && (
//                         <div className="absolute left-[150px] top-0 w-[10px] h-[10px] rounded-full bg-[#FA4E09]"></div>
//                       )}
//                     </div>
//                     <p className="text-[#8E8E8E] text-[13px]">
//                       {selectedApplicant.title || "Product Designer"}
//                     </p>
//                   </div>
//                   <div className="flex gap-2 md:gap-[200px] md:justify-between">
//                     <button className="max-w-[194px] border border-[#6438C2] px-5 rounded-[10px] text-sm md:text-[16px] text-[#6438C2] font-medium">
//                       Watch my video Pitch
//                     </button>
//                     <button className="max-w-[194px] bg-[#6438C2] px-5 py-[9px] rounded-[10px] text-sm md:text-[16px] text-white font-bold">
//                       Schedule Interview
//                     </button>
//                   </div>
//                 </div>
                
//                 <ReferrerSection 
//                   title="Referrer"
//                   referrers={[Referrer1, Referrer2, Referrer2, Referrer3, Referrer1]}
//                   additionalCount={5}
//                 />
//               </div>
//               <hr className="border-[#E6E6E6]" />
//               <div className="flex flex-wrap lg:flex-nowrap lg:justify-between gap-4 mt-4">
//                 <div className="lg:w-[60%]">
//                   <div>
//                     <h2 className="font-medium text-[20px] text-[#000000]">
//                       About Me
//                     </h2>
//                     <p className="font-medium text-[13px] text-[#8E8E8E]">
//                       {selectedApplicant.about || "No information provided."}
//                     </p>
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <h2 className="font-medium text-[20px] text-[#000000]">
//                       Skills and experience
//                     </h2>
//                     {selectedApplicant.experiences?.map((exp, index) => (
//                       <ExperienceItem key={index} experience={exp} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="w-[100%] lg:max-w-[319px] h-fit bg-[#F7F8FA] rounded-[16px] p-4 mt-5 flex flex-col gap-4">
//                   <h2 className="text-[#000000] text-[20px] font-medium">
//                     Application Overview
//                   </h2>
                  
//                   <InfoItem 
//                     icon={Teams}
//                     title="Applied For"
//                     value={selectedApplicant.applicationInfo?.position || "Product Designer"}
//                   />
                  
//                   <InfoItem 
//                     icon={Calendar}
//                     title="Application date"
//                     value={selectedApplicant.applicationInfo?.date || "19/12/2024 - 4:30 am"}
//                   />
                  
//                   <InfoItem 
//                     icon={Work}
//                     title="Experience"
//                     value={selectedApplicant.applicationInfo?.experience || "Second Total Experience"}
//                   />
                  
//                   <div className="flex flex-col gap-4">
//                     <h2 className="text-[#000000] font-medium text-[18px]">
//                       File Attachment
//                     </h2>
                    
//                     {selectedApplicant.files?.map((file, index) => (
//                       <FileAttachment 
//                         key={index}
//                         file={file}
//                         eyeIcon={Eye}
//                         downloadIcon={Download}
//                         onView={() => console.log(`Viewing ${file.name}`)}
//                         onDownload={() => console.log(`Downloading ${file.name}`)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ManageApplicantModal modalId="manage-applicaint-modal"/>
//     </div>
//   );
// };

// export default ManageApplicant;