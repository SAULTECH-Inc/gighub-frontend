import { Link } from "react-router-dom";
import { Experince, Gighub, Ratings, Search } from "../assets/icons";
import { Person10, Person6, Person9 } from "../assets/images";
import ApplicantSignupStep from "../components/onboardingSteps/ApplicantSignupStep";
import CompanyDetailsStep from "../components/onboardingSteps/CompanyDetailsStep";
import EmployerSignupStep from "../components/onboardingSteps/EmployerSignupStep";
import GetStarted from "../components/onboardingSteps/GetStarted";
import WorkExperienceStep from "../components/onboardingSteps/WorkExperienceStep";
import { useSignupStore } from "../hooks/useSignupStore";
import { motion } from "motion/react";

const Onboarding = () => {
  const { step, data } = useSignupStore();

  return (
    <>
      <div className="px-5 md:px-20">
        <div className="flex max-md:flex-col md:items-start md:justify-between my-6">
          {/* step side */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <Link to="/">
                <div className="flex items-center gap-[10px]">
                  <img src={Gighub} alt="gighub" className="w-6 h-6 md:w-10 md:h-10" />
                  <h1 className="text-orange font-black font-lato md:text-[20px]">GigHub</h1>
                </div>
              </Link>

              {/* <div>
                <h1>Step {currentStep} of 3</h1>
              </div> */}
            </div>

            <div className="mx-5">
              {step === 1 && <GetStarted />}
              {step === 2 && data.employer === true && <EmployerSignupStep />}
              {step === 2 && data.jobSeeker === true && <ApplicantSignupStep />}
              {step === 3 && data.jobSeeker === true && <WorkExperienceStep />}
              {step === 3 && data.employer === true && <CompanyDetailsStep />}
            </div>
          </div>
          {/* step side end */}

          <div className="max-lg:hidden bg-tertiary rounded-2xl h-[978px] w-[543px] flex flex-col items-center justify-center px-12">
            {/* Change according to steps */}
            {step === 1 && (
              <>
                <h1 className="w-[311px] font-lato font-bold text-2xl text-center text-white">
                  Let Us Know How You Want To Use JobberX
                </h1>
                <div className="bg-white mt-10 p-[30px] rounded-2xl relative ml-auto">
                  <img
                    src={Person9}
                    alt="person"
                    className="w-[70px] h-[70px] absolute top-[-20px] left-[270px]"
                  />
                  <button className="py-3 px-6 bg-tertiary text-white font-lato font-bold rounded-2xl">
                    Recruiter
                  </button>
                  <p className="font-lato font-light text-[13px] mt-12 w-[258px]">
                    Hey, I’m looking for a talented individual to join my team and help us achieve
                    our goals. If you're skilled, motivated, and ready to make a n impact, let’s
                    connect
                  </p>
                </div>

                {/* <img src={Map} alt="" className="absolute bottom-[120px] right-[290px]" /> */}

                <div className="bg-white mt-[222px] p-[30px] rounded-2xl relative mr-auto">
                  <img
                    src={Person10}
                    alt="person"
                    className="w-[70px] h-[70px] absolute top-[-20px] right-[270px]"
                  />
                  <div className="flex justify-end">
                    <button className="py-3 px-6 bg-tertiary text-white font-lato font-bold rounded-2xl">
                      Job seeker
                    </button>
                  </div>
                  <p className="font-lato font-light text-[13px] mt-12 w-[258px]">
                    "Hi, I’m seeking an exciting opportunity where I can apply my skills, grow
                    professionally, and make a meaningful impact. If you’re hiring for a role that
                    fits, let’s connect!"
                  </p>
                </div>
              </>
            )}
            {step === 2 && data.jobSeeker === true && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                <h1 className="w-[344px] font-lato text-2xl text-center text-white font-black mx-auto">
                  Your Gateway to Better Careers and Hiring Success!
                </h1>

                <div className="bg-white rounded-2xl p-5 mt-16 w-[300px] mx-auto">
                  <div className="bg-[#f9f9f9] rounded-2xl flex items-center justify-center gap-6 py-2 px-6">
                    <img src={Search} alt="search" className="w-4 h-4" />
                    <div className="w-[163px] border-t-[6px] border-[#8e8e8e]"></div>
                  </div>
                  <hr className="mt-3 border border-[#f4f7fa]" />
                  <img
                    src={Person6}
                    alt="person"
                    className="w-16 h-16 rounded-full border border-tertiary mt-6 mx-auto"
                  />
                  <h1 className="font-lato text-[13px] text-center mt-2">Shedrach James</h1>
                  <h1 className="text-center font-lato text-[13px] text-[#afafaf]">
                    Software Engineer
                  </h1>
                  <img src={Ratings} alt="ratings" className="mt-7 w-[100px] h-5 mx-auto" />
                  <p className="font-lato text-[13px] text-[#afafaf] w-[251px] mx-auto mt-5">
                    I am a software developer with 10 years of experience, I specialized in building
                    product that solves problems
                  </p>
                  <button className="bg-tertiary text-white py-3 px-[84px] rounded-2xl flex mx-auto mt-7">
                    Hire me
                  </button>
                </div>

                <p className="font-lato text-white font-black w-[462px] mt-14">
                  Whether you’re a job seeker aiming to land your dream job or an employer looking
                  to build a stellar team, [Platform Name] is here to connect you with the right
                  opportunities.
                </p>
              </motion.div>
            )}

            {step === 2 && data.employer === true && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                <div className="flex flex-col items-center">
                  <h1 className="w-[299px] font-lato font-black text-2xl text-center text-white">
                    Your Gateway to Top Talent and Hiring Success!
                  </h1>
                  <img src={Experince} alt="experience" className="mt-16" />
                </div>
              </motion.div>
            )}

            {step === 3 && data.jobSeeker === true && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                <img src={Experince} alt="experience" className="" />
              </motion.div>
            )}

            {step === 3 && data.employer === true && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                <div className="flex flex-col items-center">
                  <h1 className="w-[299px] font-lato font-black text-2xl text-center text-white">
                    Your Gateway to Top Talent and Hiring Success!
                  </h1>
                  <img src={Experince} alt="experience" className="mt-16" />
                  <p className="mt-[77px] text-white font-lato font-black">
                    Whether you’re an employer aiming to build a stellar team or seeking top talent
                    for key roles, [Platform Name] connects you with the right candidates.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
