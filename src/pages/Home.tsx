import { motion } from "framer-motion";
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
import { memo } from "react";

const HomeComponent = () => {
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
          <div className="bg-orange bg-opacity-5 flex gap-4 rounded-2xl px-5 py-3">
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
            <h1 className="font-lato text-4xl font-black md:text-5xl md:leading-[70px]">
              Hunt, Search, Apply,
            </h1>
            <h1 className="font-lato text-4xl font-black md:text-5xl md:leading-[70px]">
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
            <p className="font-lato text-sm font-black text-[#d9d9d9] md:leading-[30px]">
              Discover life-changing career opportunities near you. Find your
            </p>
            <p className="font-lato text-sm font-black text-[#d9d9d9] md:leading-[30px]">
              perfect match, get hired, and achieve your goals today!
            </p>
          </div>

          <div className="mt-9 flex items-center gap-9 md:mt-[52px]">
            <Button className="rounded-[10px] px-5 py-3 font-bold md:px-[34px] md:py-[18px]">
              Get Started
            </Button>
            <div className="flex items-center gap-4">
              <img src={Playbutton} alt="play button" width={45} height={45} />
              <p className="font-sans text-[13px]">See how it works</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-tertiary mt-12 py-3 pl-3 max-lg:overflow-scroll md:py-5 md:pl-10 lg:pl-[90px]">
        <div className="flex items-center justify-between max-lg:gap-2">
          <p className="font-lato text-tertiary rounded-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            Full stcak developer
          </p>
          <p className="font-lato text-orange rounded-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            Back-End developer
          </p>
          <p className="font-lato text-tertiary rounded-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            Graphic Designer
          </p>
          <p className="text-green font-lato rounded-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            UIUX Designer
          </p>
          <p className="text-yellow font-lato rounded-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            Employer branding asspciate
          </p>
          <p className="font-lato text-orange rounded-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            Load dev engineer
          </p>
          <p className="font-lato text-tertiary rounded-l-2xl bg-white px-5 py-[15px] text-center text-[10px] whitespace-nowrap md:text-[13px]">
            Load dev engineer
          </p>
        </div>
      </div>
      {/* End of Hero Section */}

      {/* Get Hired Section */}
      <div className="mt-[78px]">
        <h1 className="font-lato text-center text-[40px] font-black">
          Get Hired In <span className="text-tertiary">4 Quick Easy Steps</span>
        </h1>
        <p className="font-lato text-center font-black text-[#d9d9d9] max-md:text-sm">
          The quickest and most effective way to get hired by top firms working
        </p>
        <p className="font-lato text-center font-black text-[#d9d9d9] max-md:text-sm">
          in your career interest area
        </p>

        <div className="mt-[50px] px-3 md:px-10 lg:px-[90px]">
          <div className="flex items-center gap-5 max-md:flex-col">
            {/* Card 1 - Fade in from left */}
            <motion.div
              className="shadow-card rounded-[10px] p-5"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={Person}
                alt="person"
                className="bg-orange bg-opacity-15 rounded-full p-2"
              />
              <h1 className="font-lato mt-3 font-black">Create An Account</h1>
              <p className="font-lato mt-7 text-[13px] font-light">
                Sign up in minutes to access thousands of job opportunities
                tailored to your skills and preferences. Start your journey
                today!
              </p>
            </motion.div>

            {/* Card 2 - Fade in from bottom */}
            <motion.div
              className="shadow-card rounded-[10px] p-5 md:mt-[37px]"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={Search}
                alt="search"
                className="bg-tertiary bg-opacity-15 rounded-full p-2"
              />
              <h1 className="font-lato mt-3 font-black">Search Job</h1>
              <p className="font-lato mt-7 text-[13px] font-light">
                Browse a variety of roles across industries. Filter by location,
                skills, and interests to find your ideal match effortlessly.
              </p>
            </motion.div>

            {/* Card 3 - Fade in from top */}
            <motion.div
              className="shadow-card rounded-[10px] p-5"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={Cloudupload}
                alt="upload resume"
                className="bg-green bg-opacity-15 rounded-full p-2"
              />
              <h1 className="font-lato mt-3 font-black">Upload Cv/Resume</h1>
              <p className="font-lato mt-7 text-[13px] font-light">
                Showcase your expertise by uploading your resume. Let employers
                recognize your potential and reach out with the perfect
                opportunities.
              </p>
            </motion.div>

            {/* Card 4 - Fade in from right */}
            <motion.div
              className="shadow-card rounded-[10px] p-5 md:mt-[37px]"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={Assignment}
                alt="assignment"
                className="bg-yellow bg-opacity-15 rounded-full p-2"
              />
              <h1 className="font-lato mt-3 font-black">Create An Account</h1>
              <p className="font-lato mt-7 text-[13px] font-light">
                Apply confidently and land your dream job. Watch your career
                take off with just a few simple steps.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      {/* End of Get Hired Section */}

      {/* Countless Career Section */}

      <div className="mt-24 px-3 md:px-10 lg:px-[90px]">
        <h1 className="font-lato text-center text-[40px] font-black">
          <span className="text-tertiary">Countless Career Options</span> Are
          Waiting <br />
          For You to Explore
        </h1>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={Design}
              alt="person"
              className="bg-orange bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Design</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 2 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img
              src={Design}
              alt="person"
              className="bg-tertiary bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Software Development</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 3 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <img
              src={Bell}
              alt="person"
              className="bg-orange bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Marketing</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 4 - Fade in from right */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <img
              src={Finance}
              alt="person"
              className="bg-yellow bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Finance</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 5 - Fade in from right */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <img
              src={Ad}
              alt="person"
              className="bg-green bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Ad Manager</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 6 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <img
              src={Product}
              alt="person"
              className="bg-orange bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Product Management</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 7 - Fade in from right */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <img
              src={Management}
              alt="person"
              className="bg-yellow bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Product Management</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>

          {/* Card 8 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <img
              src={Content}
              alt="person"
              className="bg-green bg-opacity-20 rounded-[10px] p-2"
            />
            <h1 className="font-lato mt-5 font-bold">Content Creation</h1>
            <p className="font-lato mt-2 text-[13px] font-black text-[#d9d9d9]">
              200+ Daily Job Posting
            </p>
          </motion.div>
        </div>
        <div className="flex justify-center">
          <Button className="mt-16 px-8 py-4">View all categories</Button>
        </div>
      </div>
      {/* End of countless career options */}

      {/* Latest jobs section */}
      <div className="mt-5 px-3 md:mt-[90px] md:px-10 lg:px-[90px]">
        <h1 className="font-lato text-[40px] font-black">
          <span className="text-tertiary">Latest and Top</span> Jobs Openings
        </h1>
        <p className="font-lato mt-3 text-xs font-black text-[#d9d9d9]">
          Explore the latest and top job openings in your area. Discover
          exciting opportunities
          <br />
          tailored to your skills and kickstart your career today!
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-1">
              <img src={Eden} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Eden Life</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="font-lato mt-8 font-black">
              Senior Product Designer
            </h1>
            <p className="font-lato mt-4 text-xs font-light">
              Join our creative team as a Product Designer. Shape user
              experiences with innovative designs and impactful solutions.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                UI/UX
              </p>
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                Visual design
              </p>
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                Wireframing
              </p>
            </div>
          </motion.div>

          {/* Card 2 - Fade in from bottom */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-center gap-1">
              <img src={Paystack} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Paystack</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="font-lato mt-8 font-black">Front End Developer</h1>
            <p className="font-lato mt-4 text-xs font-light">
              Seeking a skilled Frontend Developer to craft responsive, dynamic
              web interfaces using cutting-edge technologies.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                HTML
              </p>
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                CSS
              </p>
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                Javascript
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Fade in from top */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              <img src={Dangote} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Dangote Group</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="font-lato mt-8 font-black">Data Analyst</h1>
            <p className="font-lato mt-4 text-xs font-light">
              We’re hiring a Data Analyst to uncover insights, analyze trends,
              and empower decision-making through data-driven strategies.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                Critical Thinking
              </p>
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                Data Storytelling
              </p>
            </div>
          </motion.div>

          {/* Card 4 - Fade in from left */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex items-center gap-1">
              <img src={Flutterwave} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Flutterwave</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="font-lato mt-8 font-black">Content Creation</h1>
            <p className="font-lato mt-4 text-xs font-light">
              We’re hiring a Content Creator to craft compelling articles,
              videos, and campaigns that engage audiences and amplify ...
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                SEO Optimization
              </p>
            </div>
          </motion.div>

          {/* Card 5 - Fade in from bottom */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="flex items-center gap-1">
              <img src={Jumia} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Jumia</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="font-lato mt-8 font-black">Business Analyst</h1>
            <p className="font-lato mt-4 text-xs font-light">
              We’re hiring a Content Creator to craft compelling articles,
              videos, and campaigns that engage audiences and amplify ...
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                SEO Optimization
              </p>
            </div>
          </motion.div>

          {/* Card 6 - Fade in from right */}
          <motion.div
            className="shadow-card rounded-2xl p-5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex items-center gap-1">
              <img src={Jumia} alt="eden" width={50} height={50} />
              <div className="font-lato font-black">
                <h1 className="">Konga</h1>
                <p className="text-xs text-[#d9d9d9]">Nigeria</p>
              </div>
            </div>
            <h1 className="font-lato mt-8 font-black">Digital Marketer</h1>
            <p className="font-lato mt-4 text-xs font-light">
              Seeking a Digital Marketer to lead innovative campaigns, enhance
              online presence, and drive measurable growth for our brand.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="bg-orange bg-opacity-15 font-lato rounded-[10px] px-3 py-1 text-xs">
                SEO Optimization
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* End of Latest jobs section */}

      {/* What we offer section */}
      <div className="mt-10 px-3 md:mt-20 md:px-10 lg:px-[90px]">
        <h1 className="font-lato text-[40px] font-black">What We Offer</h1>
        <p className="font-lato mt-2 font-black text-[#d9d9d9]">
          Check out our services to discover how we help you hunt, search, and{" "}
          <br />
          secure a job aligned with your interests.
        </p>
        <div className="mt-[53px] grid grid-cols-1 place-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <img src={Person1} alt="person" width={407} height={275} />
            <div className="font-lato flex items-center gap-4">
              <h1 className="text-tertiary text-[64px]">1</h1>
              <div className="border-tertiary border-opacity-50 border-l-8 pl-4">
                <h1>Job Recommendation</h1>
                <p className="mt-3 text-xs text-[#d9d9d9]">
                  Set your job preferences, post your portfolio
                  <br /> to attract clients from all over the world
                </p>
              </div>
            </div>
          </div>

          <div>
            <img src={Person2} alt="person" width={407} height={275} />
            <div className="font-lato flex items-center gap-4">
              <h1 className="text-orange text-[64px]">2</h1>
              <div className="border-tertiary border-opacity-50 border-l-8 pl-4">
                <h1>Create and build profile</h1>
              </div>
            </div>
          </div>

          <div>
            <img src={Person3} alt="person" width={407} height={275} />
            <div className="font-lato flex items-center gap-4">
              <h1 className="text-yellow text-[64px]">3</h1>
              <div className="border-tertiary border-opacity-50 border-l-8 pl-4">
                <h1>Career</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* What we offer end */}

      {/* Testimonials */}
      <div className="mt-14 px-3 md:px-10 lg:px-[90px]">
        <h1 className="font-lato text-tertiary text-center text-[40px] font-black">
          Testimonial
        </h1>
        <p className="mt-2 text-center font-black text-[#d9d9d9]">
          Explore our testimonials to see how we’ve helped professionals find
          jobs <br />
          perfectly aligned with their skills, goals, and aspirations.
        </p>
        <TestimonialCarousel />
      </div>
      {/* Testimonials End */}

      <div className="mx-auto mt-20 max-md:px-3 md:mt-[152px] md:w-[800px] lg:w-[874px]">
        <div className="bg-charcoal font-lato relative flex items-center rounded-2xl p-9 font-black text-white">
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
            <div className="mt-7 flex items-center overflow-hidden rounded-[10px] border border-white md:w-[429px]">
              <input
                type="email"
                placeholder="subscribe to our Newsletter"
                className="w-[70%] border-none bg-transparent text-white"
              />
              <button className="bg-white px-9 py-2 text-center text-black">
                Subscribe
              </button>
            </div>
          </div>

          <img
            src={Human1}
            alt="human"
            width={574}
            height={421}
            className="absolute -top-20 left-[350px] max-md:hidden lg:left-[390px]"
          />
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
};

export const Home = memo(HomeComponent);
