import { FC, useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import ApplicantNavBar from "../../components/layouts/ApplicantNavBar.tsx";
import SearchIcon from "../../components/common/SearchIcon.tsx";
import Chat from "../../assets/icons/bubble-chat.svg";
import {applicantNavBarItemMap, applicantNavItems, applicantNavItemsMobile} from "../../utils/constants.ts";

export const ApplicantNetwork: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayScrollIcons, setDisplayScrollIcons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  // Attach scroll event listener
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // Initial check

    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, []);

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      <ApplicantNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile} navbarItemsMap={applicantNavBarItemMap}/>
      <div className="w-full flex flex-col items-center py-6">
        <div className="w-[94%] flex flex-col items-center justify-center py-6">
          <div className="w-full py-[10px] pl-[30px] pr-[12px] bg-[#FFFFFF] rounded-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="text-[#000000] text-center sm:text-start text-2xl font-bold xl:w-[24%]">
              <p> Get in touch with your network</p>{" "}
            </div>
            <div className="w-[90%] sm:w-[76%] flex flex-wrap lg:flex-nowrap items-center justify-end gap-2">
              <div className="w-full lg:w-[35%] bg-[#F9F9F9] flex items-center px-4 py-[6px] rounded-[16px] gap-1">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search by name"
                  className="placeholder-text-[13px] placeholder-text-[#A1A1A1]  border-none bg-transparent focus:outline-none focus:ring-transparent"
                />
              </div>
              <div className="w-full lg:w-[65%] flex flex-wrap sm:flex-nowrap gap-2">
                <div className="w-full sm:w-[50%] bg-[#F9F9F9] flex items-center px-4 py-[6px] rounded-[16px] gap-1">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Select skills"
                    className="placeholder-text-[13px] placeholder-text-[#A1A1A1]  border-none bg-transparent focus:outline-none focus:ring-transparent"
                  />
                </div>
                <div className="w-full sm:w-[50%] bg-[#F9F9F9] flex items-center px-4 py-[6px] rounded-[16px] gap-1">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Select level"
                    className=" placeholder-text-[13px] placeholder-text-[#A1A1A1] border-none bg-transparent focus:outline-none focus:ring-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[94%] flex flex-col-reverse xl:flex-row pt-10 gap-5">
          <div className="w-[94%] xl:w-[70%] h-fit bg-[#FFFFFF] py-[24px] px-3 xl:px-[12px] rounded-[16px] self-center xl:self-start flex flex-wrap justify-center gap-5">
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full"></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson2
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson3
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson4
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson5
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson6
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson7
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            <div className="border border-[#E6E6E6] max-w-[298px] max-h-[400px] rounded-[16px] px-[18px] py-[22px] flex flex-col gap-4">
              <div className="bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
              <div>
                <p className="text-[20px] text-[#000000] font-bold">
                  Jona johnson8
                </p>
                <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                  <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                </div>
                <button className="bg-[#6438C2] border border-[#E6E6E6] w-[60px] h-[60px] rounded-full flex items-center justify-center">
                  <img src={Chat} alt="chat" />
                </button>
              </div>
              <hr className="border-[#AFAFAF]" />
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p>Product Designer</p>
                <p>Senior level</p>
              </div>
              <div className="flex justify-between items-center font-bold text-[#6438C2]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                  500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                  <button className="font-medium text-[#000000]">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:min-w-[323px] flex flex-col gap-2">
            <p className="p-2 font-medium text-[#000000] text-[20px]">
              Find New Connections
            </p>
            <div className="w-full flex items-center justify-center">
              <div>
                {/* Left Scroll Button */}
              {displayScrollIcons && (
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`absolute left-0 py-2 rounded-full ${
                    canScrollLeft
                      ? "fill-blue bg-blue-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaAngleLeft size={40} className="fill-white"/>
                </button>
              )}
              </div>

              {/* <button
                onClick={scrollLeft}
                className="flex items-center xl:hidden"
              >
                {displayScrollIcons && (
                  <FaAngleLeft className="w-[40px] cursor-pointer" />
                )}
              </button> */}
              <div
                className="w-[95%] flex overflow-hidden"
                onMouseOver={() => setDisplayScrollIcons(true)}
                onMouseLeave={() => setDisplayScrollIcons(false)}
              >
                <div
                  ref={scrollRef}
                  className="w-full flex xl:flex-col gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
                >
                  <div className="max-w-[323px] mx-auto px-4 py-6 bg-white rounded-[16px] flex flex-col gap-10">
                    <div className="relative flex flex-col gap-4">
                      <div className="self-end border border-[#E6E6E6] rounded-[10px] py-[6px] px-4">
                        <button className="font-bold text-[#000000]">
                          Send message
                        </button>
                      </div>
                      <hr />
                      <div className="absolute top-3 left-4 bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[20px] text-[#000000] font-bold">
                          Julius Abel
                        </p>
                        <p className="font-bold text-[#8E8E8E]">
                          Lagos Nigeria
                        </p>
                      </div>
                      <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                    </div>
                    <div className="flex self-center items-center font-bold gap-2">
                      <button className="bg-[#E6E6E6] text-[#000000] rounded-[10px] py-[6px] px-10">
                        Reject
                      </button>
                      <button className="bg-[#6438C2] text-[#FFFFFF] rounded-[10px] py-[7px] px-10">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="max-w-[323px] px-4 py-6 bg-white rounded-[16px] flex flex-col gap-10">
                    <div className="relative flex flex-col gap-4">
                      <div className="self-end border border-[#E6E6E6] rounded-[10px] py-[6px] px-4">
                        <button className="font-bold text-[#000000]">
                          Send message
                        </button>
                      </div>
                      <hr />
                      <div className="absolute top-3 left-4 bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[20px] text-[#000000] font-bold">
                          Julius Abel2
                        </p>
                        <p className="font-bold text-[#8E8E8E]">
                          Lagos Nigeria
                        </p>
                      </div>
                      <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                    </div>
                    <div className="flex self-center items-center font-bold gap-2">
                      <button className="bg-[#E6E6E6] text-[#000000] rounded-[10px] py-[6px] px-10">
                        Reject
                      </button>
                      <button className="bg-[#6438C2] text-[#FFFFFF] rounded-[10px] py-[7px] px-10">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="max-w-[323px] px-4 py-6 bg-white rounded-[16px] flex flex-col gap-10">
                    <div className="relative flex flex-col gap-4">
                      <div className="self-end border border-[#E6E6E6] rounded-[10px] py-[6px] px-4">
                        <button className="font-bold text-[#000000]">
                          Send message
                        </button>
                      </div>
                      <hr />
                      <div className="absolute top-3 left-4 bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[20px] text-[#000000] font-bold">
                          Julius Abel3
                        </p>
                        <p className="font-bold text-[#8E8E8E]">
                          Lagos Nigeria
                        </p>
                      </div>
                      <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                    </div>
                    <div className="flex self-center items-center font-bold gap-2">
                      <button className="bg-[#E6E6E6] text-[#000000] rounded-[10px] py-[6px] px-10">
                        Reject
                      </button>
                      <button className="bg-[#6438C2] text-[#FFFFFF] rounded-[10px] py-[7px] px-10">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="max-w-[323px] px-4 py-6 bg-white rounded-[16px] flex flex-col gap-10">
                    <div className="relative flex flex-col gap-4">
                      <div className="self-end border border-[#E6E6E6] rounded-[10px] py-[6px] px-4">
                        <button className="font-bold text-[#000000]">
                          Send message
                        </button>
                      </div>
                      <hr />
                      <div className="absolute top-3 left-4 bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[20px] text-[#000000] font-bold">
                          Julius Abel4
                        </p>
                        <p className="font-bold text-[#8E8E8E]">
                          Lagos Nigeria
                        </p>
                      </div>
                      <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                    </div>
                    <div className="flex self-center items-center font-bold gap-2">
                      <button className="bg-[#E6E6E6] text-[#000000] rounded-[10px] py-[6px] px-10">
                        Reject
                      </button>
                      <button className="bg-[#6438C2] text-[#FFFFFF] rounded-[10px] py-[7px] px-10">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="max-w-[323px] px-4 py-6 bg-white rounded-[16px] flex flex-col gap-10">
                    <div className="relative flex flex-col gap-4">
                      <div className="self-end border border-[#E6E6E6] rounded-[10px] py-[6px] px-4">
                        <button className="font-bold text-[#000000]">
                          Send message
                        </button>
                      </div>
                      <hr />
                      <div className="absolute top-3 left-4 bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[20px] text-[#000000] font-bold">
                          Julius Abel5
                        </p>
                        <p className="font-bold text-[#8E8E8E]">
                          Lagos Nigeria
                        </p>
                      </div>
                      <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                    </div>
                    <div className="flex self-center items-center font-bold gap-2">
                      <button className="bg-[#E6E6E6] text-[#000000] rounded-[10px] py-[6px] px-10">
                        Reject
                      </button>
                      <button className="bg-[#6438C2] text-[#FFFFFF] rounded-[10px] py-[7px] px-10">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="max-w-[323px] px-4 py-6 bg-white rounded-[16px] flex flex-col gap-10">
                    <div className="relative flex flex-col gap-4">
                      <div className="self-end border border-[#E6E6E6] rounded-[10px] py-[6px] px-4">
                        <button className="font-bold text-[#000000]">
                          Send message
                        </button>
                      </div>
                      <hr />
                      <div className="absolute top-3 left-4 bg-[#D9D9D9] w-[60px] h-[60px] rounded-full "></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[20px] text-[#000000] font-bold">
                          Julius Abel6
                        </p>
                        <p className="font-bold text-[#8E8E8E]">
                          Lagos Nigeria
                        </p>
                      </div>
                      <div className="bg-[#D9D9D9] w-[40px] h-[40px] rounded-full "></div>
                    </div>
                    <div className="flex self-center items-center font-bold gap-2">
                      <button className="bg-[#E6E6E6] text-[#000000] rounded-[10px] py-[6px] px-10">
                        Reject
                      </button>
                      <button className="bg-[#6438C2] text-[#FFFFFF] rounded-[10px] py-[7px] px-10">
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <button
                onClick={scrollRight}
                className="flex items-center xl:hidden"
              >
                {displayScrollIcons && (
                  <FaChevronRight className="w-[40px] cursor-pointer" />
                )}
              </button> */}

              {/* Right Scroll Button */}
              {displayScrollIcons && (
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`absolute right-0 p-1 rounded-full ${
                    canScrollRight
                      ? "bg-gray-700"
                      : "fill-[#D9D9D9] cursor-not-allowed"
                  }`}
                >
                  <FaChevronRight size={24}  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
