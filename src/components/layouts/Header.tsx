import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gighub } from "../../assets/icons";
import Button from "../common/Button";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const proceed = () => {
    navigate("/user-type-selection");
  };

  //   Get Header content based on current page route
  const getHeaderContent = () => {
    if (location.pathname === "/home") {
      return (
        <>
          <div className="flex items-center max-md:hidden">
            <ul className="flex gap-5 font-lato font-bold max-lg:text-[13px] lg:gap-8">
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
        <div className="flex items-center justify-between px-3 py-5 md:px-10 lg:px-[90px]">
          <div className="flex items-center gap-[10px]">
            <img src={Gighub} alt="Gighub" width={41} height={41} />
            <h1 className="font-lato text-xl font-black text-orange">Gighub</h1>
          </div>

          {getHeaderContent()}

          <div className="flex items-center gap-4 lg:gap-9">
            <Link
              className="cursor-pointer font-lato font-bold max-lg:text-[13px]"
              to="login"
            >
              Login
            </Link>
            <Button
              onClick={() => proceed()}
              className="max-lg:px-5 max-lg:py-2 lg:px-10 lg:py-[10px]"
            >
              Try it now
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
