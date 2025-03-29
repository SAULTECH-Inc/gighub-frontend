import React from "react";
import {
  Attachment,
  ImageUpload,
  Referrer1,
  Worksample1,
  Worksample2,
} from "../../../assets/images";
import { FaHeart } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Chatbob, Retweet } from "../../../assets/icons";
import PublicProfileModal from "../../common/PublicProfileModal";
import { useState } from "react";


const person = {
  firstname: "Abubakar",
  lastname: "Aasas",
  middlename: "Sasas",
  professionalTitle: "UI/UX Designer",
  email: 'Asabubakar@gmail.com',
  address: "Street Road, street road",
  phone: '07011079676',
  portfolio: "inspire.com",
  bio: "I am a UI/UX designer skilled in creating user-friendly, visually appealing digital experiences. My expertise includes wireframing, prototyping, and conducting user research to ensure intuitive and responsive designs. Proficient in tools like Figma, Adobe XD, and Sketch, I focus on delivering accessible and seamless interfaces for both web and mobile. I strive to align design solutions with business goals while solving complex user challenges.",
  numberOfConnections: 500,
  state: "Lagos",
  country: "Nigeria",
  skills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research", "Figma", "Adobe XD", "Sketch"],
  // image: "ASAbubakar",
}

const PublicProfile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
      <div className="flex gap-5 py-[10px] px-3 w-[100%] max-w-[675px] bg-white rounded-[16px]">
          <button
            type="button"
            className="bg-[#6E4AED] text-white text-[13px] lg:text-[16px] py-1 lg:py-3 px-[20px] lg:w-[35%] rounded-[10px]"
          >
            Worksample
          </button>
          <button
            type="button"
            className="bg-[#F7F8FA] py-1 lg:py-3 text-[13px] lg:text-[16px] px-[20px] lg:px-[47px] rounded-[10px]"
          >
            Resume
          </button>
        </div>
        <div className="w-[100%] max-w-[675px] flex items-center justify-center">
          <div className="lg:hidden mt-2 flex flex-col items-center gap-2 w-[100%] pt-2 px-2 rounded-[10px] bg-[#6438C2] cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="w-full flex items-center gap-2 ">
              <img
                src={Referrer1}
                alt="Referrer1"
                className="w-[40px] h-[40px]"
              />
              <div>
              <p className="text-white text-[10px]">A.S Abubakar</p>
              <p className='text-white  text-[10px]'>UI/UX Designer</p>
              </div>
            </div>
            <p className="text-white text-[13px]">Click for more</p>
          </div>
          <PublicProfileModal isOpen={isModalOpen} onClose={onClose} person={person} />
        </div>
        <div className="bg-white w-[100%] my-2 rounded-[16px] max-w-[675px] flex flex-col items-center py-4">
          <div className="w-[96%]  ">
            <img src={Worksample1} alt="Worksample1" />
          </div>
          <div className="flex justify-between items-center w-[96%] mt-5">
            <div className="w-[90%] flex gap-5">
              <div className="flex items-center gap-2">
                <FaHeart className="w-[25px] h-[30px] fill-red-600 cursor-pointer" />
                <p className="text-[10px]">2</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={Chatbob} alt="Chatbob" className="cursor-pointer" />
                <p className="text-[10px]">32</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={Retweet} alt="Retweet" className="cursor-pointer" />
                <p className="text-[10px]">24567</p>
              </div>
            </div>
            <HiOutlineDotsHorizontal className="w-[30px] h-[30px] fill-[#8E8E8E] mx-3" />
          </div>
          <p className="text-[#8E8E8E] text-[13px] w-[94%] my-5 leading-[100%]">
            Introducing FinestBook, a cutting-edge solution designed to streamline
            [specific company function] for FinestBook. This app enhances
            efficiency by [key feature/benefit, e.g., automating workflows,
            providing real-time analytics], tailored to meet the company’s unique
            needs. With an intuitive interface and seamless integration, it
            empowers teams to achieve more.
          </p>
          <hr className="border-[#E6E6E6] w-[96%]" />
          <div className="w-[96%] flex items-center gap-2 my-4">
            <div>
              <img
                src={Referrer1}
                alt="Referrer1"
                className="w-[40px] h-[40px]"
              />
            </div>
            <div className="flex items-center h-[41px] bg-[#F7F8FA] rounded-[10px] p-2 gap-5 w-[96%]">
              <input
                type="text"
                className="w-[90%] border-none bg-transparent focus:ring-0 placeholder:text-[#8E8E8E] placeholder:text-[13px]"
                placeholder="Write your comment"
              />
              <div className="flex space-x-4">
                <label className="cursor-pointer text-2xl">
                  <img src={Attachment} alt="Attachment" />
                  <input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="hidden"
                  />
                </label>
                <label className="cursor-pointer text-2xl">
                  <img src={ImageUpload} alt="ImageUpload" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-[100%] rounded-[16px] max-w-[675px] flex flex-col items-center py-4">
          <div className="w-[96%]">
            <img src={Worksample2} alt="Worksample2" />
          </div>
          <div className="flex justify-between items-center w-[96%] mt-5">
            <div className="w-[90%] flex gap-5">
              <div className="flex items-center gap-2">
                <FaHeart className="w-[25px] h-[30px] fill-red-600 cursor-pointer" />
                <p className="text-[10px]">2</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={Chatbob} alt="Chatbob" className="cursor-pointer" />
                <p className="text-[10px]">32</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={Retweet} alt="Retweet" className="cursor-pointer" />
                <p className="text-[10px]">24567</p>
              </div>{" "}
            </div>
            <HiOutlineDotsHorizontal className="w-[30px] h-[30px] fill-[#8E8E8E] mx-3" />
          </div>
          <p className="text-[#8E8E8E] text-[13px] w-[94%] my-5 leading-[100%]">
            Introducing FinestBook, a cutting-edge solution designed to streamline
            [specific company function] for FinestBook. This app enhances
            efficiency by [key feature/benefit, e.g., automating workflows,
            providing real-time analytics], tailored to meet the company’s unique
            needs. With an intuitive interface and seamless integration, it
            empowers teams to achieve more.
          </p>
          <hr className="border-[#E6E6E6] w-[96%]" />
          <div className="w-[96%] flex items-center gap-2 my-4">
            <div>
              <img
                src={Referrer1}
                alt="Referrer1"
                className="w-[40px] h-[40px]"
              />
            </div>
            <div className="flex items-center h-[41px] bg-[#F7F8FA] rounded-[10px] p-2 gap-5 w-[96%]">
              <input
                type="text"
                className="w-[90%] border-none bg-transparent focus:ring-0 placeholder:text-[#8E8E8E] placeholder:text-[13px]"
                placeholder="Write your comment"
              />
              <div className="flex space-x-4">
                <label className="cursor-pointer text-2xl">
                  <img src={Attachment} alt="Attachment" />
                  <input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="hidden"
                  />
                </label>
                <label className="cursor-pointer text-2xl">
                  <img src={ImageUpload} alt="ImageUpload" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default PublicProfile;
