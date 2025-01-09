import { Link } from "react-router-dom";
import { Gighub, Location, Phone } from "../../assets/icons";

const Footer = () => {
  return (
    <>
      <div className="px-3 md:px-10 lg:px-[90px] mb-20 flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-10 md:gap-20">
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <div className="flex items-center gap-[10px]">
              <img src={Gighub} alt="Gighub" width={41} height={41} />
              <h1 className="text-xl font-black font-lato text-orange">Gighub</h1>
            </div>
            <p className="font-lato mt-9">
              GigHub connects professionals with flexible job opportunities. Discover gigs that
              match your skills, work on your terms, and grow your career with ease and flexibility.
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h1 className="font-lato font-bold">Quick Link</h1>
            <ul className="mt-7 font-lato text-xs">
              <li className="mb-2">
                <Link to="">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="">Jobs</Link>
              </li>
              <li className="mb-2">
                <Link to="">Services</Link>
              </li>
              <li className="mb-2">
                <Link to="">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h1 className="font-lato font-bold">Legal</h1>
            <ul className="mt-7 font-lato text-xs">
              <li className="mb-2">
                <Link to="">Terms of use</Link>
              </li>
              <li className="mb-2">
                <Link to="">Help center</Link>
              </li>
              <li className="mb-2">
                <Link to="">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="">Complaine</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h1 className="font-lato font-bold">Follow Us</h1>
            <ul className="mt-7 font-lato text-xs">
              <li className="mb-2">
                <Link to="">Facebook</Link>
              </li>
              <li className="mb-2">
                <Link to="">Instagram</Link>
              </li>
              <li className="mb-2">
                <Link to="">Linkedin</Link>
              </li>
              <li className="mb-2">
                <Link to="">Twitter</Link>
              </li>
              <li className="mb-2">
                <Link to="">Youtube</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h1 className="font-lato font-bold">Contact Us</h1>
            <div className="mt-7 flex items-center gap-2">
              <img src={Phone} alt="phone" width={24} height={24} />
              <p className="font-lato font-bold text-xs">+23479446736</p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <img src={Location} alt="phone" width={24} height={24} />
              <p className="font-lato font-bold text-xs">Area 11, Garki, Abuja</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
