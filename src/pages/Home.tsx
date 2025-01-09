import {
  Ad,
  Assignment,
  Bell,
  Cloudupload,
  Content,
  Dangote,
  Design,
  Eden,
  Facebook,
  Finance,
  Flutterwave,
  Google,
  Jumia,
  Linkedin,
  Management,
  Paystack,
  Person,
  Playbutton,
  Product,
  Search,
  Smilling,
} from "../assets/icons";
import { Human1, Person1, Person2, Person3 } from "../assets/images";
import Button from "../components/common/Button";
import TestimonialCarousel from "../components/common/TestimonialCarousel";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";

export const Home = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="mt-10 md:mt-20">
        <img
          src={Linkedin}
          alt="linkedin"
          width={70}
          height={70}
          className="absolute top-[150px] left-[170px] max-lg:hidden"
        />

        <img
          src={Facebook}
          alt="facebook"
          width={70}
          height={70}
          className="absolute top-[112px] left-[350px] max-lg:hidden"
        />

        <img
          src={Google}
          alt="google"
          width={70}
          height={70}
          className="absolute top-[300px] left-[270px] max-lg:hidden"
        />

        <div className="flex flex-col items-center">
          <div className="flex gap-4 bg-orange bg-opacity-5 rounded-2xl py-3 px-5">
            <img src={Smilling} alt="Eden" width={17} height={17} />
            <h1 className="font-lato text-orange text-[13px]">
              GigHub is with you every step of the way
            </h1>
          </div>

          <img
            src={Eden}
            alt="eden"
            width={70}
            height={70}
            className="absolute top-[112px] left-[843px] max-lg:hidden"
          />

          <img
            src={Dangote}
            alt="dangote"
            width={70}
            height={70}
            className="absolute top-[150px] left-[1050px] max-lg:hidden"
          />

          <div className="mt-5 text-center">
            <h1 className="font-black font-lato text-4xl md:text-5xl md:leading-[70px]">
              Hunt, Search, Apply,
            </h1>
            <h1 className="font-black font-lato text-4xl md:text-5xl md:leading-[70px]">
              & Get Your <span className="text-tertiary">Dream Job</span>
            </h1>
          </div>

          <img
            src={Paystack}
            alt="paystack"
            width={70}
            height={70}
            className="absolute top-[300px] left-[950px] max-lg:hidden"
          />

          <div className="mt-5 text-center">
            <p className="font-lato font-black text-[#d9d9d9] text-sm md:leading-[30px]">
              Discover life-changing career opportunities near you. Find your
            </p>
            <p className="font-lato font-black text-[#d9d9d9] text-sm md:leading-[30px]">
              perfect match, get hired, and achieve your goals today!
            </p>
          </div>

          <div className="mt-9 md:mt-[52px] flex items-center gap-9">
            <Button className="font-bold py-3 px-5 md:py-[18px] md:px-[34px] rounded-[10px]">
              Get Started
            </Button>
            <div className="flex items-center gap-4">
              <img src={Playbutton} alt="play button" width={45} height={45} />
              <p className="text-[13px] font-sans">See how it works</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pl-3 md:pl-10 lg:pl-[90px] py-3 md:py-5 bg-tertiary max-lg:overflow-scroll">
        <div className="flex justify-between items-center max-lg:gap-2">
          <p className="text-tertiary font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-2xl whitespace-nowrap">
            Full stcak developer
          </p>
          <p className="text-orange font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-2xl whitespace-nowrap">
            Back-End developer
          </p>
          <p className="text-tertiary font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-2xl whitespace-nowrap">
            Graphic Designer
          </p>
          <p className="text-green font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-2xl whitespace-nowrap">
            UIUX Designer
          </p>
          <p className="text-yellow font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-2xl whitespace-nowrap">
            Employer branding asspciate
          </p>
          <p className="text-orange font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-2xl whitespace-nowrap">
            Load dev engineer
          </p>
          <p className="text-tertiary font-lato text-[10px] md:text-[13px] py-[15px] px-5 text-center bg-white rounded-l-2xl whitespace-nowrap">
            Load dev engineer
          </p>
        </div>
      </div>
      {/* End of Hero Section */}

      {/* Get Hired Section */}
      <div className="mt-[78px]">
        <h1 className="font-lato font-black text-[40px] text-center">
          Get Hired In <span className="text-tertiary">4 Quick Easy Steps</span>
        </h1>
        <p className="font-lato font-black max-md:text-sm text-center text-[#d9d9d9]                                             ">
          The quickest and most effective way to get hired by top firms working
        </p>
        <p className="font-lato font-black max-md:text-sm text-center text-[#d9d9d9]                                             ">
          in your career interest area
        </p>

        <div className="px-3 md:px-10 lg:px-[90px] mt-[50px]">
          <div className="flex max-md:flex-col items-center gap-5">
            <div className="shadow-card p-5 rounded-[10px]">
              <img src={Person} alt="person" className="bg-orange bg-opacity-15 p-2 rounded-full" />
              <h1 className="font-lato font-black mt-3">Create An Account</h1>
              <p className="font-lato font-light text-[13px] mt-7">
                Sign up in minutes to access thousands of job opportunities tailored to your skills
                and preferences. Start your journey today!
              </p>
            </div>

            <div className="shadow-card p-5 rounded-[10px] md:mt-[37px]">
              <img
                src={Search}
                alt="search"
                className="bg-tertiary bg-opacity-15 p-2 rounded-full"
              />
              <h1 className="font-lato font-black mt-3">Search Job</h1>
              <p className="font-lato font-light text-[13px] mt-7">
                Browse a variety of roles across industries. Filter by location, skills, and
                interests to find your ideal match effortlessly.
              </p>
            </div>

            <div className="shadow-card p-5 rounded-[10px]">
              <img
                src={Cloudupload}
                alt="upload resume"
                className="bg-green bg-opacity-15 p-2 rounded-full"
              />
              <h1 className="font-lato font-black mt-3">Upload Cv/Resume</h1>
              <p className="font-lato font-light text-[13px] mt-7">
                Showcase your expertise by uploading your resume. Let employers recognize your
                potential and reach out with the perfect opportunities.
              </p>
            </div>

            <div className="shadow-card p-5 rounded-[10px] md:mt-[37px]">
              <img
                src={Assignment}
                alt="assignment"
                className="bg-yellow bg-opacity-15 p-2 rounded-full"
              />
              <h1 className="font-lato font-black mt-3">Create An Account</h1>
              <p className="font-lato font-light text-[13px] mt-7">
                Apply confidently and land your dream job. Watch your career take off with just a
                few simple steps.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End of Get Hired Section */}

      {/* Countless Career Section */}
      <div className="px-3 md:px-10 lg:px-[90px] mt-24">
        <h1 className="font-black font-lato text-[40px] text-center">
          <span className="text-tertiary">Countless Career Options</span> Are Waiting <br />
          For You to Explore
        </h1>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="shadow-card p-5 rounded-2xl">
            <img src={Design} alt="person" className="bg-orange bg-opacity-20 p-2 rounded-[10px]" />
            <h1 className="font-bold font-lato mt-5">Design</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img
              src={Design}
              alt="person"
              className="bg-tertiary bg-opacity-20 p-2 rounded-[10px]"
            />
            <h1 className="font-bold font-lato mt-5">Software Development</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img src={Bell} alt="person" className="bg-orange bg-opacity-20 p-2 rounded-[10px]" />
            <h1 className="font-bold font-lato mt-5">Marketing</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img
              src={Finance}
              alt="person"
              className="bg-yellow bg-opacity-20 p-2 rounded-[10px]"
            />
            <h1 className="font-bold font-lato mt-5">Finance</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img src={Ad} alt="person" className="bg-green bg-opacity-20 p-2 rounded-[10px]" />
            <h1 className="font-bold font-lato mt-5">Ad Manager</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img
              src={Product}
              alt="person"
              className="bg-orange bg-opacity-20 p-2 rounded-[10px]"
            />
            <h1 className="font-bold font-lato mt-5">Product Management</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img
              src={Management}
              alt="person"
              className="bg-yellow bg-opacity-20 p-2 rounded-[10px]"
            />
            <h1 className="font-bold font-lato mt-5">Product Management</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <img src={Content} alt="person" className="bg-green bg-opacity-20 p-2 rounded-[10px]" />
            <h1 className="font-bold font-lato mt-5">Content Creation</h1>
            <p className="font-black font-lato text-[13px] text-[#d9d9d9] mt-2">
              200+ Daily Job Posting
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="mt-16 px-8 py-4">View all categories</Button>
        </div>
      </div>
      {/* End of countless career options */}

      {/* Latest jobs section */}
      <div className="px-3 md:px-10 lg:px-[90px] mt-5 md:mt-[90px]">
        <h1 className="font-lato font-black text-[40px]">
          <span className="text-tertiary">Latest and Top</span>Jobs Openings
        </h1>
        <p className="font-lato font-black text-xs text-[#d9d9d9] mt-3">
          Explore the latest and top job openings in your area. Discover exciting opportunities
          <br />
          tailored to your skills and kickstart your career today!
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="shadow-card p-5 rounded-2xl">
            <div className="flex items-center gap-1">
              <img src={Eden} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Eden Life</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="mt-8 font-lato font-black">Senior Product Designer</h1>
            <p className="font-lato font-light text-xs mt-4">
              Join our creative team as a Product Designer. Shape user experiences with innovative
              designs and impactful solutions.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                UI/UX
              </p>
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                Visual design
              </p>
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                Wireframing
              </p>
            </div>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <div className="flex items-center gap-1">
              <img src={Paystack} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Paystack</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="mt-8 font-lato font-black">Front End Developer</h1>
            <p className="font-lato font-light text-xs mt-4">
              Seeking a skilled Frontend Developer to craft responsive, dynamic web interfaces using
              cutting-edge technologies.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                HTML
              </p>
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                CSS
              </p>
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                Javascript
              </p>
            </div>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <div className="flex items-center gap-1">
              <img src={Dangote} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Dangote Group</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="mt-8 font-lato font-black">Data Analyst</h1>
            <p className="font-lato font-light text-xs mt-4">
              We’re hiring a Data Analyst to uncover insights, analyze trends, and empower
              decision-making through data-driven strategies.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                Critical Thinking
              </p>
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                Data Storytelling
              </p>
            </div>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <div className="flex items-center gap-1">
              <img src={Flutterwave} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Flutterwave</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="mt-8 font-lato font-black">Content Creation</h1>
            <p className="font-lato font-light text-xs mt-4">
              We’re hiring a Content Creator to craft compelling articles, videos, and campaigns
              that engage audiences and amplify ...
            </p>
            <div className="flex items-center gap-3 mt-8">
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                SEO Optimization
              </p>
            </div>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <div className="flex items-center gap-1">
              <img src={Jumia} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Jumia</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="mt-8 font-lato font-black">Business Analyst</h1>
            <p className="font-lato font-light text-xs mt-4">
              We’re hiring a Content Creator to craft compelling articles, videos, and campaigns
              that engage audiences and amplify ...
            </p>
            <div className="flex items-center gap-3 mt-8">
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                SEO Optimization
              </p>
            </div>
          </div>

          <div className="shadow-card p-5 rounded-2xl">
            <div className="flex items-center gap-1">
              <img src={Jumia} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Konga</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="mt-8 font-lato font-black">Digital Marketer</h1>
            <p className="font-lato font-light text-xs mt-4">
              Seeking a Digital Marketer to lead innovative campaigns, enhance online presence, and
              drive measurable growth for our brand.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <p className="text-xs bg-orange bg-opacity-15 font-lato py-1 px-3 rounded-[10px]">
                SEO Optimization
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End of Latest jobs section */}

      {/* What we offer section */}
      <div className="px-3 md:px-10 lg:px-[90px] mt-10 md:mt-20">
        <h1 className="font-lato font-black text-[40px]">What We Offer</h1>
        <p className="mt-2 font-lato font-black text-[#d9d9d9]">
          Check out our services to discover how we help you hunt, search, and <br />
          secure a job aligned with your interests.
        </p>
        <div className="mt-[53px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
          <div>
            <img src={Person1} alt="person" width={407} height={275} />
            <div className="flex items-center gap-4 font-lato">
              <h1 className="text-[64px] text-tertiary">1</h1>
              <div className="border-l-8 border-tertiary border-opacity-50 pl-4">
                <h1>Job Recommendation</h1>
                <p className="text-xs mt-3 text-[#d9d9d9]">
                  Set your job preferences, post your portfolio
                  <br /> to attract clients from all over the world
                </p>
              </div>
            </div>
          </div>

          <div>
            <img src={Person2} alt="person" width={407} height={275} />
            <div className="flex items-center gap-4 font-lato">
              <h1 className="text-[64px] text-orange">2</h1>
              <div className="border-l-8 border-tertiary border-opacity-50 pl-4">
                <h1>Create and build profile</h1>
              </div>
            </div>
          </div>

          <div>
            <img src={Person3} alt="person" width={407} height={275} />
            <div className="flex items-center gap-4 font-lato">
              <h1 className="text-[64px] text-yellow">3</h1>
              <div className="border-l-8 border-tertiary border-opacity-50 pl-4">
                <h1>Career</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* What we offer end */}

      {/* Testimonials */}
      <div className="px-3 md:px-10 lg:px-[90px] mt-14">
        <h1 className="font-lato font-black text-[40px] text-tertiary text-center">Testimonial</h1>
        <p className="font-black text-[#d9d9d9] text-center mt-2">
          Explore our testimonials to see how we’ve helped professionals find jobs <br />
          perfectly aligned with their skills, goals, and aspirations.
        </p>
        <TestimonialCarousel />
      </div>
      {/* Testimonials End */}

      <div className="max-md:px-3 md:w-[800px] lg:w-[874px] mt-20 md:mt-[152px] mx-auto">
        <div className="relative bg-charcoal rounded-2xl p-9 font-lato font-black text-white flex items-center">
          <div>
            <h1 className="text-[40px]">
              Get Latest Job
              <br />
              Update
            </h1>
            <p className="mt-2">
              Get the latest job updates directly to your inbox.
              <br /> Stay informed about new opportunities
              <br />
              that match your skills and interests.
            </p>
            <div className="mt-7 border border-white flex items-center md:w-[429px] overflow-hidden rounded-[10px]">
              <input
                type="email"
                placeholder="subscribe to our Newsletter"
                className="w-[70%] border-none bg-transparent text-white"
              />
              <button className="text-center bg-white text-black px-9 py-2">Subscribe</button>
            </div>
          </div>

          <img
            src={Human1}
            alt="human"
            width={574}
            height={421}
            className="max-md:hidden absolute left-[350px] lg:left-[390px] -top-20"
          />
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
};
