import React, { useEffect, useState } from "react";
import TopNavBar from "../../../components/layouts/TopNavBar";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../../utils/constants";
import { InterviewType } from "../../../utils/enums";
import {
  InterviewScheduleDetailsResponse,
  NetworkDetails,
} from "../../../utils/types";
import {
  FaBriefcase,
  FaCalendar,
  FaClock,
  FaGlobe,
  FaHourglassHalf,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaVideo,
} from "react-icons/fa";
import { capitalizeEachCase, formatTime } from "../../../utils/helpers.ts";
import { Link, useParams } from "react-router-dom";
import { getInterviewDetails } from "../../../services/api";
import { useChatStore } from "../../../store/useChatStore.ts";

interface InfoProps {
  icon: React.ReactNode;
  label: string;
}

const ScheduledInterviews: React.FC = () => {
  const { setRecipient, setRecipientDetails, setIsClosed } = useChatStore();
  const [interview, setInterview] =
    useState<InterviewScheduleDetailsResponse>({} as InterviewScheduleDetailsResponse);
  const [showAll, setShowAll] = useState(false);
  const maxToShow = 1;

  const applicantsToShow = showAll
    ? interview.applicants
    : interview.applicants.slice(0, maxToShow);

  const { interviewId } = useParams();

  useEffect(() => {
    // Fetch interview details using the interviewId from the URL
    const fetchInterviewDetails = async () => {
      // Replace with actual API call
      console.log(`Fetching details for interview ID: ${interviewId}`);
      const id = Number(interviewId);
      return await getInterviewDetails(id);
    };

    if (interviewId) {
      fetchInterviewDetails()
        .then((response) => {
          setInterview(response.data);
        })
        .catch((error) => {
          console.error("Error fetching interview details:", error);
        });
    }
  }, [interviewId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#E6E6E6] bg-white p-8 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#A0A0A0] pb-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Interview: {interview.title}
          </h2>
        </div>

        {/* Applicants */}
        <div className="mt-6 space-y-5">
          {applicantsToShow.map((applicant, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-[#A0A0A0] bg-gray-50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl font-bold uppercase text-purple-800 shadow-sm">
                  {applicant?.firstName && applicant?.firstName[0]}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {applicant.professionalTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setRecipient(applicant?.email || "");
                  setRecipientDetails({ ...applicant } as NetworkDetails);
                  setIsClosed(false);
                }}
                className="rounded-md bg-purple-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
              >
                Message
              </button>
            </div>
          ))}

          {/* Show more / less toggle */}
          {interview.applicants.length > maxToShow && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-2 text-sm text-purple-600 underline hover:text-purple-800"
              >
                {showAll
                  ? "Show Less"
                  : `Show All (${interview.applicants.length}) Applicants`}
              </button>
            </div>
          )}
        </div>

        {/* Interview Metadata */}
        <div className="mt-8 grid grid-cols-1 gap-5 text-sm sm:grid-cols-2">
          <Info icon={<FaCalendar />} label={`Date: ${interview.date}`} />
          <Info
            icon={<FaClock />}
            label={`Time: ${formatTime(interview.startTime)} - ${formatTime(interview.endTime)}`}
          />
          <Info
            icon={<FaHourglassHalf />}
            label={`Duration: ${interview.duration} minutes`}
          />
          <Info
            icon={<FaBriefcase />}
            label={`Role: ${interview?.job?.title}`}
          />
          <Info
            icon={<FaGlobe />}
            label={`Type: ${capitalizeEachCase(interview.interviewType.replace("-", " "))}`}
          />
          <Info
            icon={<FaVideo />}
            label={`Platform: ${capitalizeEachCase(interview.interviewPlatform)}`}
          />
        </div>

        {/* Virtual/Physical Info */}
        {interview.interviewLink &&
          interview.interviewType !== InterviewType.IN_PERSON && (
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-sm font-semibold">Meeting Link:</p>
              <a
                href={interview.interviewLink}
                className="break-words text-sm text-purple-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                {interview.interviewLink}
              </a>
              <div className="mt-2">
                <Link
                  to={interview.interviewLink}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                >
                  Join Now
                </Link>
              </div>
            </div>
          )}

        {(interview.interviewType === InterviewType.IN_PERSON ||
          interview.interviewType === InterviewType.HYBRID) && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info
              icon={<FaMapMarkerAlt />}
              label={`City: ${interview.interviewCity}`}
            />
            <Info
              icon={<FaLocationArrow />}
              label={`Address: ${interview.interviewAddress}`}
            />
          </div>
        )}

        {/* Notes */}
        {interview.notes && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Notes:</p>
            <p className="text-sm italic text-gray-600">{interview.notes}</p>
          </div>
        )}

        {/* Files */}
        {interview?.files && interview?.files?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Attachments:</p>
            <ul className="mt-1 list-disc space-y-1 pl-6 text-sm text-blue-600">
              {interview?.files?.map((file, i) => (
                <li key={i}>
                  <a
                    href={`/uploads/${file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <button className="rounded-md border border-[#E6E6E6] bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200">
            Delete Schedule
          </button>
          <button className="rounded-md border border-[#E6E6E6] bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200">
            Edit Schedule
          </button>
          <button className="rounded-md bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

const Info: React.FC<InfoProps> = ({ icon, label }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FA] text-lg text-[#8E8E8E]">
      {icon}
    </div>
    <span className="font-medium leading-5 text-gray-700">{label}</span>
  </div>
);

export default ScheduledInterviews;
