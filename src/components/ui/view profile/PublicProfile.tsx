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
import { ApplicantData } from "../../../utils/types";

const PublicProfile: React.FC<{ person: ApplicantData }> = ({ person }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-[100%] max-w-[675px] gap-5 rounded-[16px] bg-white px-3 py-[10px]">
          <button
            type="button"
            className="rounded-[10px] bg-[#6E4AED] px-[20px] py-1 text-[13px] text-white lg:w-[35%] lg:py-3 lg:text-[16px]"
          >
            Worksample
          </button>
          <button
            type="button"
            className="rounded-[10px] bg-[#F7F8FA] px-[20px] py-1 text-[13px] lg:px-[47px] lg:py-3 lg:text-[16px]"
          >
            Resume
          </button>
        </div>
        <div className="flex w-[100%] max-w-[675px] items-center justify-center">
          <div
            className="mt-2 flex w-[100%] cursor-pointer flex-col items-center gap-2 rounded-[10px] bg-[#6438C2] px-2 pt-2 lg:hidden"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex w-full items-center gap-2">
              <img
                src={Referrer1}
                alt="Referrer1"
                className="h-[40px] w-[40px]"
              />
              <div>
                <p className="text-[10px] text-white">A.S Abubakar</p>
                <p className="text-[10px] text-white">UI/UX Designer</p>
              </div>
            </div>
            <p className="text-[13px] text-white">Click for more</p>
          </div>
          <PublicProfileModal
            isOpen={isModalOpen}
            onClose={onClose}
            person={person}
          />
        </div>
        <div className="my-2 flex w-[100%] max-w-[675px] flex-col items-center rounded-[16px] bg-white py-4">
          <div className="w-[96%]">
            <img src={Worksample1} alt="Worksample1" />
          </div>
          <div className="mt-5 flex w-[96%] items-center justify-between">
            <div className="flex w-[90%] gap-5">
              <div className="flex items-center gap-2">
                <FaHeart className="h-[30px] w-[25px] cursor-pointer fill-red-600" />
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
            <HiOutlineDotsHorizontal className="mx-3 h-[30px] w-[30px] fill-[#8E8E8E]" />
          </div>
          <p className="my-5 w-[94%] text-[13px] leading-[100%] text-[#8E8E8E]">
            Introducing FinestBook, a cutting-edge solution designed to
            streamline [specific company function] for FinestBook. This app
            enhances efficiency by [key feature/benefit, e.g., automating
            workflows, providing real-time analytics], tailored to meet the
            company’s unique needs. With an intuitive interface and seamless
            integration, it empowers teams to achieve more.
          </p>
          <hr className="w-[96%] border-[#E6E6E6]" />
          <div className="my-4 flex w-[96%] items-center gap-2">
            <div>
              <img
                src={Referrer1}
                alt="Referrer1"
                className="h-[40px] w-[40px]"
              />
            </div>
            <div className="flex h-[41px] w-[96%] items-center gap-5 rounded-[10px] bg-[#F7F8FA] p-2">
              <input
                type="text"
                className="w-[90%] border-none bg-transparent placeholder:text-[13px] placeholder:text-[#8E8E8E] focus:ring-0"
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
        <div className="flex w-[100%] max-w-[675px] flex-col items-center rounded-[16px] bg-white py-4">
          <div className="w-[96%]">
            <img src={Worksample2} alt="Worksample2" />
          </div>
          <div className="mt-5 flex w-[96%] items-center justify-between">
            <div className="flex w-[90%] gap-5">
              <div className="flex items-center gap-2">
                <FaHeart className="h-[30px] w-[25px] cursor-pointer fill-red-600" />
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
            <HiOutlineDotsHorizontal className="mx-3 h-[30px] w-[30px] fill-[#8E8E8E]" />
          </div>
          <p className="my-5 w-[94%] text-[13px] leading-[100%] text-[#8E8E8E]">
            Introducing FinestBook, a cutting-edge solution designed to
            streamline [specific company function] for FinestBook. This app
            enhances efficiency by [key feature/benefit, e.g., automating
            workflows, providing real-time analytics], tailored to meet the
            company’s unique needs. With an intuitive interface and seamless
            integration, it empowers teams to achieve more.
          </p>
          <hr className="w-[96%] border-[#E6E6E6]" />
          <div className="my-4 flex w-[96%] items-center gap-2">
            <div>
              <img
                src={Referrer1}
                alt="Referrer1"
                className="h-[40px] w-[40px]"
              />
            </div>
            <div className="flex h-[41px] w-[96%] items-center gap-5 rounded-[10px] bg-[#F7F8FA] p-2">
              <input
                type="text"
                className="w-[90%] border-none bg-transparent placeholder:text-[13px] placeholder:text-[#8E8E8E] focus:ring-0"
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
