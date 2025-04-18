import microscope from "../../assets/icons/microscope.svg";
import certificate from "../../assets/icons/certificate.svg";
import location from "../../assets/icons/locations.svg";

const CompanyNavbar = () => {
  return (
    <header className="bg-white rounded-[16px]">
      <nav className="hidden items-center justify-between rounded-[16px] lg:flex">
        <div className="w-[30%] flex flex-col justify-center">
          <h2 className="text-[24px] font-bold text-black">
            Find Companies Easily
          </h2>
          <span className="font-bold">Sunday 6, 2024</span>
        </div>
        <div className="w-[70%] flex items-end justify-evenly gap-2 mr-5">
          <div className="flex w-full items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
            <img src={microscope} alt="microscope" className="m-2" />
            <input
              type="text"
              placeholder="Find job"
              className="h-full w-full border-none bg-transparent px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full items-center rounded-[16px] border-2 border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
            <img src={certificate} alt="certificate" className="m-2" />
            <input
              type="text"
              placeholder="Certification"
              className="h-full w-full border-none bg-transparent px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full items-center rounded-[16px] border-2 border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
            <img src={location} alt="location" className="m-2" />
            <input
              type="text"
              placeholder="Location"
              className="h-full w-full border-none bg-transparent px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </nav>
      <div className="flex lg:hidden justify-between py-3">
        <div className="flex w-full items-center rounded-[16px]">
          <img src={microscope} alt="microscope" className="mx-4 scale-150" />
          <input
            type="text"
            placeholder="Search here"
            className="h-full w-full border-none bg-transparent placeholder:text-[#000000] placeholder:font-bold px-4 py-2 focus:border-none focus:outline-none focus:ring-0"
          />
        </div>
        <button className="text-[13px] font-bold text-white bg-[#6438C2] px-[11px] py-1 rounded-[10px] ml-2">Search</button>
      </div>
    </header>
  );
};

export default CompanyNavbar;
