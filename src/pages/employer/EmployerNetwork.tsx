import { FC, useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
// import {useNavigate} from "react-router-dom";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import NetworkCard from "../network/NetworkCard.tsx";
import NetworkConnectionsCard from "../network/NetworkConnectionsCard.tsx";
import { NetworkDetails } from "../../utils/types";

export const EmployerNetwork: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayScrollIcons, setDisplayScrollIcons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [, setChatWindowOpened] = useState<boolean>(false);
  // const navigate = useNavigate();

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
    <div className="min-h-screen">
      {USER_TYPE === UserType.APPLICANT ? (
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      ) : (
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
      )}
      <div className="flex w-full flex-col-reverse sm:flex-row">
        {/*w-full sm:w-[50%] md-w-[70%] lg:w-[298px]*/}
        <div className="my-4 grid h-fit w-full grid-cols-2 gap-1 border-2">
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
          <NetworkCard
            userDetails={{} as NetworkDetails}
            setChatWindowOpened={setChatWindowOpened}
          />
        </div>
        <div className="bg-green flex w-full flex-col gap-2 p-4 sm:w-[50%] md:w-[35%] md:items-center">
          <p className="p-2 text-[20px] font-medium text-[#000000]">
            Find New Connections
          </p>
          <div className="flex w-full items-center justify-center sm:hidden">
            <div className="">
              {/* Left Scroll Button */}
              {displayScrollIcons && (
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`absolute left-0 rounded-full py-2 ${
                    canScrollLeft
                      ? "fill-blue bg-blue-500"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  <FaAngleLeft size={40} className="fill-white" />
                </button>
              )}
            </div>

            <div
              className="flex w-[95%] overflow-hidden"
              onMouseOver={() => setDisplayScrollIcons(true)}
              onMouseLeave={() => setDisplayScrollIcons(false)}
            >
              <div
                ref={scrollRef}
                className="scrollbar-hide flex w-full gap-5 overflow-x-auto scroll-smooth xl:flex-col"
              >
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
                <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
              </div>
            </div>
            {displayScrollIcons && (
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-0 rounded-full p-1 ${
                  canScrollRight
                    ? "bg-gray-700"
                    : "cursor-not-allowed fill-[#D9D9D9]"
                }`}
              >
                <FaChevronRight size={24} />
              </button>
            )}
          </div>
          <div className="hidden flex-col gap-5 sm:flex">
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
            <NetworkConnectionsCard userDetails={{} as NetworkDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};
