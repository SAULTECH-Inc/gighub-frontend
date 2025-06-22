import { EmployerData } from "../../../../utils/types";
import React from "react";

interface AboutUsProp {
  user: EmployerData;
}
const AboutUs: React.FC<AboutUsProp> = ({ user }) => {
  return (
    <section className="md:20 mt-32 w-full rounded-lg bg-white p-6 shadow border-2">
      <h2 className="mb-4 text-xl font-semibold">About Us</h2>
      <div className="flex flex-col items-start justify-between gap-y-4 md:flex-row">
        {/* Left Section */}
        <div className="md:mr-6 md:h-[208px] w-full bg-[#F7F7F7] p-4 md:w-[482px] md:flex-1">
          <div
            dangerouslySetInnerHTML={{ __html: user?.companyDescription || "" }}
            className="text-decoration-skip-ink text-decoration-skip-ink h-[150px] text-left font-lato text-[16px] font-[700] leading-[19.2px] text-[#7F7F7F] underline-offset-4"
          ></div>
          <div className="grid grid-cols-2 md:flex flex-wrap gap-x-4">
            <a href={user?.linkedInProfile || "#"} className="text-purple-600">
              LinkedIn
            </a>
            <a href={user?.facebookProfile || "#"} className="text-purple-600">
              Facebook
            </a>
            <a href={user?.twitterProfile || "#"} className="text-purple-600">
              Twitter
            </a>
            <a href={user?.instagramProfile || "#"} className="text-purple-600">
              Instagram
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-decoration-skip-ink flex h-[208px] w-full flex-1 flex-col justify-between space-y-4 bg-[#F7F7F7] p-4 text-left font-lato text-[16px] font-[700] leading-[19.2px] text-[#7F7F7F] underline-offset-4 md:w-[482px]">
          <div className="flex items-center gap-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
              <span className="text-xs">💼</span>
            </div>
            <p className="text-sm font-semibold">{user?.industry || ""}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
              <span className="text-xs">🏢</span>
            </div>
            {user?.companySize && (
              <p className="text-sm font-semibold">{user?.companySize}</p>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
              <span className="text-sm">🌍</span>
            </div>
            <p className="text-sm font-semibold">{user?.companyAddress}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
