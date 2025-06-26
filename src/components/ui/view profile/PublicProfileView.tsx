import React, { useEffect, useState } from "react";
import {
  ASAbubakar,
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../../assets/images";
import { useParams } from "react-router-dom";
import { privateApiClient } from "../../../client/axios";
import {
  APIResponse,
  ApplicantData,
  NetworkDetails,
} from "../../../utils/types";
import {
  API_BASE_URL,
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../../utils/constants";
import TopNavBar from "../../layouts/TopNavBar";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useChatStore } from "../../../store/useChatStore.ts";
import DOMPurify from "dompurify";
import moment from "moment";

const PublicProfileView: React.FC = () => {
  const { setIsClosed, setRecipient, setRecipientDetails } = useChatStore();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : null;
  const [applicant, setApplicant] = useState<ApplicantData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllEducations, setShowAllEducations] = useState(false);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const response = await privateApiClient.get<APIResponse<ApplicantData>>(
          `${API_BASE_URL}/users/${numericId}`,
        );
        const userData: ApplicantData = response?.data?.data;
        setApplicant(userData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicant().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!applicant) return <p>No applicant found.</p>;

  let location = "";
  if (applicant?.city) location += `${applicant.city}, `;
  if (applicant?.country) location += `${applicant.country}. `;
  location += "1k Connections";

  return (
    <div className="bg-[#F7F8FA]">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="flex w-full flex-col items-center gap-5 bg-[#F7F8FA]">
        <div className="relative w-full max-w-[900px] bg-white md:my-5">
          <div className="sticky top-0 z-10 flex w-[100%] flex-col items-center bg-white">
            <div className="flex h-[64px] w-full items-center justify-end bg-gradient-to-r from-[#6438C2] via-[#6438C2] via-50% to-white pr-2">
              <div className="my-5 flex w-[94%] max-w-[675px] justify-end gap-2 lg:max-w-[1360px]">
                <button className="rounded-[10px] bg-white px-3 py-2 text-[13px] sm:px-[56px]">
                  Connect
                </button>
                <button
                  onClick={() => {
                    setRecipient(applicant?.email || "");
                    setRecipientDetails(applicant as NetworkDetails);
                    setIsClosed(false);
                  }}
                  className="rounded-[10px] bg-[#6438C2] px-3 py-2 text-[13px] text-white sm:px-[56px]"
                >
                  Send messages
                </button>
              </div>
            </div>
            <img
              src={ASAbubakar}
              alt="ASAbubakar"
              className="absolute top-12 left-5 h-[60px] w-[60px] sm:left-11"
            />

            <div className="mt-12 flex w-[90%] justify-between gap-2">
              <p className="text-[20px] font-bold">
                {applicant?.lastName}.{applicant?.middleName}{" "}
                {applicant?.firstName}
              </p>
              <p className="font-bold text-[#6438C2]">
                {applicant?.professionalTitle}
              </p>
            </div>

            <div className="my-2 flex w-[90%] flex-col gap-2">
              <p className="text-[#8E8E8E]">{location}</p>
            </div>

            <hr className="w-[90%] border-[#E6E6E6]" />
            <div className="my-4 flex w-[90%] flex-col gap-2">
              <p className="font-medium">Email Address</p>
              <p className="text-[13px] text-[#8E8E8E]">{applicant.email}</p>
            </div>

            <hr className="w-[90%] border-[#E6E6E6]" />
            <div className="my-4 flex w-[90%] flex-col gap-2">
              <p className="font-medium">Home Address</p>
              <p className="text-[13px] text-[#8E8E8E]">{applicant.address}</p>
            </div>

            <hr className="w-[90%] border-[#E6E6E6]" />
            <div className="my-4 flex w-[90%] flex-col gap-2">
              <p className="font-bold">Phone number</p>
              <p className="text-[13px] text-[#8E8E8E]">
                {applicant.phoneNumber}
              </p>
            </div>

            <hr className="w-[90%] border-[#E6E6E6]" />
            <div className="my-4 flex w-[90%] flex-col gap-2">
              <p className="text-[13px] font-semibold sm:text-[16px]">
                Social media handles
              </p>
              <div className="flex gap-5 text-[13px] text-[#6438C2]">
                {applicant.facebookProfile && (
                  <a
                    href={applicant.facebookProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="mr-2 h-5 w-5 cursor-pointer fill-[#1877F2] text-[#8E8E8E]" />
                  </a>
                )}
                {applicant.twitterProfile && (
                  <a
                    href={applicant.twitterProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="mr-2 h-5 w-5 cursor-pointer fill-[#1DA1F2] text-[#8E8E8E]" />
                  </a>
                )}
                {applicant.linkedInProfile && (
                  <a
                    href={applicant.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="mr-2 h-5 w-5 cursor-pointer fill-[#0077B5] text-[#8E8E8E]" />
                  </a>
                )}
                {applicant.githubProfile && (
                  <a
                    href={applicant.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2 h-5 w-5 cursor-pointer fill-[#181717] text-[#8E8E8E]" />
                  </a>
                )}
              </div>
            </div>

            <hr className="w-[90%] border-[#E6E6E6]" />
            <div className="flex w-[90%] flex-col gap-2">
              <p className="mt-2 font-medium">About me</p>
              <div
                className="text-[13px] text-[#8E8E8E]"
                dangerouslySetInnerHTML={{
                  __html: applicant.cv?.professionalSummary || "",
                }}
              ></div>
              <div className="flex flex-col gap-2">
                <p className="font-medium">Software Skills</p>
                <div className="flex flex-wrap text-[13px] text-[#8E8E8E]">
                  {applicant?.cv?.skills
                    .map((skill: any) => skill.skill || "")
                    .join(", ")}
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mt-6 w-[90%]">
              <p className="font-bold">Job Experience</p>
              {(showAllExperiences
                ? applicant?.cv?.experiences
                : applicant?.cv?.experiences?.slice(0, 2)
              )?.map((experience, idx) => (
                <React.Fragment key={idx}>
                  <div className="mt-2 flex w-full items-center gap-3">
                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F7F8FA]">
                      <img src={Bagged} alt="Bagged" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold">
                        {experience?.position}
                      </p>
                      <p className="text-[13px] font-bold text-[#8E8E8E]">
                        {experience?.company} ·{" "}
                        {experience?.startDate
                          ? moment(experience.startDate).format("YYYY")
                          : ""}{" "}
                        -{" "}
                        {experience?.endDate
                          ? moment(experience.endDate).format("YYYY")
                          : "Till Date"}
                      </p>
                    </div>
                  </div>
                  <div
                    className="my-4 w-full text-[13px] leading-[100%] font-bold text-[#8E8E8E]"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(experience?.description || ""),
                    }}
                  ></div>
                  <hr className="w-full border-[#E6E6E6]" />
                </React.Fragment>
              ))}
              {applicant?.cv?.experiences?.length &&
                applicant?.cv?.experiences?.length > 2 && (
                  <button
                    className="my-4 w-full rounded-[10px] bg-[#6438C2] py-2 text-[13px] text-white md:w-[10%]"
                    onClick={() => setShowAllExperiences(!showAllExperiences)}
                  >
                    {showAllExperiences ? "Show less" : "See more"}
                  </button>
                )}
            </div>

            {/* Education Section */}
            <div className="mt-6 w-[90%]">
              <p className="font-bold">Education</p>
              {(showAllEducations
                ? applicant?.cv?.educations
                : applicant?.cv?.educations?.slice(0, 2)
              )?.map((education, idx) => (
                <React.Fragment key={idx}>
                  <div className="mt-2 flex w-full items-center gap-3">
                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F7F8FA]">
                      <img src={Bagged} alt="Bagged" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold">
                        {education?.degree}, {education?.fieldOfStudy}
                      </p>
                      <p className="text-[13px] font-bold text-[#8E8E8E]">
                        {education?.institution} ·{" "}
                        {education?.startDate
                          ? moment(education.startDate).format("YYYY")
                          : ""}{" "}
                        -{" "}
                        {education?.endDate
                          ? moment(education.endDate).format("YYYY")
                          : "Till Date"}
                      </p>
                    </div>
                  </div>
                  <div
                    className="my-4 w-full text-[13px] leading-[100%] font-bold text-[#8E8E8E]"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(education?.description || ""),
                    }}
                  ></div>
                  <hr className="w-full border-[#E6E6E6]" />
                </React.Fragment>
              ))}
              {applicant?.cv?.educations?.length &&
                applicant?.cv?.educations?.length > 2 && (
                  <button
                    className="my-4 w-full rounded-[10px] bg-[#6438C2] py-2 text-[13px] text-white md:w-[10%]"
                    onClick={() => setShowAllEducations(!showAllEducations)}
                  >
                    {showAllEducations ? "Show less" : "See more"}
                  </button>
                )}
            </div>

            {/* Testimonies */}
            <div className="w-[90%]">
              <p className="mb-3 w-full font-bold">Testimonies</p>
              {[Ellipse115, Ellipse116, Ellipse117].map((img, index) => (
                <div key={index} className="flex w-[80%] flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center">
                        <img src={img} alt={`Person${index + 1}`} />
                      </div>
                      <p className="text-[13px] font-bold">Bashir Umar</p>
                    </div>
                    <p className="text-[13px] text-[#8E8E8E]">2:20 AM</p>
                  </div>
                  <div className="ml-[20px] flex justify-center border-l border-dashed border-[#8E8E8E] py-3">
                    <p className="w-[90%] text-[13px] font-bold text-[#8E8E8E]">
                      I really love his job, he's that smart guy you may be
                      searching for
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;
