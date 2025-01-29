import { Link, useLocation } from "react-router-dom";
import { Close, Gighub, Menu } from "../../assets/icons";
// import Button from "../common/Button";
import { useState } from "react";
import { motion } from "motion/react";

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  //   Get Header content based on current page route
  const getHeaderContent = () => {
    if (location.pathname === "/home") {
      return (
        <>
          <div className="flex items-center max-md:hidden">
            <ul className="font-lato font-bold flex gap-5 lg:gap-8 max-lg:text-[13px]">
              <li>
                <Link to="">Home</Link>
              </li>
              <li>
                <Link to="">About Us</Link>
              </li>
              <li>
                <Link to="">Service</Link>
              </li>
              <li>
                <Link to="">Contact Us</Link>
              </li>
            </ul>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <header>
        <div className="px-5 md:px-10 lg:px-[90px] py-5 flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-[10px]">
              <img
                src={Gighub}
                alt="Gighub"
                className="md:h-[41px] md:w-[41px] h-[35px] w-[35px]"
              />
              <h1 className="md:text-xl font-black font-lato text-orange">Gighub</h1>
            </div>
          </Link>

          {getHeaderContent()}

          <div className="flex items-center gap-4 lg:gap-9 max-lg:hidden">
            <h1 className="font-lato font-bold max-lg:text-[13px]">Login</h1>
            <Link
              to="/onboarding"
              className="bg-tertiary text-white rounded-2xl max-lg:py-2 max-lg:px-5 lg:py-[10px] lg:px-10"
            >
              Try it now
            </Link>
          </div>
          <img
            src={Menu}
            alt="menu"
            className={`lg:hidden w-10 h-10 cursor-pointer ${open ? "hidden" : ""}`}
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Mobile Screen */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: open ? "0%" : "-100%" }}
          //   exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={
            open
              ? "bg-white top-0 h-screen max-md:w-full max-lg:w-4/5 z-50 lg:hidden fixed"
              : "hidden"
          }
        >
          <div className="flex justify-between py-5 px-5">
            <Link to="/">
              <div className="flex items-center gap-[10px]">
                <img src={Gighub} alt="Gighub" className="lg:hidden h-[35px] w-[35px]" />
                <h1 className="md:text-xl font-black font-lato text-orange">Gighub</h1>
              </div>
            </Link>
            <img
              src={Close}
              alt="menu"
              className="w-10 h-10 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="w-full border border-[#d9d9d9]"></div>
          <ul className="font-lato font-bold my-10 mx-[45px]">
            <li className="mb-5 cursor-pointer">
              <Link to="">Home</Link>
            </li>
            <li className="mb-5 cursor-pointer">
              <Link to="">About Us</Link>
            </li>
            <li className="mb-5 cursor-pointer">
              <Link to="">Service</Link>
            </li>
            <li className="cursor-pointer">
              <Link to="">Contact Us</Link>
            </li>
          </ul>
          <Link
            to="/onboarding"
            className="bg-tertiary text-white rounded-2xl max-lg:py-2 max-lg:px-5 lg:py-[10px] lg:px-10 mx-[45px] mb-[45px]"
          >
            Try it now
          </Link>
          <div className="w-full border border-[#d9d9d9] mt-5"></div>
          <h1 className="mx-[45px] my-5 font-lato font-bold text-2xl">
            <Link to="">Signup</Link>
          </h1>
          <div className="w-full border border-[#d9d9d9]"></div>
          <h1 className="mx-[45px] my-5 font-lato font-bold text-2xl">GigHub Inc</h1>
        </motion.div>
        {/* Mobile Screen End */}
      </header>
    </>
  );
};

export default Header;
