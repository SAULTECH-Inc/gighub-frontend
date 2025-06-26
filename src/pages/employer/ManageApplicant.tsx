import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import SearchIcon from "../../components/common/SearchIcon.tsx";
import {
  FilterIcon,
  EmailIcon,
  Teams,
  Calendar,
  Work,
  Eye,
  Download,
} from "../../assets/icons.ts";
import {
  Person7,
  Referrer1,
  Referrer2,
  Referrer3,
} from "../../assets/images.ts";
import { FaCheck } from "react-icons/fa";
import { FC, useEffect, useState } from "react";
import ManageApplicantModal from "../../components/ui/ManageApplicantModal.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import {
  ApplicantData,
  ApplicationResponse,
  NetworkDetails,
} from "../../utils/types";
import {
  fetchMyJobsApplications,
  setViewedApplication,
} from "../../services/api";
import moment from "moment";
import { Link } from "react-router-dom";
import { useApplicationView } from "../../store/useApplicationView..ts";
import { ApplicationStatus } from "../../utils/dummyApplications.ts";
import InterviewScheduleMultiStepForm from "./interview/InterviewScheduleMultiStepForm.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import InterviewScheduleSuccessModal from "../../components/ui/InterviewScheduleSuccessModal.tsx";
import { useScheduleInterview } from "../../store/useScheduleInterview.ts";
import { useChatStore } from "../../store/useChatStore.ts";

