import React from "react";
import Image7 from "../../../../assets/images/image7.png";
import { EmployerData } from "../../../../utils/types";
import { useChatStore } from "../../../../store/useChatStore.ts";

interface PublicProfileCardProp {
  user: EmployerData;
}

const PublicProfileCard: React.FC<PublicProfileCardProp> = ({ user }) => {
  const { setIsClosed, setRecipient } = useChatStore();
  return (
    <div className="h-[150px] w-full items-center justify-between rounded-t-[16px] bg-[#6B5AED] p-4 text-white mdl:h-[118px]">
      <section className="mt-10 flex h-fit w-full flex-col items-center gap-y-6 bg-white p-6 shadow md:justify-between mdl:flex-row">
        <div className="flex w-full items-center gap-x-4 gap-y-3">
          <div className="bg-gray-300 flex h-24 w-24 items-center justify-center rounded-full">
            {/* Company logo or image */}
            <img
              src={user?.companyLogo || Image7} // Replace with your logo URL
              alt="Company Logo"
              className="h-full w-full rounded-full border-[4px] border-white bg-white"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">
              {user?.companyName}
            </h2>
            <p className="text-black">{user?.aboutCompany}</p>
          </div>
        </div>
        <div className="flex w-full gap-x-4 gap-y-3">
          <button className="h-[45px] w-[150px] rounded-[10px] bg-[#F7F7F7] px-6 py-2 text-black transition duration-200">
            Follow us
          </button>
          <button
            onClick={() => {
              setRecipient(user?.email);
              setIsClosed(false);
            }}
            className="w-[200px] rounded-lg bg-[#6438C2] px-6 py-2 text-white transition duration-200 hover:bg-purple-700"
          >
            Send Message
          </button>
        </div>
      </section>
    </div>
  );
};

export default PublicProfileCard;
