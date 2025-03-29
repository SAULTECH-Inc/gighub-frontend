import React, { useEffect, useState } from "react";
import ProfileDetails from "./ProfileDetails";
import ProfileDetailsExtension from "./ProfileDetailsExtension";
import {
  ASAbubakar,
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../../assets/images";
import PublicProfile from "./PublicProfile";
import { useParams } from "react-router-dom";


const person = {
  firstname: "Abubakar",
  lastname: "Aasas",
  middlename: "Sasas",
  professionalTitle: "UI/UX Designer",
  email: "Asabubakar@gmail.com",
  address: "Street Road, street road",
  phone: "07011079676",
  portfolio: "inspire.com",
  bio: "I am a UI/UX designer skilled in creating user-friendly, visually appealing digital experiences. My expertise includes wireframing, prototyping, and conducting user research to ensure intuitive and responsive designs. Proficient in tools like Figma, Adobe XD, and Sketch, I focus on delivering accessible and seamless interfaces for both web and mobile. I strive to align design solutions with business goals while solving complex user challenges.",
  numberOfConnections: 500,
  state: "Lagos",
  country: "Nigeria",
  skills: [
    "UI/UX Design",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Figma",
    "Adobe XD",
    "Sketch",
  ],
  // image: "ASAbubakar",
};

const PublicProfileView:React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the applicant ID from the URL
    const [applicant, setApplicant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isWorksampleAvailable] = useState(true);

    useEffect(() => {
        const fetchApplicant = async () => {
          try {
            const response = await fetch(`http://your-api.com/api/applicants/${id}`);
            if (!response.ok) throw new Error("Failed to fetch applicant details");
            const data = await response.json();
            setApplicant(data);
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setLoading(false);
          }
        };
    
        if (id) fetchApplicant();
      }, [id]);
    
      if (loading) return <p>Loading...</p>;
      if (error) return <p className="text-red-500">{error}</p>;
      if (!applicant) return <p>No applicant found.</p>;

  return (
    <div className="bg-[#D9D9D9] flex flex-col w-full items-center gap-5">
      {isWorksampleAvailable && (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-[94%] max-w-[675px] lg:max-w-[1360px] justify-end sm:justify-between gap-2 my-5">
            <div className="hidden sm:flex gap-2 items-center">
              <p className="text-[13px] sm:text-2xl">
                {person.lastname[0]} . {person.middlename[0]} {person.firstname}{" "}
                Profile
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button className="bg-white py-2 px-3 sm:px-[56px] rounded-[10px] text-[13px]">
                Connect
              </button>
              <button className="text-white bg-[#6438C2] py-2 px-3 sm:px-[56px] rounded-[10px] text-[13px]">
                Send messages
              </button>
            </div>
          </div>
          <div className="flex w-[94%] max-w-[1360px] gap-2">
            <div className="hidden lg:flex lg:w-[25%] mb-2">
              <ProfileDetails person={applicant} />
            </div>
            <div className="w-full lg:w-[50%]">
              <PublicProfile />
            </div>
            <div className="hidden lg:flex lg:w-[25%]">
              <ProfileDetailsExtension person={applicant}/>
            </div>
          </div>
        </div>
      )}

      {!isWorksampleAvailable && (
        <div className="bg-white md:my-5 max-w-[900px] w-full relative">
          <div className="sticky top-0 z-10 flex flex-col items-center w-[100%] bg-white">
            <div className="w-[100%] flex flex-col items-center">
              <div className="w-full flex flex-col h-[94px]">
                <div className="w-full h-[64px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] to-white via-50% flex items-center justify-end pr-2">
            <div className="flex w-[94%] max-w-[675px] lg:max-w-[1360px] justify-end gap-2 my-5">
            <div className="flex gap-2 items-center">
              <button className="bg-white py-2 px-3 sm:px-[56px] rounded-[10px] text-[13px]">
                Connect
              </button>
              <button className="text-white bg-[#6438C2] py-2 px-3 sm:px-[56px] rounded-[10px] text-[13px]">
                Send messages
              </button>
            </div>
          </div>
                </div>
                <img
                  src={ASAbubakar}
                  alt="ASAbubakar"
                  className="absolute w-[60px] h-[60px] top-12 left-5 sm:left-11"
                />
                        </div>
                        <div className="w-[90%] mt-4 flex justify-between gap-2">
                          <p className="font-bold text-20px]">
                            {person.lastname[0]}.{person.middlename[0]} {person.firstname}
                          </p>
                          <p className="font-bold text-[#6438C2]">{person.professionalTitle}</p>
                        </div>
                        <div className="w-[90%] flex flex-col gap-2 my-2">
                          <p className="text-[#8E8E8E]">
                            {person.state}, {person.country} . {person.numberOfConnections}k Connections
                          </p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p className="font-medium">Email Address</p>
                          <p className="text-[#8E8E8E] text-[13px]">{person.email}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p className="font-medium">Home Address</p>
                          <p className="text-[#8E8E8E] text-[13px]">{person.address}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p className="font-bold">Phone number</p>
                          <p className="text-[#8E8E8E] text-[13px]">{person.phone}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                        <div className="w-[90%] flex flex-col gap-2 my-4">
                          <p>Portfolio website</p>
                          <p className="text-[#6438C2] text-[13px]">{person.portfolio}</p>
                        </div>
                        <hr className="w-[90%] border-[#E6E6E6]" />
                <div className="w-[90%] flex flex-col gap-2">
                  <p className="mt-2 font-medium">About me</p>
                  <p className="text-[#8E8E8E] text-[13px]">{person.bio}</p>
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Software Skills</p>
                    <div className="text-[#8E8E8E] text-[13px] flex flex-wrap">
                      {person.skills.join(", ")}
                    </div>
                  </div>
                </div>
              <div className="w-[90%] flex flex-col items-center  ">
                <p className="w-full font-bold pt-2">Job experience</p>
                <div className="w-full flex gap-3 items-center mt-2">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#F7F8FA] flex justify-center items-center">
                    <img src={Bagged} alt="Bagged" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">
                      Bachelor of communiacaion
                    </p>
                    <p className="text-[#8E8E8E] text-[13px] font-bold">
                      Paystack Inc . 2021-2023
                    </p>
                  </div>
                </div>
                <p className="w-full text-[13px]  text-[#8E8E8E] leading-[100%] font-bold my-4">
                  As a Graphic Designer at Haris Computer, I create compelling
                  visual designs for marketing, branding, and digital materials
                  to effectively communicate the company's message.
                </p>
                <hr className="w-[40%] border-[#E6E6E6]" />
                <div className="w-full flex gap-3 items-center mt-5">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#F7F8FA] flex justify-center items-center">
                    <img src={Bagged} alt="Bagged" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">
                      Bachelor of communiacaion
                    </p>
                    <p className="text-[#8E8E8E] text-[13px] font-bold">
                      Paystack Inc . 2021-2023
                    </p>
                  </div>
                </div>
                <p className="w-full text-[13px] text-[#8E8E8E] leading-[100%] font-bold my-4">
                  As a Graphic Designer at Haris Computer, I create compelling
                  visual designs for marketing, branding, and digital materials
                  to effectively communicate the company's message.
                </p>

                <button className="bg-[#6438C2] w-[40%] py-2 text-white text-[13px] rounded-[10px]">
                  See more
                </button>
                <hr className="my-5 w-full border-[#E6E6E6]" />
                <p className="w-full font-bold mb-3">Testimonies</p>
                <div className="w-[80%] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center">
                        <img src={Ellipse115} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                  </div>
                  <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                    <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
                <div className="w-[80%] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center">
                        <img src={Ellipse116} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                  </div>
                  <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                    <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
                <div className="w-[80%] flex flex-col mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center">
                        <img src={Ellipse117} alt="Person1" />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[#8E8E8E] text-[13px]">2:20 Am</p>
                  </div>
                  <div className="border-l border-dashed border-[#8E8E8E] ml-[20px] flex justify-center py-3">
                    <p className="text-[13px] font-bold w-[90%] text-[#8E8E8E]">
                      I really love his job, his that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

)
}

export default PublicProfileView;