const ManageApplicant: FC = () => {
  const { openModal } = useModalStore(); // Access the modals state
  const { setRecipient, setRecipientDetails, setIsClosed, messages } =
    useChatStore();
  const {
    selectedApplication,
    setSelectedApplication,
    applicationStatus,
    setApplicationStatus,
  } = useApplicationView();
  const { interviewId, setSelectedCandidates, selectedCandidates } =
    useScheduleInterview();
  const [applications, setApplications] = useState<ApplicationResponse[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const doFetchApplications = async () => {
      return await fetchMyJobsApplications(applicationStatus, page, limit);
    };
    doFetchApplications()
      .then((response) => {
        setApplications(response.data);
        setTotalPages(response?.meta?.totalPages || 0);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, [page, limit, applicationStatus, totalPages]);

  const handleOpenApplicantDetails = async (
    application: ApplicationResponse,
  ) => {
    setSelectedApplication(application);
    const response = await setViewedApplication(application.id);
    if (response.statusCode === 200) {
      console.log("Application marked as viewed");
      //update the application list
      const updatedApplications = applications?.map((app) =>
        app.id === application.id ? response.data : app,
      );
      setApplications(updatedApplications);
    } else {
      console.error("Error marking application as viewed");
    }
    // openModal("manage-applicant-modal");
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA]">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />

      <div className="flex w-full flex-col items-center">
        <div className="mt-5 flex w-[95%] flex-col rounded-[16px] bg-white md:flex-row md:justify-between">
          <div className="flex flex-col px-5 py-3">
            <div className="flex w-full flex-col">
              <h1 className="text-[32px] leading-[28.8px] font-bold text-[#000000]">
                {selectedApplication?.job.title || ""}
              </h1>
              <p className="text-[#8E8E8E]">
                Open Hiring / Product Designer / Applied
              </p>
            </div>
            <div className="flex gap-4 py-5">
              <button
                onClick={() => {
                  setApplicationStatus("all");
                }}
                className={`${applicationStatus === "all" ? "bg-[#6438C2] text-white" : "border border-[#E6E6E6] text-[#8E8E8E]"} rounded-[10px] px-5 py-[9px]`}
              >
                All Applied
              </button>
              <button
                onClick={() => {
                  setApplicationStatus("Interview Scheduled");
                }}
                className={`text-[#8E8E8E] ${applicationStatus === "Interview Scheduled" ? "bg-[#6438C2] text-white" : "text-[#8E8E8E]"} rounded-[10px] border border-[#E6E6E6] px-5 py-[9px]`}
              >
                Schedule Interview
              </button>
            </div>
          </div>
          <div className="hidden items-center justify-between sm:flex md:flex-col md:items-end md:py-4">
            <div className="flex items-center justify-between gap-4 p-5">
              <button className="rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-white transition-all duration-300 ease-out active:scale-95">
                Close job
              </button>
              <button className="rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-white transition-all duration-300 ease-out active:scale-95">
                Listed job
              </button>
            </div>
            <button className="mr-3 flex min-w-[78px] items-center gap-2 rounded-[10px] border border-[#E6E6E6] px-9 py-3">
              <img src={FilterIcon} alt="FilterIcon" />
              <p className="hidden font-extrabold text-[#8E8E8E] md:block">
                Filter
              </p>
            </button>
          </div>
        </div>
        <div className="flex w-full items-center justify-between sm:hidden">
          <div className="flex items-center justify-between gap-4 p-5">
            <button className="rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-[14px] text-white transition-all duration-300 ease-out active:scale-95 sm:text-base">
              Close job
            </button>
            <button className="rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-[14px] text-white transition-all duration-300 ease-out active:scale-95 sm:text-base">
              Listed job
            </button>
          </div>
          <button className="mr-3 flex min-w-[78px] items-center gap-2 rounded-[10px] border border-[#E6E6E6] px-9 py-3">
            <img src={FilterIcon} alt="FilterIcon" />
            <p className="hidden font-extrabold text-[#8E8E8E] md:block">
              Filter
            </p>
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="my-5 flex w-[95%] flex-col justify-between md:flex-row">
          <div className="mdl:w-[25%] rounded-[16px] bg-white p-4">
            <div className="flex w-full flex-col gap-4">
              <p className="text-[20px] font-extrabold text-[#000000]">
                Application
              </p>
              <div className="flex w-full items-center gap-1 rounded-[10px] border border-[#E6E6E6] px-2 py-[6px]">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicant here"
                  className="placeholder-text-[11px] placeholder-text-[#8E8E8E] border-none bg-transparent focus:ring-transparent focus:outline-none"
                />
              </div>
              <div className="flex w-full items-center gap-4 md:gap-12">
                <div className="flex items-center gap-2">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                  <p className="text-[13px] text-[#8E8E8E]">Viewed</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#6438C2]"></div>
                  <p className="text-[13px] text-[#8E8E8E]">Incoming message</p>
                </div>
              </div>
              {/*Applicant list*/}
              <div className="flex w-full flex-col gap-4">
                {applications
                  ?.filter((application) =>
                    `${application.applicant.firstName} ${application.applicant.lastName}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  ?.map((application) => {
                    return (
                      <div
                        key={application.id}
                        onClick={() => handleOpenApplicantDetails(application)}
                        className={`group relative cursor-pointer ${
                          application.id === selectedApplication?.id
                            ? "bg-[#6438C2]"
                            : "bg-[#F7F8FA]"
                        } flex items-center justify-between rounded-[10px] p-3 transition-all duration-300 ease-out hover:bg-[#6438C2] active:scale-95`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            {application.status ===
                              ApplicationStatus.VIEWED && (
                              <div className="absolute right-0 h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                            )}
                            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full">
                              <img
                                className="h-full w-full rounded-full"
                                src={
                                  application.applicant.profilePicture ||
                                  Person7
                                }
                                alt="Person Profile Picture"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-start">
                            <p
                              className={`text-[13px] ${
                                application.id === selectedApplication?.id
                                  ? "text-white"
                                  : "text-[#000000] group-hover:text-white"
                              }`}
                            >
                              {application.applicant.firstName}{" "}
                              {application.applicant.lastName}
                            </p>
                            <p
                              className={`text-[11px] ${
                                application.id === selectedApplication?.id
                                  ? "text-white"
                                  : "text-[#8E8E8E] group-hover:text-white"
                              }`}
                            >
                              {moment(application.createdAt).format("lll")}
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => {
                            setRecipient(application?.applicant?.email || "");
                            setRecipientDetails({
                              ...application.applicant,
                            } as NetworkDetails);
                            setIsClosed(false);
                          }}
                          className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E6E6E6] shadow-sm transition-all duration-300 ${
                            application.id === selectedApplication?.id
                              ? "bg-white shadow-md"
                              : "bg-[#F7F8FA] group-hover:bg-white group-hover:shadow-md"
                          }`}
                        >
                          {/* Message Icon */}
                          <img
                            src={EmailIcon}
                            alt="Mailbox Icon"
                            className="h-5 w-5"
                          />

                          {/* Purple Notification Badge */}
                          {messages?.filter(
                            (message) =>
                              message.sender === application.applicant.email &&
                              !message.read,
                          ).length > 0 && (
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-purple-600"></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="mb-5 ml-[18px] flex flex-col overflow-hidden rounded-[16px] bg-white pb-5 md:w-[75%]">
            <div className="relative h-[108px] w-full bg-gradient-to-r from-[#6438C2] to-[#D9D9D9]">
              <div className="bg-opacity-50 absolute bottom-[-40%] left-5 h-[100px] w-[100px]">
                <img
                  src={
                    selectedApplication?.applicant?.profilePicture || Person7
                  }
                  alt="Person7"
                  className="h-full w-full rounded-full"
                />
              </div>
            </div>
            <div className="mx-auto mt-[50px] flex w-[95%] flex-col lg:mt-4">
              <div className="flex flex-row flex-wrap gap-4 md:mb-[35px] md:justify-between lg:flex-col-reverse">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="flex min-w-[247px] flex-col">
                    <div className="relative text-2xl font-extrabold text-[#000000]">
                      {selectedApplication?.applicant?.firstName}{" "}
                      {selectedApplication?.applicant?.lastName}
                      <div className="absolute top-0 left-[150px] h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                    </div>
                    <p
                      className="text-[13px] text-[#8E8E8E]"
                      dangerouslySetInnerHTML={{
                        __html: selectedApplication?.cv?.headline || "",
                      }}
                    ></p>
                  </div>
                  <div className="flex gap-2 md:justify-between md:gap-[200px]">
                    <Link
                      to={selectedApplication?.cv?.videoCv || ""}
                      className="flex max-w-[200px] items-center rounded-[10px] border border-[#6438C2] px-5 text-center text-sm font-medium text-[#6438C2] md:text-[16px]"
                    >
                      Watch my video Pitch
                    </Link>
                    {applicationStatus === "all" ? (
                      <button
                        onClick={() => {
                          openModal("interview-schedule");
                          //add candidate to interview
                          const updatedSelectedCandidates = [
                            ...selectedCandidates,
                            selectedApplication?.applicant,
                          ];
                          setSelectedCandidates(
                            updatedSelectedCandidates as ApplicantData[],
                          );
                        }}
                        className="max-w-[194px] rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-sm font-bold text-white md:text-[16px]"
                      >
                        Schedule Interview
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setRecipient(
                            selectedApplication?.applicant?.email || "",
                          );
                          setRecipientDetails(
                            selectedApplication?.applicant as NetworkDetails,
                          );
                          setIsClosed(false);
                        }}
                        className="max-w-[194px] rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-sm font-bold text-white md:text-[16px]"
                      >
                        Send Message
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-4 rounded-[10px] bg-[#F4F7FA] px-4 py-1 md:min-w-[364px] lg:self-end">
                  <p className="font-extrabold text-[#000000]">Referrer</p>
                  <div className="flex gap-2">
                    <img src={Referrer1} alt="Referrer1" />
                    <img src={Referrer2} alt="Referrer2" />
                    <img src={Referrer2} alt="Referrer3" />
                    <img src={Referrer3} alt="Referrer4" />
                    <img src={Referrer1} alt="Referrer5" />
                    <p className="font-extrabold text-[#6438C2]">+5 </p>
                    <span className="hidden font-extrabold text-[#6438C2] md:block">
                      more
                    </span>
                  </div>
                </div>
              </div>
              <hr className="border-[#E6E6E6]" />
              <div className="mt-4 flex flex-wrap gap-4 lg:flex-nowrap lg:justify-between">
                <div className="lg:w-[60%]">
                  <div>
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      About Me
                    </h2>
                    <div
                      className="text-[13px] font-medium text-[#8E8E8E]"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedApplication?.cv?.professionalSummary || "",
                      }}
                    ></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Experiences
                    </h2>

                    {selectedApplication?.cv?.experiences?.map(
                      (experience, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-4"
                          >
                            <div className="pt-[10px]">
                              <div className="flex h-[13px] w-[13px] flex-col items-center justify-center rounded-full bg-[#6438C2]">
                                <FaCheck className="h-[5px] w-[5px] fill-white" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="">
                                <h3 className="flex items-center text-[20px] font-medium text-[#000000]">
                                  {experience.position} - {experience.company}
                                </h3>
                                <p className="text-[13px] font-medium text-[#8E8E8E]">
                                  {moment(experience.startDate).format(
                                    "MMM YYYY",
                                  ) +
                                    " - " +
                                    (experience.endDate
                                      ? moment(experience.endDate).format(
                                          "MMM YYYY",
                                        )
                                      : "Present")}
                                </p>
                              </div>
                              <div
                                className="text-[13px] font-medium text-[#8E8E8E]"
                                dangerouslySetInnerHTML={{
                                  __html: experience.description || "",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Education
                    </h2>
                    {selectedApplication?.cv?.educations?.map(
                      (education, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-4"
                          >
                            <div className="pt-[10px]">
                              <div className="flex h-[13px] w-[13px] flex-col items-center justify-center rounded-full bg-[#6438C2]">
                                <FaCheck className="h-[5px] w-[5px] fill-white" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="">
                                <h3 className="flex items-center text-[20px] font-medium text-[#000000]">
                                  {education.degree} - {education.institution}
                                </h3>
                                <p className="text-[13px] font-medium text-[#8E8E8E]">
                                  {moment(education.startDate).format(
                                    "MMM YYYY",
                                  ) +
                                    " - " +
                                    (education.endDate
                                      ? moment(education.endDate).format(
                                          "MMM YYYY",
                                        )
                                      : "Present")}
                                </p>
                              </div>
                              <div
                                className="text-[13px] font-medium text-[#8E8E8E]"
                                dangerouslySetInnerHTML={{
                                  __html: education.description || "",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  {/*  Skills*/}
                  <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication?.cv?.skills?.map((skill, index) => {
                        return (
                          <button
                            key={index}
                            className="rounded-[10px] bg-[#F7F8FA] px-4 py-1 text-[13px] font-medium text-[#8E8E8E]"
                          >
                            {skill.skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/*  Certifications*/}
                  <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Certifications
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication?.cv?.certifications?.map(
                        (certification, index) => {
                          return (
                            <button
                              key={index}
                              className="rounded-[10px] bg-[#F7F8FA] px-4 py-1 text-[13px] font-medium text-[#8E8E8E]"
                            >
                              {certification.certification} -{" "}
                              {certification.institution}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex h-fit w-[100%] flex-col gap-4 rounded-[16px] bg-[#F7F8FA] p-4 lg:max-w-[319px]">
                  <h2 className="text-[20px] font-medium text-[#000000]">
                    Application Overview
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                      <img src={Teams} alt="Teams" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#000000]">
                        Applied For
                      </h3>
                      <p className="text-[#8E8E8E]">
                        {selectedApplication?.job?.title || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                      <img src={Calendar} alt="Calendar" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#000000]">
                        Application date
                      </h3>
                      <p className="text-[#8E8E8E]">
                        {moment(selectedApplication?.createdAt).format("lll")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                      <img src={Work} alt="Work" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#000000]">Experience</h3>
                      <p className="text-[#8E8E8E]">
                        {selectedApplication?.job?.experienceYears} years
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-[18px] font-medium text-[#000000]">
                      File Attachment
                    </h2>
                    <div className="flex justify-between rounded-[10px] bg-white px-4 py-2">
                      <div>
                        <p className="text-[13px] font-medium text-[#8E8E8E]">
                          AS-cv-updated
                        </p>
                        <p className="text-[13px] font-medium text-[#8E8E8E]">
                          File Pdf - 9.3 MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={Eye} alt="Eye Icon" className="h-6 w-6" />
                        <img
                          src={Download}
                          alt="Download Icon"
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between rounded-[10px] bg-white px-4 py-2">
                      <div>
                        <p className="text-[13px] font-medium text-[#8E8E8E]">
                          AS-cv-updated
                        </p>
                        <p className="text-[13px] font-medium text-[#8E8E8E]">
                          File Pdf - 9.3 MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={Eye} alt="Eye Icon" className="h-6 w-6" />
                        <img
                          src={Download}
                          alt="Download Icon"
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ManageApplicantModal modalId="manage-applicant-modal" />
      <InterviewScheduleMultiStepForm modalId="interview-schedule" />
      <InterviewScheduleSuccessModal
        modalId="success-modal"
        interviewId={interviewId as number}
      />
    </div>
  );
};

export default ManageApplicant;
